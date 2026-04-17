(how-to-guides-image-creation-build-a-kernel-snap)=
# Build a kernel snap

The [kernel snap](https://snapcraft.io/docs/reference/development/yaml-schemas/the-kernel-snap/)
is one of the essential snaps that need to be specified in the {ref}`model assertion <reference-assertions-model>`
when building a {ref}`custom image <how-to-guides-image-creation-add-custom-snaps>`.
The snap can be updated but it cannot be swapped for a different kernel snap.

Canonical publishes several kernel snaps, including ones for certified public
clouds, realtime, and general purpose devices such as x86_64 machines and the
Raspberry Pi.

A custom Linux kernel build allows for device-specific configuration and
modifications, and building the kernel snap has the same advantages and
similar requirements.

Before building a kernel snap, we highly recommend building a working kernel
first before migrating to a kernel snap. The same configuration options and
dependencies will be required.

See [Kernel snaps](https://snapcraft.io/docs/the-kernel-snap) for reference
details on the composition of a kernel snap, and see {ref}`Types of snap <ref-snaps-in-ubuntu-core_types-of-snap>`
for details on the other types of snap that make up an Ubuntu Core image.

```{important}
Building a kernel snap is useful for prototyping but its maintenance and support becomes your responsibility.
```

## Inside a kernel snap

A kernel snap contain the Linux kernel image and its associated modules,
alongside a _RAM disk image_ as well as firmware and, on non-x86_64 platforms,
device tree files.

Its size and complexity corresponds to the size and complexity of the un-snapped
kernel. The `pc-kernel` snap for Linux 6.8.0-40, for example, contains over 1400
directories and 9000 files, with the majority of those files being firmware and
kernel modules.

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

When a system is using the GRUB bootloader, the kernel and initrd must be
bundled as a UKI and named `kernel.efi`.

The `snap` directory includes the [snapcraft.yaml](https://snapcraft.io/docs/snapcraft-schema)
that was used to build the kernel snap.

Canonical’s IoT Devices Field team maintains a [GitHub repository](https://github.com/canonical/iot-field-kernel-snap/tree/main)
that includes template files in its main branch, and example kernel
implementations for specific core releases as branches.

### Crafting the snap

Snapcraft provides [kernel]() and [initrd]() plugins for creating kernel snaps.
Refer to their documentation to understand the available options and features.

#### The minimal case

The most basic kernel snap would be repackaging an available debian package
from the archive into a snap. This allows you to control the flavour (generic,
lowlatency, etc.) as well as the overall size of the snap by filtering out
unecessary kernel modules.

A minimal `snapcraft.yaml` that accomplishes this may look like:

```yaml
name: pc-lowlatency-kernel
adopt-info: kernel
build-base: core24
type: kernel
grade: stable
confinement: strict
summary: An Ubuntu Core lowlatency kernel for x86_64
description: An Ubuntu Core lowlatency kernel for x86_64

parts:
  kernel:
    plugin: kernel
    kernel-ubuntu-binary-package: true
    kernel-ubuntu-abinumber: 6.8.0-106
    kernel-ubuntu-kconfigflavour: lowlatency
    stage-packages:
      - linux-firmware:${CRAFT_ARCH_BUILD_FOR}
      - wireless-regdb
    override-build: |
      craftctl default

      kver="$(basename "${CRAFT_PART_INSTALL}/lib/modules/"*)"
      craftctl set version="$kver"

    override-prime: |
      craftctl default

      "${CRAFT_STAGE}/trim-firmware" "${CRAFT_PRIME}"
    prime:
      - -lib/modules/*/kernel/fs/9p/
      - -kernel.img*

  firmware:
    after: [kernel]
    plugin: dump
    source: https://git.launchpad.net/canonical-kernel-snaps
    source-depth: 1
    source-type: git
    source-branch: main
    prime:
      - -*

  initrd:
    after: [firmware, kernel]
    plugin: initrd
    initrd-build-efi-image: true
    initrd-modules: [nls_iso8859-1.ko]
```

Take special note of the `prime:` key for the `kernel` part: the 9p filesystem
kernel modules are filtered out of the final snap. the `firmware` part provides
a script which will trim the firmware files which aren't required by any
available kernel modules. Also notably, the `nls_iso8859-1.ko` kernel module is
builtin to the initrd via the `initrd-modules` initrd plugin option.

#### Increasing complexity

Of course, the primary motivation for building your own kernel snap would be to
perform more complex tasks such as modifying options the kernel itself is built
with or patching the code to add new features or test fixes.

Additionally, building your own initrd as part of this process
enables you to introduce even more complex feature support, such
as leveraging [OP-TEE for Full Disk Encryption on non-x86_64 platforms](https://documentation.ubuntu.com/core/explanation/full-disk-encryption-op-tee/).

For instance the below two parts within a kernel snap's `snapcraft.yaml` will
build an entirely different kernel from the standard Canonical ones, trimming
extra kernel modules along the way. It also embeds some key binaries and
libraries within the initrd which are critical for OP-TEE to function properly.

```yaml
parts:
  kernel:
    plugin: kernel
    source: https://git.launchpad.net/~ondrak/ondras-snaps/+git/linux-kernel
    source-depth: 1
    source-type: git
    source-branch: Ubuntu-imx-6.18.0-1006.6
    kernel-ubuntu-kconfigflavour: imx
    override-build: |
      craftctl default

      craftctl set version=$(git describe --tags |\
                             cut -c 12-42        |\
                             sed 's/-snap$//')

      cp -f "${CRAFT_PART_SRC}/imx-keep.modules"        \
            "${CRAFT_PART_SRC}/prune-kernel-modules.sh" \
            "${CRAFT_PART_INSTALL}/"
    override-stage: |
      craftctl default

      # keep only listed modules
      "${CRAFT_STAGE}/prune-kernel-modules.sh" \
        "${CRAFT_STAGE}" \
        "${CRAFT_STAGE}/imx-keep.modules"
    prime:
      - lib/
      - modules/

  initrd:
    after: [firmware, kernel, imx-firmware, optee-uc-fde-client]
    plugin: initrd
    initrd-addons:
      - usr/bin/fde-reveal-key
      - usr/bin/fde-setup
      - usr/lib/${CRAFT_ARCH_TRIPLET_BUILD_FOR}/libteec.so*
    initrd-firmware:
      - firmware/imx/sdma/sdma-imx7d.bin
      - firmware/regulatory.db
      - firmware/regulatory.db.p7s
    prime:
      - -initrd.img*
```

If you already have a known-working kernel, you may well be just a short bit of
repackaging to end up with a kernel snap for your hardware platform!

You can find more examples of kernel snaps maintained
by the Devices Field Engineering team at their [GitHub repository](https://github.com/canonical/iot-field-kernel-snap/tree/main/snap).
The `main` branch provides several `snapcraft.yaml` snippets which explain
several different kinds of ways kernel snaps can be constructed.

## Build the snap

The build system must support [snap](https://snapcraft.io/docs/installing-snapd),
and have both the [Snapcraft](https://documentation.ubuntu.com/snapcraft/stable/how-to/setup/set-up-snapcraft/)
build tool and the [LXD](https://canonical.com/lxd) virtualisation platform
installed, all of which are provided by any Ubuntu release.

### Important considerations

Depending on the build host, some additional steps may be required for
cross-building a kernel snap build to succeed.

The build host must be properly configured to support installing packages and
executing binaries for a non-native architecture.

#### Package support

These steps may only be required when building core22 and earlier kernel snaps.

In the case of supporting installing packages for a different architecture the
following steps may suffice:

1. adding the relevant Ubuntu archive for the target architecture,
2. specifying that the original archive is for the host architecture,
3. informing dpkg that a foreign architecture is allowed, and
4. installing the correct libc interpreter

For instance, the below will add support for cross-building arm64 kernel snaps
on an amd64 host:

```bash
{ echo 'Types: deb'; \
  echo 'URIs: http://ports.ubuntu.com/ubuntu-ports'; \
  echo 'Suites: jammy jammy-updates jammy-backports'; \
  echo 'Components: main universe restricted multiverse'; \
  echo 'Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg'; \
  echo 'Architectures: arm64'; } >> /etc/apt/sources.list.d/cross.sources

 sed -i 's/deb h/deb [arch=amd64] h/' /etc/apt/sources.list

 dpkg --add-architecture arm64

 apt update
 apt install libc6-arm64-cross

 ln -sf /usr/aarch64-linux-gnu/ld-linux-aarch64.so.1 /lib
```

It's important that these changes be made within the *build environment*;
Snapcraft's default behavior is to build within a managed LXD container,
so you may want to build either within some persistent LXD container
with `--destructive-mode` *or* use the `--debug` flag to enter the
Snapcraft-managed container to make these changes.

#### Execution support

The initrd plugin constructs a minimal chroot to emulate the target
architecture's root filesystem. This means that the host machine must
support executing binaries built for different architectures. Most
modern machines should be capable of this, and the support is enabled by [binfmt_misc](https://www.kernel.org/doc/html/latest/admin-guide/binfmt-misc.html).

When building in a LXD container, LXD should handle binfmt_misc [itself](https://documentation.ubuntu.com/lxd/default/container-environment/#binfmt-misc).
However, the host machine *must* install the relevant QEMU packages:

`````{tab-set}
````{tab-item} Plucky and earlier
:sync: key1

```bash
sudo apt install qemu-user-static
```

````
````{tab-item} Questing and later

```bash
sudo apt install binfmt-support qemu-user-binfmt qemu-user
```

````
`````

Finally, restart LXD:

```bash
snap restart lxd
```

### Building

Once the prerequisites have been handled, one can finally build the snap!

```bash
# snapcraft --build-for=arm64
[...]
Snapped kernal-snap-name_kernel-snap-version_arm64.snap
```

The kernel snap has now been built and is ready to be used in an Ubuntu Core
image. See {ref}`Custom images <how-to-guides-image-creation-add-custom-snaps>`
for further details.

