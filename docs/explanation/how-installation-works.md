(explanation-how-installation-works)=
# How installation works

The Ubuntu Core install image is composed from the kernel, gadget, base, snapd and app snaps (see [Snaps in Ubuntu Core](/explanation/core-elements/snaps-in-ubuntu-core) for further details). The resultant image typically contains the following:

![Core install image partition](https://assets.ubuntu.com/v1/108d3dba-core-install-image-partition.png) 

Any device booting an Ubuntu Core installation image will create or use the partitions defined by its [Storage layout](/explanation/core-elements/storage-layout) and proceed through the following installation steps. 

The first three (1-3) are also described in the [recovery mode](/explanation/recovery-modes) boot process:

1. Boot through the bootloader, its assets, and boot configuration in `ubuntu-seed`.
1. Bootloader loads the kernel from a designated [recovery system](/explanation/recovery-modes).
1. Kernel initialises the system and runs the snaps from that system in **install mode**. At this point, the system is running from tmpfs in an ephemeral state with all snaps from the recovery system model marked for use in install mode (as indicated by the modes field values), including the _snapd_ snap, the gadget snap, the kernel snap and the base snap (usually the _core20_ snap).
1. The snapd snap proceeds to install the actual run mode system by:
   - creating all missing partitions.
   - (*optionally*) encrypting `ubuntu-data` and `ubuntu-save` if supported and not disabled.
   - sealing the disk keys through hardware support.
   - setting up the run system in `ubuntu-data`.
   - setting boot configuration and the run mode kernel in `ubuntu-boot` for run mode.
1.  snapd proceeds to reboot into **run mode**.
1.  From run mode, snapd  bootstraps itself and proceeds to _seeding_, installing and activating all the snaps marked for **run mode** use in the recovery system.

## The install-device hook

A [gadget](/reference/gadget-snap-format) can optionally define an _install-device hook_ . This is invoked from **install mode** before rebooting into **run mode**, between steps 4 and 5 above, and also after a [factory reset](/explanation/recovery-modes.md#factory-reset), to perform early hardware and firmware configuration.

The [snapctl system-mode](https://snapcraft.io/docs/using-snapctl#heading--system-mode) command can be run during execution of the hook to detect which mode the install-device hook has been executed under.

All partitions are created and mounted when the install-device hook runs.

If applicable, precautions should be taken to ensure that any sensitive configuration is idempotent and/or only done once for the lifetime of the device.

The install-device hook can also stop the subsequent reboot from booting into *run mode* (step 5, above) with the _[snapctl](https://snapcraft.io/docs/using-snapctl) reboot_ command and either `--halt` or `--poweroff` arguments:

```
snapctl reboot --halt|--poweroff
```
Either reboot command will only take effect after the hook has finished.

## Factory image hint

A Ubuntu Core image can be built to include a _hint_ that an image is intended to be used, or first booted, in the device factory. This hint can then be used to govern whether factory-only resources are accessible, for instance, but no security-related decisions should be made based solely on its inclusion as it could be possible for the hint to be set again in the field.

The factory image hint is set by adding `--factory-image` to the _ubuntu-image_ command when building the image:

```
ubuntu-image snap my-model.model --factory-image
```

See [Building the image](/tutorials/build-your-first-image/index) for details on how images are built.

The factory image hint is cleared directly before rebooting into **run mode**. 

For the current boot, the state of the factory image hint can be viewed by invoking `snapctl system-mode` and checking whether `factory: true` is included in its YAML output. See [The snapctl tool](https://snapcraft.io/docs/using-snapctl) for more information.

