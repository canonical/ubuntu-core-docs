(how-to-guides-image-creation-build-a-gadget-snap)=
# Build a gadget snap

Gadget snaps define and manipulate device-specific configuration and system properties, such as partition layouts and default configuration options. Building a gadget snap enables these device-specific options to be set and integrated within an Ubuntu Core image.

This page includes an overview of what a gadget snap includes, plus templates for building the gadget and the snap.

- [Inside a gadget snap](#heading--inside)
	- [Template: gadget.yaml](#heading--template-gadget), used to build the gadget
	- [Template: snapcraft.yaml](#heading--template-snapcraft), used to build the snap
- [Build the snap](#heading--building)
	- [Cross-building](#heading--building-crossbuilding)
	- [Native building](#heading--building-native)
	    

See [Gadget snaps](/reference/gadget-snap-format) for reference details on what gadget snaps can contain, and see [Types of snap](/explanation/core-elements/snaps-in-ubuntu-core.md#types-of-snap) for details on the other types of snap that make up an Ubuntu Core image. 

## Inside a gadget snap

A gadget snap is built the same way other snaps are built, using [snapcraft](https://snapcraft.io/docs/snapcraft-overview) with a corresponding [snapcraft.yaml](https://snapcraft.io/docs/snapcraft-schema).

> For a general guide on building snaps, see [Create a new snap](https://snapcraft.io/docs/create-a-new-snap).

A gadget snap's _snapcraft.yaml_ links to both the [gadget.yaml](https://snapcraft.io/docs/the-gadget-snap), which is used describe the device, and the support, boot and configuration files that are necessary to initialise a device.

- **snapcraft.yaml** defines the gadget snap metadata alongside build and boot parameters
- **gadget.yaml** defines the system properties specific to one or more devices
- **grub/u-boot directories** provide the device boot environment

The filesystem for a typical gadget snap looks like the following:

```
├── gadget.yaml
├── grub
│   ├── grub.builtin
│   └── uEnv.txt
├── snap
│   ├── hooks
│   │   ├── configure
│   │   ├── default-configure
│   │   └── prepare-device
│   └── snapcraft.yaml
└── u-boot
    └── boot.scr.in
```

Canonical's IoT Devices Field team maintains a [GitHub repository](https://github.com/canonical/iot-field-gadget-snap/tree/main) that includes template files in its main branch, and example gadget implementations for the following architectures in its branches:

- [arm64-odroid-hc4](https://github.com/canonical/iot-field-gadget-snap/tree/22-arm64-odroid-hc4)
- [arm64-orange-pi-5plus](https://github.com/canonical/iot-field-gadget-snap/tree/22-arm64-orange-pi-5plus)
- [amd64-pc](https://github.com/canonical/iot-field-gadget-snap/tree/22-amd64-pc)
- [amd64-pc-classic](https://github.com/canonical/iot-field-gadget-snap/tree/22-amd64-pc-classic)
- [risc64-icicle](https://github.com/canonical/iot-field-gadget-snap/tree/22-riscv64-icicle)
- [risc64-nezha](https://github.com/canonical/iot-field-gadget-snap/tree/24-riscv64-nezha)

The following gadget repositories contain the reference gadget snap definitions for _amd64_ (64 bit PC Gadget Snap) and the Raspberry Pi family of devices supported by Ubuntu Core:

- [ 64-bit PC Gadget Snap](https://github.com/snapcore/pc-amd64-gadget)
- [ Raspberry Pi "Universal" Gadget Snap](https://github.com/snapcore/pi-gadget)

### Template: gadget.yaml

The following is an annotated gadget.yaml file that can be used as the basis for your own gadget snap:

```yaml
# A template gadget.yaml
# For a full specification of the gadget.yaml, please see:
# https://snapcraft.io/docs/the-gadget-snap
volumes:
  <volume name>:
    schema: <mbr|gpt>
    bootloader: <u-boot|grub>
    structure:
      # Example of a bare structural item
      # Named 'BIOS boot' if using MBR
      - name: <descriptive name>
        type: bare
        offset: <if needed>
        size: <a multiple of 512>
        # Include an 'update' stanza, start at 1
        update:
          edition: 1
        content:
          - image: <file name to write to bare sectors>
      # Example of a system-seed partition
      - name: ubuntu-seed
        role: system-seed
        filesystem: vfat
        type: C12A7328-F81F-11D2-BA4B-00A0C93EC93B
        size: <twice the required size>
        offset: <if needed>
        # Include an 'update' stanza, start at 1
        update:
          edition: 1
        content:
          # GRUB vs u-boot
          - source: <grub<arch>.efi|boot.scr>
            target: <EFI/boot/grub<arch>.efi|/>
          # If using u-boot, you might include
          - source: uEnv.txt
            target: EFI/boot/uEnv.txt
      # Example of a system-boot partition
      - name: ubuntu-boot
        role: system-boot
        # Note that this partition cannot be vfat as a symlink to the kernel
        # file is created, and symlinks are verboten on vfat.
        filesystem: ext4
        type: 0FC63DAF-8483-4772-8E79-3D69D8477DE4
        size: <four times the kernel.{efi,img} size>
        # Include an 'update' stanza, start at 1
        update:
          edition: 1
        content:
          # GRUB vs u-boot - should match at least system-seed
          - source: <grub<arch>.efi|boot.scr>
            target: <EFI/boot/grub<arch>.efi|/>
          - source: uEnv.txt
            target: EFI/boot/uEnv.txt
          # If using u-boot, provide this file
          - source: boot.sel
            target: uboot/ubuntu/boot.sel
      # Example system-save partition
      - name: ubuntu-save
        role: system-save
        filesystem: ext4
        type: 0FC63DAF-8483-4772-8E79-3D69D8477DE4
        size: 32M
      # Example system-data partition
      - name: ubuntu-data
        role: system-data
        filesystem: ext4
        type: 0FC63DAF-8483-4772-8E79-3D69D8477DE4
        size: 1M

# Default configuration settings should go here

# Default connection settings should go here
```

### Template: snapcraft.yaml

The following is an annotated snapcraft.yaml file that can be used as the basis for your own gadget's snapcraft.yaml:

```yaml
# A template snapcraft.yaml
# For a full specification of the snapcraft.yaml, please see:
# https://snapcraft.io/docs/snapcraft-yaml-reference

# Do not feel obligated to perfectly adhere to this style, but strive to include
# as much metadata as possible.

# The name should be generic -- do not leak secret information!
# A store prefix should be considered as secret information.
# The snaps here which include one will insert it during builds by using a
# secret consumed by the relevant workflow.
name: <platform>
# The version is largely human readable, but should be meaningful.
# For instance, if the device boots with GRUB, have the version match the GRUB
# release used.
adopt-info|version: <grub|u-boot|some useful string>
# The base of the snap should match the base of the Ubuntu Core system.
base: <base>
# build-base should only be used if creating a gadget for a devel release of Ubuntu Core.
type: gadget
# The grade should always be stable unless the gadget is using a devel-grade build-base.
grade: stable
# The confinement should always be strict.
confinement: strict
# The summary should be short and simple.
summary: An Ubuntu Core gadget for the <platform>
# Always include license information.
# Valid licenses: https://github.com/snapcore/snapd/blob/master/spdx/licenses.go
license: "CC-BY-SA-4.0 AND ..."
# This repository is upstream for this gadget. Optionally include your contact
# information.
issues: https://github.com/canonical/iot-field-gadget-snap/issues
website: https://github.com/canonical/iot-field-gadget-snap/tree/main
# The description should include boilerplate information and a description of
# any nuances with this gadget target platform.
description: |
  This snap provides the <bootloader> binaries for booting <platform>.

  Additionally it includes the gadget.yaml which defines the partition layout
  and any default configuration options for the Ubuntu Core device.

  ** Note that the license information of this snap is incomplete **
  Do your due diligence to ensure compliance with the licenses of the contents of this snap.

  The <text files you created> are licensed under CC-BY-SA-4.0

  You can find many licenses for the contents of this snap at the following locations:

  All provided: licenses/

# If you want the gadget.yaml to refer to assets provided by the kernel
# instead of this snap, use this key. See:
# https://snapcraft.io/docs/snapcraft-top-level-metadata
assumes: [kernel-assets]

# At a minimum the snap should build natively.
architectures:
  - build-on:  [<arch>]
    build-for: [<arch>]

# Any additional repositories required.
# For instance, if you are building on AMD64 for ARM64,
package-repositories:
  - type: apt
    components: [main]
    architectures: [<arch>]
    suites: [<release>, <release>-security, <release>-updates]
    key-id: F6ECB3762474EDA9D21B7022871920D1991BC93C
    url: http://ports.ubuntu.com/ubuntu-ports

# Please provide descriptive comments as necessary. Not everything needs to
# be documented or explained, but explaining why things are done can always help
# people who are learning!
parts:
  # If GRUB is specified as the bootloader in the gadget.yaml, then this
  # grub part is what should be used. The grub part is used to fetch a GRUB
  # binary from the Ubuntu archive. This package should provide us everything
  # needed for a gadget which specifies GRUB as a bootloader. Additionally, the
  # snap version information can be set from the GRUB package used.
  # When the gadget uses GRUB, a file named grubenv will be created by snapd
  # during image build time in EFI/ubuntu and snapd will manage that file during
  # the lifetime of the device. This file is populated by snapd with important
  # system information, like the name of the seed system and the recovery mode
  # being booted with which tells snapd whether to install, run, or recover
  # Ubuntu Core.
  grub:
    plugin: dump
    # Examples of files required to use GRUB as the bootloader can be found in
    # the top-level grub directory
    source: grub/
    stage-packages:
      - grub-efi-<arch>:${CRAFT_ARCH_BUILD_FOR}
    override-build: |
      craftctl default
      
      # Set the version of the snap from the GRUB package
      craftctl set version=$(find "${CRAFT_PART_BUILD}/../stage_packages/" \
                              -name grub-efi-${CRAFT_ARCH_BUILD_FOR}_*.deb \
                              -exec dpkg-deb -f {} Version \;)

      # grub.conf is required when bootloader is set to GRUB in the gadget.yaml
      # so that snapd knows how to prepare the boot environment during image
      # build and during general run mode. The file should be empty.
      touch "${CRAFT_PART_INSTALL}/grub.conf"

      # uEnv.txt is a file that the u-boot binary will search for and source on
      # boot. This file should launch our grub<arch>.efi binary and result in
      # a fully automated boot process. No modifications are made to this file,
      # but it is provided by this project in the grub/ directory.
      # Note that the exact name and location of this file depends on the u-boot
      # being used by the target hardware.

    # Ship license information
    organize:
      usr/share/doc/grub-efi-<arch>/:     licenses/grub-efi-<arch>/
      usr/share/doc/grub-efi-<arch>-bin/: licenses/grub-efi-<arch>-bin/
    stage:
      - grub.conf
      - grub<arch>.efi
      - licenses/
      - uEnv.txt

  # u-boot provides the bootloader binary for the target hardware. This binary
  # is of paramount importance when u-boot is declared as the bootloader in the
  # gadget.yaml, but may also need to exist for other systems even when GRUB
  # is used as the bootloader. This is the binary the bootrom of the target
  # hardware should search for and execute after it performs its low-level
  # device initialization. With some platforms, a u-boot binary is provided from
  # the Ubuntu archives (the RISC-V platforms supported on Ubuntu Classic are
  # such an example). In other cases (as with many ARM64 platforms), u-boot must
  # be built from source. The character of this part will change dramatically
  # based on this fact.

  # u-boot-deb is the case where u-boot is provided by a package in the archive.
  u-boot-deb:
    plugin: nil
    stage-packages: [<package name>]
    override-build: |
      # Because only the u-boot binary is needed, simply copy it to the
      # top-level to reduce the path length for the binary in the gadget.yaml
      install -Dm644 "${CRAFT_PART_INSTALL}/<path to u-boot binary>" \
        "${CRAFT_PART_INSTALL}/<binary name>"

    # Ship license information
    organize:
      usr/share/doc/<package name>/: licenses/<package name>/
    stage:
      - <binary name>
      - licenses/

  # u-boot-src is the case where u-boot must be built from source.
  # Note that this may oftentimes mean that other parts need to be added to
  # build things the u-boot binary requires. For instance, a RISC-V board may
  # require also building an SPL and SBI binary which are then built into the
  # final u-boot binary. There could also be device trees which are encoded
  # in the binary, or some other bespoke file used by u-boot to determine
  # which files to load at run-time. This information should be covered in the
  # documentation for the target hardware or the u-boot source.
  # Examples of how to handle this can be found in other branches of this
  # repository. Specifically, branches for ARM64 devices will usually do this.
  u-boot-src:
    # A plugin could be utilized here; for instance, the make plugin may
    # be the correct choice. Because this selection may require some manual
    # intervention in the build process anyways, it may be preferable to simply
    # handle building and installing the part manually.
    plugin: nil
    source: <u-boot source tree>
    # The packages required to build u-boot may be variable; the documentation
    # for the u-boot source selected should include a list of dependencies.
    build-packages: [bc, make]
    override-build: |
      make <board>_defconfig
      make -j${CRAFT_PARALLEL_BUILD_COUNT}
      install -Dm755 "${CRAFT_PART_BUILD}/<path to u-boot.bin>" \
        "${CRAFT_PART_INSTALL}/u-boot.bin"

  # boot-sel provides a file snapd will look for just in case u-boot is chosen
  # as the bootloader in the gadget.yaml. This file is populated by snapd with
  # important system information, like the name of the seed system and the
  # recovery mode being booted with which tells snapd whether to install, run,
  # or recover Ubuntu Core.
  boot-sel:
    after: [u-boot]
    plugin: nil
    build-packages: [u-boot-tools]
    override-build: |
      # It is sufficient to create an empty file; the contents are owned by snapd.
      mkenvimage -r -s 4096 \
        -o "${CRAFT_PART_INSTALL}/boot.sel" - < /dev/null

      # uboot.conf is required when bootloader is set to u-boot in the
      # gadget.yaml so that snapd knows how to prepare the boot environment
      # during image build and during general run mode. The file should be
      # empty.
      touch "${CRAFT_PART_INSTALL}/uboot.conf"

  # boot-scr compiles the boot.scr.in file into an executable which u-boot can
  # execute at run-time. This script performs the necessary actions to boot an
  # Ubuntu Core system which declares u-boot as its bootloader.
  # A viable example of such a file can be found in the u-boot directory.
  boot-scr:
    after: [u-boot]
    plugin: nil
    source: u-boot/
    build-packages: [u-boot-tools]
    override-build: |
      mkimage -d boot.scr.in \
        "${CRAFT_PART_INSTALL}/boot.scr"

# Any necessary hooks. For instance, specify the API key here to be used
# by the prepare-device hook at runtime.
# If you don't know what an API key is, feel free to remove this.
# PLEASE do not check your API key into VCS :)
# The snaps here which include one will insert it during builds by using a
# secret consumed by the relevant workflow.
hooks:
  prepare-device:
    environment:
      MODEL_APIKEY: ""
```

## Build the snap

There are typically two methods for building a gadget snap, _native building_ and _cross building_. Cross building is likely the most convenient and performant as the gadget is built within a container on the host machine.

### Requirements

The build system must support [snap](https://snapcraft.io/docs/installing-snapd), and have both the [Snapcraft](https://snapcraft.io/docs/snapcraft-overview) build tool and the [LXD](https://canonical.com/lxd) virtualisation platform installed, all of which are provided by any Ubuntu release.

### Native building

This method builds a gadget snap on the same hardware that the gadget is intended for. The following example will build the [22-amd64-pc](https://github.com/canonical/iot-field-gadget-snap/tree/22-amd64-pc) gadget snap on an x86 generic PC.

#### Checkout the branch

With the requirements met, open a terminal and clone the repository:

```
git clone https://github.com/canonical/iot-field-gadget-snap.git
```

Next,`cd` into the directory and _checkout_ the `22-amd-pc` branch:

```
cd iot-field-gadget-snap
git checkout 22-amd64-pc
```

#### Build with Snapcraft

With the correct git branch selected, `snap/snapcraft.yaml` now contains everything required to build the PC gadget snap.

This example embeds the pre-built [Canonical reference PC gadget](https://github.com/snapcore/pc-gadget) as a base from the *snapcraft.yaml*. To build the gadget, run the the _snapcraft_ command:

```bash
$ snapcraft
Generated snap metadata
Created snap package amd64-gadget_0.1_amd64.snap
```

See [Image building](https://ubuntu.com/core/docs/board-enablement#heading--image-building) for instructions on how to build a bootable image that includes the gadget snap.

### Cross-building

Cross-building allows a gadget snap to be built on an architecture different from the target.

Snapcraft uses LXD, or [optionally Multipass](https://snapcraft.io/docs/build-options), to isolate the host system from the build system. Crucially, both LXD and Multipass also allow for the _build_ architecture to differ from the _host_ architecture. This is handled by the `architecture` stanza in the `snapcraft.yaml` file for the gadget snap.

The following example will build the [22-riscv-pc](https://github.com/canonical/iot-field-gadget-snap/tree/22-amd64-pc) gadget snap on an x86 PC.

#### Checkout the branch

Open a terminal and clone the repository:

```
git clone https://github.com/canonical/iot-field-gadget-snap.git
```

Next,`cd` into the directory and _checkout_ the `22-riscv64-virt` branch:

```bash
cd iot-field-gadget-snap
git checkout 22-riscv64-virt
```

#### Build with Snapcraft

With the correct git branch selected, `snap/snapcraft.yaml` now contains everything required to build the gadget snap. Its `architecture` stanza, for example, allows the gadget snap to be built on either _amd64_ and _riscv64_ architectures while only running run on _riscv64_:


```yaml
architectures:
   - build-on:  [amd64, riscv64]
     build-for: [riscv64]
```

The gadget snap can now be built by running the _snapcraft_ command:


```bash
$ snapcraft
Generated snap metadata
Created snap package virt_22-1_riscv64.snap
```

See [Architectures](https://snapcraft.io/docs/architectures) for more details on defining architectures and [Image building](https://ubuntu.com/core/docs/board-enablement#heading--image-building) for instructions on how to build a bootable image that includes the gadget snap.

