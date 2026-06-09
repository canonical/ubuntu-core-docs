---
myst:
  html_meta:
    description: Execute CUDA workloads packaged inside snaps or docker containers on Ubuntu Core devices
---

(ref-run-cuda-workloads-on-ubuntu-core)=
# Run CUDA workloads on Ubuntu Core

## Introduction

This document will explain the key components of leveraging CUDA cores on NVIDIA
GPUs. Utilizing an NVIDIA GPU in this way is entirely separate from using the
NVIDIA GPU as the DRI device, which means that one can use integrated Intel
graphics (or, indeed, no graphics at all) and still use the CUDA cores available
to them.

At this time, using an NVIDIA GPU as the DRI device is being actively worked on.
It is not clear if there are any conflicts between using an NVIDIA GPU for both
graphics and CUDA on Ubuntu Core devices.

## Ubuntu Core 24+

The general implementation is similar across Core releases, using the respective
versions of the mentioned snaps. This section will make references to Ubuntu Core
24 specific snaps.

On Ubuntu Core 24+, most of the setup for kernel drivers and libraries is already
taken care of as part of the distribution.
Completion of the setup is a responsibility of the device owner, who must install
the NVIDIA kernel drivers and userspace libraries, and of the application
developer who must grant their application access to the libraries.

### Install the dependencies

On a running device, you can verify which components for the kernel snap can be
installed:

```console
$ snap components pc-kernel
Component                      Status     Type
pc-kernel+nouveau-ko           available  kernel-modules
pc-kernel+nvidia-550-erd-ko    available  kernel-modules
pc-kernel+nvidia-550-erd-user  available  standard
pc-kernel+nvidia-570-erd-ko    available  kernel-modules
pc-kernel+nvidia-570-erd-user  available  standard
pc-kernel+nvidia-580-erd-ko    available  kernel-modules
pc-kernel+nvidia-580-erd-user  available  standard
```

To install and enable them, run:

```console
snap install pc-kernel+nvidia-580-erd-ko pc-kernel+nvidia-580-erd-user
modprobe nvidia_drm modeset=1
modprobe nvidia_uvm
```

Finally, install the correct mesa libraries snap to include the NVIDIA libraries:

```console
snap install mesa-2404
```

To include all the dependencies in the factory image to install on the devices,
the model assertion should include these entries in the **snaps** list:

```json
{
    "name": "pc-kernel",
    "type": "kernel",
    "default-channel": "24/stable",
    "id": "pYVQrBcKmBa0mZ4CCN7ExT6jH8rY1hza",
    "components": {
        "nvidia-580-erd-ko": {
            "presence": "required"
        },
        "nvidia-580-erd-user": {
            "presence": "required"
        }
    }
},
{
    "name": "mesa-2404",
    "id": "HyhSEBPv3vHsW6uOHkQR384NgI7S6zpj",
    "default-channel": "latest/stable"
}
```

### Application as a Snap

The **mesa-2404** snap exposes a slot to allow other applications to access the
libraries:

```yaml
slots:
  gpu-2404:
    interface: content
    source:
      read:
      - $SNAP/bin
      - $SNAP/drirc.d
      - $SNAP/libdrm
      - $SNAP/mesa-2404
      - $SNAP/X11
      - $SNAP_DATA/kernel-gpu-2404
```
Your application needs to define a matching plug:

```yaml
plugs:
  gpu-2404:
    interface: content
    target: $SNAP/gpu-2404
    default-provider: mesa-2404
```

Upon (automatic) connection, **$SNAP/gpu-2404/** will contain the CUDA libraries.
The application needs to be configured to utilize them. Follow the instructions
from the [canonical/gpu-snap](https://github.com/canonical/gpu-snap#base-core24-snaps)
repository to set up the required wrapper script and ``command-chain`` property.

The app also requires (at least) the following plugs:

```yaml
apps:
  my-app:
    plugs:
      - opengl
      - gpu-2404
      - network-bind
```

### Application in a Docker container

Install the docker snap (or include it in your model assertion):

```console
snap install docker --channel core24/stable
```

Verify that the plug to access the libraries is connected, and that the NVIDIA
runtime is configured:

```console
$ snap connections docker
Interface          Plug             Slot                Notes
[...]
content[gpu-2404]  docker:gpu-2404  mesa-2404:gpu-2404  -
[...]
$ docker info | grep -i nvidia
 Runtimes: nvidia runc io.containerd.runc.v2
```
A docker container carrying CUDA workloads can be run with the options:

```console
docker run --runtime nvidia --gpus all <image name>:<tag>
```

The container can be built using a base Ubuntu image (e.g. `ubuntu:24.04`) without
including userspace libraries. The **docker** snap accesses the libraries from the
**mesa-2404** snap through the content plug **gpu-2404**. The shared directory is
found at **/snap/docker/<revision>/gpu-2404/usr/lib/x86_64-linux-gnu** on the host,
and the docker snap mounts it inside the container when using the NVIDIA runtime.
This path is accessible inside the container as **$NVIDIA_CTK_LIBCUDA_DIR**.

