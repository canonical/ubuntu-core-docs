# Inside Ubuntu Core

The kernel, boot assets, runtime environment, applications and device enablement capabilities are all delivered as snaps that are controlled by _snapd_ (the snap daemon), which is itself packaged as a snap.

See below for how these elements combine in Ubuntu Core:

## Volume layouts

The storage layout of the generated image used to install Ubuntu Core, and the resultant storage on the device after installation, is described by the [gadget snap](/reference/gadget-snap-format) and its associated `gadget.yaml` file.

Ubuntu Core typically uses the following storage partitions:

* **ubuntu-seed** (role: system-seed; read-only, vfat-formatted): contains the configuration for the first-stage/recovery boot loader and at least one recovery system. This is a set of snaps (base, kernel, gadget and application snaps), together with a model assertion and snap assertions, that define the device and from which the device can be recovered or reinstalled. This is the only partition actually created by the auto installable image built by `ubuntu-image`.
* **ubuntu-boot** (role: system-boot; read-only, ext4 or vfat): contains the second-state/run bootloader and unpacked kernel(s) to boot and with initramfs which decrypts the ubuntu-data and ubuntu-save partition.
* **ubuntu-save** (role: system-save; writable, ext4): stores device identity backup data and data to facilitate recovery or re-install. This partition is mandatory on encrypted systems where it should have a minimum size of approximately 20+MB to handle volume and file system creation.
* **ubuntu-data** (role: system-data; writable, ext4): stores user and system data. This partition is often minimally sized in the image but extended during device initialisation to use all the space available.

All these partitions but `ubuntu-seed` are created at installation time.

## Boot process

The system boot process:

* verifies the bootloaders and kernel signatures
* measures the above and the kernel command line with the TPM
* on top of the above trusted set the snapd initrd code measures the snap device model
* snapd then separately verifies other snaps with their assertions as needed

*snap-bootstrap* is the main executable that is run during the early _initramfs_ booting stage of UC2x. It has the following responsibilities:

1. Mounting selected partitions from the disk that UC2x is on. Partitions include _data_, system-boot, seed, and if present, save (optional on unencrypted devices).
1. As part of mounting those partitions, *snap-bootstrap* may perform the necessary steps to unlock any encrypted partitions such as ubuntu-data and ubuntu-save (see [Full disk encryption](/explanation/full-disk-encryption)).
1. After unlocking and mounting all such partitions, *snap-bootstrap* then chooses which [base snap](https://snapcraft.io/docs/base-snaps) is to be used for the root filesystem of userspace (the root filesystem of the initramfs is just a static set of files built into the initramfs and is not the final root filesystem), and mounts this base snap file.
1. *snap-bootstrap* then chooses which kernel snap is to be used to mount and find additional kernel modules that are not compiled into the kernel or shipped as modules inside the initramfs or otherwise loaded as DTBs, etc.
1. *snap-bootstrap* will then mount the ubuntu-data partition such that either the writable components of the root filesystem come from this actual partition, or if the mode the system is booting into is an ephemeral system such as install or recover, will mount a temporary filesystem for this.
1. *snap-bootstrap* on kernel and base snap upgrades will also handle updating bootloader environment variables to implement A/B or try-boot functionality.
1. *snap-bootstrap* then finally may do some additional setup of the root filesystem such as copying some default files for ephemeral system modes such as recover.

## Ubuntu Core snaps 

The following components make up Ubuntu Core:
- **snapd** is the system daemon that supervises all other snaps on Ubuntu Core. It exposes a REST API that makes Ubuntu Core appliances IP-addressable by default. This API facilitates device management.

- **application snaps** define the functionality of an embedded device and are confined with all their dependencies to their own sandbox. Interfaces to other applications or to the system must be explicitly defined.

- **system snaps** are considered critical to the function of the system, and include the snaps for _network-manager_, _modem-manager_ and _bluez_.

  Related to system snaps, but in a less critical category, are snaps that enable device capabilities like audio, power and disk storage, alongside Docker container orchestration and virtualisation capabilities, including Microk8s and LXD.

- **boot assets**  come from the [gadget snap](/reference/gadget-snap-format) and include board-specific binaries and data, such as bootloader, device tree, configuration files, and cloud-init configuration for edge virtualisation use cases. The gadget snap is typically issued and signed by board OEM/ODMs.

- **base snap** holds the execution environment inside which applications run. It also serves as the root file system for Ubuntu Core images. Core snaps include basic Ubuntu 2x.04 LTS packages.

- **kernel snap** holds the kernel image and associated modules. It will also contain an initial ramdisk image for system initialisation. Firmware and device tree files can optionally be packaged here. The kernel snap can be updated but it cannot be swapped.

The above snaps are combined using the `ubuntu-image` tool to create the Ubuntu Core installation image. The typical layout will be a disk with a single partition (`ubuntu-seed`) as follows:

![core-partition-layout|690x142](https://assets.ubuntu.com/v1/4f857fca-uc-diag-02.png) 

After installation, which happens on first boot, the layout will be similar to what is depicted below:

![uc2x block diagram|690x517](https://assets.ubuntu.com/v1/033c55fb-uc-diag-03.png) 

## The REST API

Ubuntu Core exposes a built-in [REST API](https://snapcraft.io/docs/snapd-api) for secure device command and control. Authenticated and authorised clients can perform software management and configuration tasks on their Ubuntu Core devices remotely. Devices running Ubuntu Core can be configured remotely via the REST API.

![core-partition-layout (1)|628x168](https://assets.ubuntu.com/v1/e9bba730-uc-diag-01.png) 

See also [Snaps in Ubuntu Core](/explanation/core-elements/snaps-in-ubuntu-core) for a general overview.



