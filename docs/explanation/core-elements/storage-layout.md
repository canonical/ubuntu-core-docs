(explanation-core-elements-storage-layout)=
# Storage layout

Storage layouts for Ubuntu Core have been designed to support [recovery modes](/how-to-guides/manage-ubuntu-core/use-a-recovery-mode), and the following partitions are used:

- [ubuntu-seed](#the-ubuntu-seed-partition): configuration for the first-stage/recovery boot loader
- [ubuntu-boot](#the-ubuntu-boot-partition): second-stage/run bootloader and unpacked kernel(s)
- [ubuntu-save](#the-ubuntu-save-partition): cross-installation device identity and selected snap backup data
- [ubuntu-data](#the-ubuntu-data-partition): user and system data and is expanded upon installation

See below for more details on each partition. Additional partitions may be required by the device/board specific bootloader.

On UEFI systems, **ubuntu-seed** is intended to be the EFI System Partition (ESP) with its specific GUID and must be _vfat_ formatted. 

Whether **ubuntu-seed** or **ubuntu-boot** are _vfat_ or _ext4_ formatted depends on the capabilities and requirement of the specific bootloader. Some bootloaders might support _ext4_ but not robustly. With grub on UEFI systems, for example,  **ubuntu-seed** will be vfat-formatted while **ubuntu-boot** can be ext4-formatted.

The definitive layout of the generated image used to install Ubuntu Core, and the resultant storage on the device, is described by the [gadget snap](https://snapcraft.io/docs/gadget-snap) and its associated `gadget.yaml` file.

A device image for both Ubuntu Core 20 and Ubuntu Core 22 devices must only contain _bootloader-specific_ partitions and **ubuntu-seed**,  such that a recovery system in it can be booted into install mode.  Installation will create and size the other missing partitions.

See [How installation works](/explanation/how-installation-works) for more details on how an installation proceeds.
## The ubuntu-seed partition

**role**: system-seed; *read-only*, *ext4* or typically *vfat*

This partition contains the configuration for the first-stage/recovery boot loader and at least one recovery system. This is a set of snaps (base, kernel, gadget and application snaps, see [Snaps in Ubuntu Core](/explanation/core-elements/snaps-in-ubuntu-core) for more details), together with a model assertion and snap assertions that define the device and for which the device can be recovered or reinstalled .

### ubuntu-seed layout

When the image is created, the recovery systems partition is populated with any required bootloader-specific binaries and assets extracted from the gadget. 

In all cases, **ubuntu-seed**  will contain the following directories:

-   One or more `systems/<system-label>` recovery system directories
   
    The `<system-label>` for these directories is usually date-based, e.g. `20201210`, and each fully describes a recovery system, comprising:
    - a model file containing the model assertion for the recovery system
    - an assertions directory that includes all the other assertions needed by the system
    - a kernel image, or other bootloader-specific information to help find the appropriate kernel
    
    The model and all the assertions together determine which snaps and revisions compose the system and they can be used to verify and cross-reference them. 

-   A snaps directory which operates as a pool of snaps shared across all recovery systems. The assertions in a recovery system will define and reference which of these will be used by the system.

For [remodelling](/explanation/remodelling) to function, the seed partition needs to be large enough to hold two recovery systems.

## The ubuntu-boot partition

**role**: system-boot; *read-only*, *ext4* or *vfat*

Contains the second-stage/run bootloader and unpacked kernel(s) only, which are used to boot the system.

## The ubuntu-save partition

**role**: system-save; *writable*, *ext4*

Stores device identity backup data and data to facilitate recovery or re-install.

This partition is mandatory on encrypted systems where it should have a minimum size of approximately 20+MB to handle volume and file system creation (32MB is recommended).

From _snapd 2.57+_, snaps can save small amounts of persistent data to the _ubuntu-save_ partition. This location is accessible from the [SNAP_SAVE_DATA](https://snapcraft.io/docs/environment-variables#heading--snap-save-data) environment variable.

This data might include certificates, data blobs, or configuration files, to help snaps function. This data will survive a [factory reset](/explanation/recovery-modes.md#factory-reset), and consequently, the stored data should be device-oriented and not specific to a particular user of the device.

Device provisioning needs to consider space requirements and snap developers need to understand the consequences of storing persistent data to _ubuntu-save_.

## The ubuntu-data partition

**role**: system-data; *writable*, *ext4*

This partition stores user and system data. This partition is often minimally sized in the image but extended during device initialisation to use all the space available.