## Ubuntu Core 22

```{warning}
This approach is deprecated and unsupported. Please refer to the previous section for a more stable approach.
```

### Requirements

- snapd 2.59+
- pc-kernel 22/stable (rev. 1258+)
- ubuntu-frame
- [nvidia-assemble](https://github.com/canonical/nvidia-assemble) 22/stable (rev. 62+)
- [nvidia-core22](https://github.com/canonical/nvidia-core22) latest/stable (rev. 14+)

### Background

The **nvidia-assemble** snap functions to build and load, at run-time, the NVIDIA
proprietary kernel modules. Because the snap is building kernel modules, the
functionality of this snap is pegged to a particular kernel ABI. As a result,
**great care must be taken** to ensure ABI compatibility between the currently
available **nvidia-assemble** and **pc-kernel** snaps. Anyone attempting to use the
**nvidia-assemble** snap should be aware that they should perform regular testing
to ensure functionality between refreshes, and should utilize validation sets or
some other form of refresh control to restrict updates to these critical snaps
until the new revisions have been validated.

### How it works

Using CUDA requires both kernel drivers as well as userspace libraries. The
kernel drivers are provided by the **nvidia-assemble** snap and some userspace
libraries are provided by the **nvidia-core22** snap. A third snap will use provide
some libraries provided to execute the required work on their device’s CUDA
cores, for instance **libCUDA**.

The **nvidia-assemble** snap includes a single one-shot daemon which will build the
required modules. The **pc-kernel** snap is built to include several key symlinks
which point to the location where these built modules will be to ensure that
they can be loaded at runtime.

### Interfaces

The **nvidia-assemble** snap uses two interfaces:

1. [kernel-module-load](https://snapcraft.io/docs/kernel-module-load-interface)
2. [nvidia-driver-support](https://snapcraft.io/docs/nvidia-drivers-support-interface)

The **kernel-module-load** interface is used to dynamically load the required
kernel modules for the NVIDIA GPU (**nvidia.ko** et al.).

The **nvidia-driver-support** interface provides the nvidia-assemble snap the
ability to dynamically create character device nodes under **/dev** which
correspond to the NVIDIA GPU on the device.

These interfaces should autoconnect when installed from the Global Store.

The **nvidia-core22** snap functions similarly to the **mesa-XXXX** snaps by providing
a content interface to grant other snaps access to the relevant userspace
libraries for the NVIDIA GPU. This interface is called **graphics-core22**. The
snap which requires these libraries to use CUDA cores will have to declare this
content interface as a plug in its **snapcraft.yaml**.

### Testing

Ensure that the kernel modules have successfully loaded by running:

```console
ls -latr /dev/nvidia*
lsmod | grep nvidia
```

If the character devices nor the modules are created or loaded, the
nvidia-assemble daemon has probably failed. Check for why with:

```console
snap logs nvidia-assemble
```

If the modules have been loaded and the character devices have been created, you
can test to see if CUDA is working by installing the [graphics-core22-samples](https://github.com/xnox/graphics-core22-samples)
example snap, which includes some basic tests for CUDA support. Install the snap
and connect the interfaces:

```console
snap install graphics-core22-samples
snap connect graphics-core22-samples:graphics-core22 nvidia-core22:graphics-core22
snap connect graphics-core22-samples:hardware-observe
snap connect graphics-core22-samples:kernel-module-observe
snap connect graphics-core22-samples:network-bind
snap connect graphics-core22-samples:opengl
```

From there, query some EGL card information, CUDA device information, and
execute a sample CUDA application:

```console
graphics-core22-samples.eglinfo
graphics-core22-samples.deviceQuery
graphics-core22-samples.bandwidthTest
```

### SecureBoot

Kernel module signing is a relatively straight-forward process in general: a
signature is appended to the :file:`.ko` file which the kernel then verifies against
the known-signing keys at module load-time. The **nvidia-assemble** daemon runs a
build script **BUILD** provided by the pc-kernel snap which

1. Builds the **.ko** files, and
2. Appends the module **.sig** files

This means that using an NVIDIA GPU should work seamlessly on Ubuntu Core
devices with SecureBoot enabled.
