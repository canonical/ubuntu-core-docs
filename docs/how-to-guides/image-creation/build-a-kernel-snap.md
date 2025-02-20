(how-to-guides-image-creation-build-a-kernel-snap)=
# Build a kernel snap

The kernel snap one of the essential snaps that need to be specified in the [model assertion](/reference/assertions/model) when building a [custom image](/how-to-guides/image-creation/add-custom-snaps). The snap can be updated but it cannot be swapped for a different kernel snap.

Canonical publishes several reference kernel snaps, alongside kernel snaps for certified public clouds and general purpose computing images for popular physical devices, such as 64-bit x86, Raspberry Pi and RISC-V.

A custom Linux kernel build allows for device-specific architectures, configuration and modifications, and manually building the kernel snap has the same advantages and requirements. 

Before building a kernel snap, we highly recommend building a working kernel first before migrating this to a kernel snap. The same configuration options and dependencies will be required.

> See [Kernel snaps](https://snapcraft.io/docs/the-kernel-snap) for reference details on what gadget snaps can contain, and see [Types of snap](/explanation/core-elements/snaps-in-ubuntu-core.md#types-of-snap) for details on the other types of snap that make up an Ubuntu Core image. 

## Inside a kernel snap

A kernel snap contain the Linux kernel image and its associated modules, alongside a _RAM disk image_ for system initialisation and optional firmware and device tree files.

Its size and complexity corresponds to the size and complexity of the un-snapped kernel. The `pc-kernel` snap for Linux 6.8.0-40, for example, contains over 1400 directories and 9000 files, with the majority of those files providing firmware and kernel module drivers.

```
├── config-6.8.0-40-generic
├── doc
├── firmware
├── kernel.efi
├── meta
├── modules
├── snap
└── System.map-6.8.0-40-generic
```

The `snap` directory includes the [snapcraft.yaml](https://snapcraft.io/docs/snapcraft-schema) that was used to build the kernel snap.

Canonical’s IoT Devices Field team maintains a [GitHub repository](https://github.com/canonical/iot-field-kernel-snap/tree/main) that includes template files in its main branch, and example kernel implementations for the following architectures in its branches:

* [22-amd64-pc](https://github.com/canonical/iot-field-kernel-snap/tree/22-amd64-pc)
* [24-risc64-nezha](https://github.com/canonical/iot-field-kernel-snap/tree/24-riscv64-nezha)
* [24-riscv64-visionfive2](https://github.com/canonical/iot-field-kernel-snap/tree/24-riscv64-visionfive2)
* [22-orange-pi-5plus](https://github.com/canonical/iot-field-kernel-snap/tree/22-arm64-orange-pi-5plus)

### Template: snapcraft.yaml

The following is an annotated snapcraft.yaml file that can be used as a foundation for your own kernel snap:

[details=snapcraft.yaml]

```
# A template snapcraft.yaml
# For a full specification of the snapcraft.yaml, please see:
# https://snapcraft.io/docs/snapcraft-yaml-reference

# Do not feel obligated to perfectly adhere to this style, but strive to include
# as much metadata as possible.

# The name should be generic -- do not leak secret information!
# A store prefix should be considered as secret information.
# The snaps here which include one will insert it during builds by using a
# secret consumed by the relevant workflow.
name: <platform>-kernel
# The version is largely human readable, but should be meaningful.
# A good place to get the version string from would be the kernel part
adopt-info: kernel
# Kernels should be built based on the release of Ubuntu Core being targetted,
# but do not otherwise require a base as all other snaps do. As such, only a
# build-base is required, and should be something like core18|core20|core22 etc.
build-base: <base>
# The type is one of app|gadget|kernel|snapd, as this is a kernel snap...
type: kernel
# The grade should always be stable unless the kernel is using a devel-grade
# build-base. Options are stable|devel
grade: stable
# The confinement should always be strict. Options are strict|devmode
confinement: strict
# The summary should be short and simple.
summary: An Ubuntu Core kernel for the <platform>
# Always include license information.
# Valid licenses: https://github.com/snapcore/snapd/blob/master/spdx/licenses.go
license: "CC-BY-SA-4.0 AND GPL-2.0 AND ..."
# This repository is upstream for this kernel. Optionally include your contact
# information.
issues: https://github.com/canonical/iot-field-kernel-snap/issues
website: https://github.com/canonical/iot-field-kernel-snap/tree/main
# The description should include boilerplate information and a description of
# any nuances with this kernel's target platform.
description: |
  This snap provides the kernel image, modules, and firmware blobs for running
  <platform>.

  ** Note that the license information of this snap is incomplete **
  Do your due diligence to ensure compliance with the licenses of the contents of this snap.

  The <text files you created> are licensed under CC-BY-SA-4.0

  You can find many licenses for the contents of this snap at the following locations:

  All provided: licenses/

# At a minimum the snap should build natively.
# See: https://snapcraft.io/docs/reference-architectures
# <arch> options are amd64|arm64|armhf|ppc64el|riscv64|s390x
# Note: i386 is legal for base: core{,18} snaps
# Note: riscv64 is legal for base: core{20,22,24,...} snaps
# For snaps with {build-,}base core22 and earlier, use the architectures syntax:
architectures:
  # If only native builds are done, build-for can be omitted
  - build-on:  [<arch>]
    build-for: [<arch>]
# For snaps with {build-,}base core24 and later, use the platforms syntax:
platforms:
  # If <name> is one of amd64|arm64|armhf|ppc64el|riscv64|s390x, build-{on,for} are implicit
  <name>:
    build-on:  [<arch>]
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

# A kernel snap breaks down into four major components:
#   1) The kernel image itself (vmlinuz, bzImage, Image, etc.)
#   2) The kernel modules (*.ko)
#   3) The kernel firmware blobs (provided by linux-firmware)
#   4) the initrd (a CPIO archive)
# The final kernel payload can be booted in a couple different ways, depending
# on the capabilities of the target platform:
#   a) as an EFI binary
#      On sufficiently recent platforms (e.g. x86_64 since 2015), the kernel
#      can be booted as an EFI binary application directly by the motherboard
#      firmware. This capability requires EFISTUB support in the kernel. See the
#      EFISTUB documentation: https://docs.kernel.org/admin-guide/efi-stub.html
#   b) by GRUB or some other bootloader
#      This is the more traditional method for booting kernels, which involves
#      some intermediary binary program like GRUB or u-boot to load the kernel
#      into memory and then execute it.
# On Ubuntu Core, (b) is the expected approach. The bootloader is shipped by
# the gadget and controls the bootflow process of the target hardware, whereas
# option (a) would be more often seen on normal consumer devices rather than the
# IoT edge appliances Ubuntu Core usually targets.

# Once the kernel has done it's initialization steps, it then executes bin/init
# from either the initrd or the root filesystem on disk. Generally speaking,
# an initrd can be forgone if all required kernel modules for booting the
# target platform are builtin to the kernel directly instead of being built
# as separate modules. HOWEVER, In the particular case of Ubuntu Core, the
# initrd provides several key components for bootstrapping an Ubuntu Core
# system. As a result, even if ALL kernel modules are builtin to the kernel
# directly, an initrd will STILL be required.

# Thus, a typical bootflow is:
# bootloader (gadget) -> kernel (kernel snap) -> initrd (kernel snap) -> userspace (base snap)

# Please provide descriptive comments as necessary. Not everything needs to
# be documented or explained, but explaining why things are done can always help
# people who are learning!
parts:
  # The kernel itself can either be repackaged from some upstream or built from
  # source. If Canonical already packages a kernel for the target platform, that
  # kernel debian package can be downloaded and repackaged into a snap. This saves
  # time at the expense of a less "fine-tuned" kernel, but the kernel is
  # guaranteed to have all the required features for Ubuntu Core.
  # See the 22-arm64-odroid-hc4 branch for an example:
  # https://github.com/canonical/iot-field-kernel-snap/blob/22-arm64-odroid-hc4/snap/snapcraft.yaml
  kernel-deb:
    plugin: nil
    # Search packages.ubuntu.com for the kernel debian package for the target
    stage-package: [linux-<target>]
    override-build: |
      craftctl default

      # snapcraft should do the correct thing and fetch all the requirements
      # for the kernel deb, including the modules distributed with that kernel.
      # The version string can be set from the directory name in the modules
      # directory.
      kver="$(basename "${CRAFT_PART_INSTALL}/lib/modules/"*)"

      # Set the version of the snap to match the kernel version.
      craftctl set version="$kver"

      # Create the module information tree.
      depmod -a -b "${CRAFT_PART_INSTALL}" "$kver"

      mv -rf "${CRAFT_PART_INSTALL}/lib/modules"          "${CRAFT_PART_INSTALL}/"
      # ubuntu-core-initramfs, which will package the kernel and initrd into a
      # single binary file, expects a specific kernel image filename
      mv -f  "${CRAFT_PART_INSTALL}/boot/vmlinuz-${kver}" "${CRAFT_PART_INSTALL}/kernel.img-${kver}"

      # Ubuntu Core expects modules/ to be a top-level directory in the snap,
      # but we must also maintain compatibility with things which expect it to
      # be in lib/modules/
      ln -sf ../modules "${CRAFT_PART_INSTALL}/lib/modules"

    # The kernel is going to be repackaged into a UKI which means this part is
    # only responsible for supplying the kernel modules
    # NOTE: the kernel need only be packaged as a UKI if GRUB is the chosen
    # bootloader and no modifications are being made to snapd to modify the
    # GRUB configuration files it uses for booting the system. In the case of
    # u-boot, the gadget's developer is responsible for deciding how the kernel
    # and initrd will be loaded, either as some UKI or FIT image, or as discrete
    # components.
    prime:
      - modules/
      - lib/modules/

  # There are a couple reasons to want to build a kernel from source:
  #   * changing what features are built as modules versus builtin
  #   * patching a kernel to support a new feature
  #   * patching a kernel to support a whole platform
  # an optimal place for fetching the kernel sources is directly from Canonical.
  # This guarantees that the source has all the patches required for running
  # Ubuntu Core. Patches to support the new feature or platform can be applied
  # via an override-pull for this part; see kernel-src-other for an example.
  # Be aware that modifying kernel KCONFIG values can have drastic consequences
  # for the viability of a kernel.
  # See the 22-riscv64-nezha branch for an example:
  # https://github.com/canonical/iot-field-kernel-snap/blob/22-riscv64-nezha/snap/snapcraft.yaml

  # !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  # ! Canonical cannot provide support or offer maintenance for self-built kernels !
  # !  Kernels built from this source should not be used for commercial purposes   !
  # !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  kernel-src-canonical:
    # snapcraft offers a plugin specifically for building Canonical-maintained
    # kernels
    # TODO: the kernel plugin has not been merged yet :)
    # https://github.com/canonical/snapcraft/pull/4302
    plugin: kernel
    source: https://git.launchpad.net/~ubuntu-kernel/ubuntu/+source/linux/+git/<release>
    source-depth: 1
    source-type: git
    # It may be preferable to pin to a specific commit or tag
    source-branch: master
    # There are many options the kernel plugin exposes, mostly to do with KCONFIGs.
    # Generally, the defaults the kernel plugin selects will be fine for most
    # use-cases, as the default configuration is a generic configuration which
    # attempts to target the broadest collection of hardware.
    # For a list of all available otions, see the kernel plugin documentation:
    # TODO: change link to the plugin documentation. For now, the source works.
    # https://github.com/canonical/snapcraft/blob/main/snapcraft/parts/plugins/kernel_plugin.py
    override-build: |
      # Build the kernel. The kernel plugin should do all of the correct things here.
      craftctl default

      # Again, using the directory name in the lib/modules directory captures
      # the kernel version adequately.
      kver="$(basename "${CRAFT_PART_INSTALL}/lib/modules/"*)"
      craftctl set version="$kver"
    prime:
      - modules/
      - lib/modules/

  # It's possible that Canonical does not maintain a kernel which supports the
  # target hardware (this is true of most ARM or RISC-V hardware, for instance).
  # In such a case, the board's upstream kernel should be used (frequently these
  # sources can be found in that manufacturer's BSP), or (if that manufacturer
  # has been dilligent and kind), kernel support may already exist in a more
  # recent version of the upstream kernel avaialble from https://github.com/torvalds/linux.
  # In either case, additional patches will almost certainly be required in
  # order to gain some key functionality Ubuntu Core (and snaps more generally)
  # expect. It may one day be the case that no additional patches are required
  # to support snaps in the upstream kernel, but earlier kernel versions will
  # still require some amount of patching. A sample of a collection of minimum
  # viable patches can be found in the patches/ directory of this branch, though
  # note that those patches may not apply cleanly to any particular version of
  # the kernel source tree. Some extra work may be required to get them to
  # apply.

  # In general, kernel configuration can be quite tricky. It requires intimate
  # knowledge of both the target hardware as well as the desired set of features
  # available at runtime. There are a handful of useful references such as the
  # Gentoo wiki:
  # https://wiki.gentoo.org/wiki/Kernel/Configuration
  # But well-maintained deep-dives do not really exist; an archived copy of a
  # series of dotslashlinux articles can be found here:
  # https://web.archive.org/web/20180226135118/https://www.dotslashlinux.com/

  # See the 22-arm64-orange-pi-5plus branch for an example:
  # https://github.com/canonical/iot-field-kernel-snap/blob/22-arm64-orange-pi-5plus/snap/snapcraft.yaml
  kernel-src-other:
    plugin: nil
    # The source should point to whatever the "official upstream" for the
    # target hardware's kernel is. This could be the board manufacturer's BSP, some
    # enthusiast's fork of the kernel tree, or even Linus himself.
    source: https://github.com/torvalds/linux
    build-packages:
      - bison
      - build-essential
      - flex
      - libelf-dev
      - libssl-dev
      - make
      - on "${CRAFT_ARCH_BUILD_FOR}":
        - gcc
      - on "${CRAFT_ARCH_BUILD_ON}" to "${CRAFT_ARCH_BUILD_FOR}":
        - gcc-"${CRAFT_ARCH_TRIPLET-BUILD_FOR}"
    override-pull: |
      # Apply the necessary patches for building an Ubuntu Core compatible kernel
      # Namely, the apparmor feature is required.
      # The configs patch generates some useful config files in kernel/configs
      # which will help to generate a .config file for the kernel build which
      # enable some mandatory (or just useful) kernel KCONFIG options.
      # This is also a useful time to add other patches to add board support or
      # other features.
      for patch in "${CRAFT_PROJECT_DIR}/patches/"*.patch; do
        patch -p1 < "$patch"
      done
    override-build: |
      # <platform>_defconfig is whatever the recommended defconfig is from the
      # board's manufacturer using their source tree. The additional .config
      # files are configs created by patches/configs.patch which add useful
      # default KCONFIG values.
      make <platform>_defconfig \
           generic.config       \
           containers.config    \
           security.config      \
           snappy.config        \
           systemd.config

      # Be sure to strip the modules of debug symbols to save space!
      make INSTALL_MOD_PATH="${CRAFT_PART_INSTALL}/" \
           INSTALL_MOD_STRIP=1                       \
        modules_install

      # architecture folder names are pretty self-explanatory, and the image
      # file is generally named one of bzImage or Image.
      # Ubuntu Core tradition demands that the kernel image be named kernel.img!
      install -Dm644 "arch/<arch>/boot/<image>" "${CRAFT_PART_INSTALL}/kernel.img"

  # Firmware files are generally binary blobs provided by hardware device
  # manufacturers. If support for that hardware has been added to the mainline
  # kernel, any required firmware blobs can probably be found within the
  # official linux-firmware repository:
  # https://git.kernel.org/pub/scm/linux/kernel/git/firmware/linux-firmware.git
  # If support has not been added to mainline (a good tell is if you have to
  # perform an out-of-tree module build), the firmware can probably be found from
  # the manufacturer (if any is required).
  firmware:
    after: [kernel]
    plugin: dump
    # This repository is maintained by the Canonical kernel team and provides
    # some useful scripts, such as the trim-firmware script which is used to
    # remove any firmware files not required by any of the modules the kernel
    # has been built with.
    source: https://git.launchpad.net/canonical-kernel-snaps
    source-depth: 1
    source-type: git
    # Here the linux-firmware package is used. An alternative would be to fetch
    # the linux-firmware package directly from upstream, available here:
    # https://git.kernel.org/pub/scm/linux/kernel/git/firmware/linux-firmware.git
    stage-packages: [linux-firmware, wireless-regdb]
    organize:
      lib/firmware: firmware/
    override-prime: |
      craftctl default

      "${CRAFT_STAGE}/trim-firmware" "${CRAFT_PRIME}"
    stage:
      - firmware/
      - trim-firmware
    prime:
      - firmware/

  # Sometimes additional firmware files are required for extra hardware to
  # function. Generally, kernel builds don't involve building firmware blobs
  # into kernel images. Instead, the firmware blobs are dynamically loaded on
  # demand from disk. The usual search location for firmware blobs is /lib/
  # firmware, though the device using the firmware might specify a different
  # location. Refer to the firmware's documentation.
  firmware-foo:
    after: [firmware]
    plugin: dump
    source: firmware-foo-source
    # Be sure to also stage any licenses!
    stage:
      # The name of the firmware blob.
      - firmware.bin

  # Sometimes extra modules are required for additional hardware functionality.
  # A common example would be a wireless card. There are a few ways this can be
  # done, but the simplest way is to build an out-of-tree module.
  # The most important thing when doing out-of-tree builds is to ensure that
  # the kernel source the module is built from is the same kernel source as
  # what was used to build the kernel image. When using precompiled kernel
  # debs, the linux-headers packages matching that kernel image release should
  # be sufficient.
  # When building a kernel from source, directing the module's build system
  # to that kernel source tree should likewise suffice. The variable names can
  # vary, but standard practice is to use KDIR, KBASE, or KERNELDIR for the
  # kernel source location, and KVER or KERNELVER for the kernel version.
  # The module's Makefile will disambiguate.
  module-foo:
    after: [kernel]
    plugin: nil
    source: module-foo-source
    build-packages:
      - build-essential
      # The name of the linux-headers debian package, if using kernel debs
      - linux-headers-<platform>:${CRAFT_ARCH_BUILD_FOR}
      - make
      - on "${CRAFT_ARCH_BUILD_FOR}":
        - gcc
      - on "${CRAFT_ARCH_BUILD_ON}" to "${CRAFT_ARCH_BUILD_FOR}":
        - gcc-"${CRAFT_ARCH_TRIPLET-BUILD_FOR}"
    override-build: |
      export kver="$(basename "${CRAFT_STAGE}/modules/"* | cut -f1 -d/)"

      # Kernel directory is with respect to the Makefile's location
      make KVER="${kver}" KBASE="${CRAFT_PART_BUILD}/../../kernel/"

      install -Dm644 "${CRAFT_PART_BUILD}/mod.ko" \
        "${CRAFT_PART_INSTALL}/modules/${kver}/kernel/drivers/further/path/if/needed/mod.ko"

  # It's always important to make sure that the module information is accurate,
  # especially when things like out-of-tree modules have been built. The depmod tool
  # handles this process quite well. A separate part for this is only necessary
  # if out of tree modules have been built; otherwise, running depmod in the
  # kernel part is sufficient.
  depmod:
    after: [module-foo, kernel]
    plugin: nil
    build-packages: [kmod]
    override-prime: |
      kver="$(basename "${CRAFT_STAGE}/modules/"* | cut -f1 -d/)"
      craftctl default

      depmod -b "${CRAFT_PRIME}" "${kver}"

  # The initrd (also called the initial ramdisk) is a stepping stone from the
  # kernel to final userspace. The initrd could be anything from a simple shell
  # script built directly into the kernel to a complex root filesystem complete
  # with its own init.
  # Canonical maintains a tool called ubuntu-core-initramfs which will do the
  # work of generating an Ubuntu Core specific initrd for use in bootstrapping
  # Ubuntu Core devices. It ships several useful services like plymouth for
  # splash screen support, as well as the bootstrapping program snap-bootstrap.
  # ubuntu-core-initramfs allows for building both initrd CPIO archives as well
  # as EFI binaries (UKIs).
  # NOTE: this part is a combo part creating both the initrd as well as the
  # final UKI package. Some platforms may not supporting booting EFI binaries,
  # in which case initrd-build-efi-image should be set to false and a fit-image
  # part used instead. This will most commonly happen on non-x86_64 platforms.
  initrd:
    after: [firmware, kernel]
    # The initrd plugin handles the work of running ubuntu-core-initramfs
    plugin: initrd
    # Set this to true if:
    #  * the gadget bootloader is GRUB
    #  * the gadget bootloader can boot UKIs
    # Set this to false if:
    #  * the gadget bootloader is u-boot, but it is booting a FIT image
    #    This means that the kernel.img, initrd.img, and DTB will be in single FIT blob
    #  * the gadget bootloader is u-boot, but it is booting discrete parts
    #    This means that the kernel.img, initrd.img, and DTB will be separate files
    # The gadget should explain what is required. For example,
    #  * the IoT Field example gadget on the main branch uses a UKI or FIT image, see:
    #    https://github.com/canonical/iot-field-gadget-snap/blob/main/grub/grub.builtin
    #    https://github.com/canonical/iot-field-gadget-snap/blob/main/u-boot/boot.scr.in
    #  * the  IoT Field example gadget on the 22-arm64-odroid-hc4 branch uses separate files:
    #    https://github.com/canonical/iot-field-gadget-snap/blob/22-arm64-odroid-hc4/u-boot/boot.scr
    initrd-build-efi-image: true
    # NOTE: any modules required for booting the target hardware (like those
    # required to mount the root filesystem, such as squashfs or mmc drivers)
    # must be available in the initrd! In such a case, specify that module:
    initrd-configured-modules:
      - bar
      - baz
    # /etc/os-release of the build-base is copied into the initrd
    # If the build-base is not installed in the build environment, then it must
    # be specified. For instance, in a clean LXD container, only snapcraft's
    # base will be installed. That base is not this snap's build-base, which
    # means the build-base snap must be installed explciitly.
    build-snaps: [coreXX/latest/stable]

  # On some platforms like arm64 or riscv64, it may be preferable to use
  # a flattened uImage tree (FIT) image. A FIT image can be built out of a
  # device-tree like file which declares some relevant files as nodes. A FIT
  # image allows combining a kernel image, an initrd, and device trees into a
  # single package to be loaded and booted by u-boot, and provides the useful
  # safety check of a checksum to ensure integrity! A skeleton is included
  # in the fit-image/ directory.
  # See the 22-riscv64-polarfire branch for an example:
  # https://github.com/canonical/iot-field-kernel-snap/blob/22-riscv64-polarfire/fit-image/fitImage-riscv64.its
  fit-image:
    after: [kernel, initrd]
    plugin: nil
    source: fit-image/
    build-packages: [u-boot-tools, device-tree-compiler]
    override-build: |
      mkimage \
        -f ${CRAFT_PART_SRC}/fitImage-${CRAFT_ARCH_BUILD_FOR}.its \
        ${CRAFT_PART_INSTALL}/kernel.img

# One reason for building your own kernel snap is to include out of tree kernel
# modules. This means that knowing how to load those modules (and blacklist
# conflicting ones) is very important. There are several ways to load kernel
# modules on Ubuntu Core systems, but it come down to one of two interfaces:
# kernel-module-load: https://snapcraft.io/docs/kernel-module-load-interface
#   kernel-module-load allows specifying modules by name to either load on-boot
#   or dynamically (via snapctl kmod) with optional arguments, and a list of
#   modules to deny loading.
# kernel-module-control: https://snapcraft.io/docs/kernel-module-control-interface
#   kernel-module-control gives broad sweeping control over any and all kernel
#   modules which can be loaded or unloaded.
# kernel-module-load should always be preferred as it is a more targetted interface.
# In order for this interface to autoconnect, a support ticket must be filed or
# a forum post made.
plugs:
  load-module-foo:
    interface: kernel-module-load
    modules:
    - name: module-foo
      load: on-boot
    - name: conflicting-module
      load: denied
```
[/details]

## Build the snap

The build system must support [snap](https://snapcraft.io/docs/installing-snapd), and have both the [Snapcraft](https://snapcraft.io/docs/snapcraft-overview) build tool and the [LXD](https://canonical.com/lxd) virtualisation platform installed, all of which are provided by any Ubuntu release.

Unlike broader snap packages, kernel snaps are typically built within the host environment using [snapcraft --destructive-mode](https://snapcraft.io/docs/build-options). This step can still be isolated from the host system by building the kernel with [LXD](https://linuxcontainers.org/lxd/introduction/). To do this, install LXD (if it's not already installed), instantiate an Ubuntu image (Ubuntu 20.04.4 LTS Focal Fossa), and create the kernel build there:

```bash
sudo snap install lxd
sudo lxd init --auto
sudo lxc launch ubuntu:22.04 focal
sudo lxc shell focal
snap install snapcraft --classic
```

With _snapcraft.yaml_ complete, and the kernel source either cloned locally or linked to from the snapcraft.yaml, the `snapcraft` command will build the kernel. As mentioned earlier, it's often more convenient to build the kernel within the host environment, using `--destructive-mode`:

```bash
# snapcraft --destructive-mode --target-arch=arm64
[...]
Snapped kernal-snap-name_arm64.snap
```

If the above command was executed within an LXD environment, the resultant kernel snap can be extracted with the following commands:

```bash
# exit
$ lxc file pull path/to/kernal-snap-name_arm64.snap .
```

The kernel snap has now been built and is ready to be integrated into an Ubuntu Core image. See [Custom images](/how-to-guides/image-creation/add-custom-snaps) for further details.

