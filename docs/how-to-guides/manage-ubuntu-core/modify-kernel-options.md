(how-to-guides-manage-ubuntu-core-modify-kernel-options)=
# Modify kernel options

When using the default GNU GRUB bootloader, kernel boot parameters can be customised without breaking the integrity of the TPM backed full disk encryption (requires snapd _2.50+_).

Parameters can be modified either _statically_, by editing `cmdline` files, or _dynamically_, by  specific system settings (by dynamically we mean that snapd API can be used to set them, but the parameters do survive across reboots). Both of these methods are covered below.

Ubuntu Core boot-time kernel parameters can be viewed from `/proc/cmdline`:

```bash
$ cat /proc/cmdline
snapd_recovery_mode=run console=ttyS0,115200n8 console=tty1 panic=-1
```

In addition to parameters supported by the kernel, there are also *Ubuntu Core-specific* [kernel boot parameters](/reference/kernel-boot-parameters).

## Dynamic kernel parameter modifications

There are two [system options](https://snapcraft.io/docs/system-options) that can be used to add new kernel boot parameters  to a system that has been deployed and is running:

1. [system.kernel.cmdline-append](https://snapcraft.io/docs/system-options#heading--kernel-cmdline-append)
1. [system.kernel.dangerous-cmdline-append](https://snapcraft.io/docs/system-options#heading--kernel-dangerous-cmdline-append)

The first setting will permit **only** boot parameters verified against an _allow list_ in the gadget snap. See [gadget.yaml](https://snapcraft.io/docs/the-gadget-snap#heading--gadget) for further details.

The second option is valid only for dangerous grade [models](https://ubuntu.com/core/docs/reference/assertions/model) and permits any parameter to be added.

System options can be set either through the [snapd API](https://snapcraft.io/docs/snapd-api#heading--snaps-name-conf), or with the `snap set` command:

```bash
snap set system system.kernel.dangerous-cmdline-append="core.bootchart"
```

A reboot is required for the changes to be applied. The system will not restart automatically.

To remove a dynamically set kernel command, use the `snap unset` command:

```bash
snap unset system system.kernel.dangerous-cmdline-append
```

## Static boot option modifications

Static kernel boot-time options are formed from mode arguments set by _snapd_, a static element declared in the bootloader configuration script, and optional extra arguments.

For example, the **run mode** kernel command line is:

```no-highlight
snapd_recovery_mode=run console=ttyS0 console=tty1 panic=-1
```

The **recovery mode** of a system labeled 20210512 would look like this:

```no-highlight
snapd_recovery_mode=recover snapd_recovery_system=20210512 console=ttyS0 console=tty1 panic=-1
```

In the above examples, the mode arguments are `snapd_recovery_mode` and `snapd_recovery_system`. The static command line content for the grub bootloader is `console=ttyS0 console=tty1 panic=-1` which is defined in the snapd source code.

Below we describe how to add additional static parameters (static with the meaning that they cannot be manipulated dynamically from the snapd API).

### Adding static parameters from the gadget

The recommended way to add static parameters is by using the `kernel-cmdline` stanza as described in [gadget.yaml](https://snapcraft.io/docs/the-gadget-snap#heading--gadget). This allows to add new parameters by using the `append` list or removing some of the default Ubuntu Core parameters by putting them in the `remove` list. As already explained, a list of the allowed dynamic parameters can be set from there too.

### Files for modification

The legacy way of customizing statically the kernel command line is by adding one of two possible files to the top level of the filesystem in the [Gadget snap](/reference/gadget-snap-format):

 1. Add a `cmdline.extra` file containing the extra kernel command line arguments, such as  ` custom.option=1`. 

    These arguments are automatically appended to the command line:

    **run mode**:</br>
    `snapd_recovery_mode=run console=ttyS0 console=tty1 panic=-1 custom.option=1`</br>
     **recovery mode** of system `20210512`:</br>
    `snapd_recovery_mode=recover snapd_recovery_system=20210512 console=ttyS0 console=tty1 panic=-1 custom.option=1`

1. Add a `cmdline.full` file containing the full kernel command line to **replace** the built-in static command line entirely.

    For example, if `cmdline.full` file has the following contents:
    ```no-highlight
    # my custom option
    custom.option=1
    # use only ttyS0
    console=ttyS0
    ```
    The kernel command line will contain the following:</br>
    **run mode**:  
    `snapd_recovery_mode=run custom.option=1 console=ttyS0`</br>
    **recovery mode** of system `20210512`:</br>
    `snapd_recovery_mode=recover snapd_recovery_system=20210512 custom.option=1 console=ttyS0`

Both kernel command line extension methods also apply to install mode.

The gadget snap can contain only one of `cmdline.full` or `cmdline.extra`; the presence of both files at the same time is treated as an error.

Extending the kernel command line using drop-in files is also supported on systems using the full disk encryption. See [Full disk encryption](/) for more details.

## Customising the kernel command line

If setting the parameters in `gadget.yaml`, you will just need to edit that file in your sources and build the gadget as usual with `snapcraft`.

If using the legacy files, there are two general approaches to incorporate them into an Ubuntu Core image.

The first requires that the [snapcraft.yaml](https://snapcraft.io/docs/snapcraft-format) is edited to add the kernel command line file to the root of the gadget filesystem, using the [dump plugin](https://snapcraft.io/docs/dump-plugin), for example.

The second is to modify an existing gadget snap directly, and this procedure is outlined below.

```{admonition} Splash screen requirements
:class: tip
Enabling the Ubuntu Core splash screen requires a modified kernel command line. See [Splash screen configuration](/how-to-guides/image-creation/add-a-splash-screen) for details.
```
## Modify an existing gadget snap

When building your own [custom Ubuntu Core image](/how-to-guides/image-creation/add-custom-snaps), the gadget snap that you include can be  modified manually to include the kernel command line file.

To do this, first retrieve the gadget snap you wish to use in the image. The following command, for example, will download the PC gadget snap with a base of [core24](https://snapcraft.io/docs/base-snaps):

```bash
$ snap download pc --channel=24/stable
Fetching snap "pc"
Fetching assertions for "pc"
Install the snap with:
   snap ack pc_178.assert
   snap install pc_178.snap

```

In the above example, the downloaded gadget snap is called `pc_178.snap`, but this will change according to revisions and architectures. You may even source your own gadget snap locally.

All snaps are compressed with the Squashfs filesystem and the gadget snap next needs to be decompressed locally with the _unsquashfs_ command:

```bash
$ unsquashfs pc_178.snap
Parallel unsquashfs: Using 8 processors
16 inodes (41 blocks) to write

[============|] 41/41 100%

created 15 files
created 10 directories
created 0 symlinks
created 0 devices
created 0 fifos
created 0 sockets
```

The above command will create a new directory called `squashfs-root` containing the files and folders of the gadget snap. We can now create the required `cmdline.extra` or `cmdline.full` file ([see above](#heading--cmdline)) containing our kernel command line arguments:

```bash
echo "option1=foo option2=bar" > squashfs-root/cmdline.extra
```

With the _cmdline.extra_ or _cmdline.full_ file created, the gadget snap can be recompressed back into a snap using the `snap pack <squashfs-root>` command:

```bash
snap pack squashfs-root
```

The final step is to build a new Ubuntu Core image with the modified gadget snap. This requires a [model assertion](/reference/assertions/model) with `grade: dangerous` set (as we are using local snaps for the build - this would not be necessary if we have uploaded the gadget to the store) and the `ubuntu-image` command to compile the image. See [Custom images](/how-to-guides/image-creation/add-custom-snaps) for more details.

You can then build the image with the new gadget snap using _ubuntu-image_:

```bash
$ ubuntu-image snap my-model.model --snap pc_24-0.4_amd64.snap
Fetching snapd
Fetching pc-kernel
Fetching core24
Fetching htop
WARNING: "pc" installed from local snaps disconnected from a store cannot be refreshed subsequently!
Copying "pc_24-0.4_amd64.snap" (pc)
```

The resultant image can now be installed on your device and will include your custom kernel command line options.
