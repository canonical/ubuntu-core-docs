---
title: Gadget snap reference and syntax
---
# Gadget snap reference and syntax

## Setup files

In additional to traditional snap metadata, the gadget snap also holds some setup files fundamental to the initialization and lifecycle of the device:

- `meta/snap.yaml` - Traditional snap format, with `type: gadget` explicitly defined.
- `meta/gadget.yaml` - Gadget-specific information. See below.
- `grub.conf` - Required grub configuration when using this bootloader.
- `u-boot.conf` - Required u-boot configuration when using this bootloader.
- `cloud.conf` - Optional [cloud-init](https://cloudinit.readthedocs.io/en/latest/) configuration; cloud-init is disabled if missing.

## The gadget.yaml file

Four YAML keys are used to describe your target device:

* `defaults`: (YAML sub-section, optional): default configuration options for the defined snaps, applied on installation (optional).
```
defaults:
    <snap id>:
        <key>: <value>
```
* `device-tree` (filename, optional): the Device Tree Blob path. If device-tree is specified, `dtbs/filename` must exist in kernel or gadget snap (depends on origin) and `snap_device_tree_origin` and `snap_device_tree` are made available for u-boot and grub. (optional)
* `device-tree-origin` (string, optional): `kernel` or `gadget` (default) depending if the DTB is located in the kernel or in the gadget snap.
* `volumes` (YAML sub-section, required): the volumes layout, where each disk image is represented as a YAML sub-section.

### The `volumes` sub-section

Each volume is described by:

* a name (required)
* a partition structure (required)
* a bootloader definition (`grub`, `u-boot`)
* a partitioning schema eg. `mbr`

Volumes defining the structure and content for the images to be written into one ore more block devices of the gadget device. Each volume in in the structure represents a different image for a "disk" in the device. (optional)
volumes:

```
  # Name of volume and image file generated. Must be formed by [a-z-]+. (required)
  <volume name>:

    # 2-digit hex code for MBR disk ID or GUID for GPT disk id. (optional)
    id: <id>

    # Bootloader in the volume. Required in at least one volume. (required/optional)
    bootloader: grub | u-boot

    # Which partitioning schema to use. Defaults to gpt. (optional)
    schema: mbr | gpt | mbr,gpt

    # Structure defines layout of the volume, including partitions,
    # Master Boot Records, or any other relevant content. (required)
    structure:
      - # Structure value is a list.

        # Structure item name. There's an implementation-specific constraint
        # on the maximum length. The maximum length of a partition name
        # for GPT is 36 characters in the UTF-16 character set. (optional)
        name: <name>

        # GPT unique partition id, disallowed on MBR volumes. (optional)
        id: <id>

        # Type of structure. May be specified as a two-hex-digit MBR partition
        # type, a GPT partition type GUID, or both for hybrid schemas. It may
        # also be "mbr" for the Master Boot Record of a disk. (required)
        type: <mbr type> | <gpt guid> | <mbr type>,<gpt guide> | mbr

        # Size for structure item. Maximum of 446 for the "mbr" type. (required)
        size: <bytes> | <bytes/2^20>M | <bytes/2^30>G

        # The offset from the beginning of the image. Defaults to right after
        # prior structure item. (optional)
        offset: <bytes> | <bytes/2^20>M | <bytes/2^30>G

        # Offset of this structure element (in units of 512-byte sectors) is
        # written to the provided position within the volume in LBA48 pointer
        # format (32-bit little-endian). This position may be specified as a
        # byte-offset relative to the start of another named structure item.
        # (optional)
        offset-write: [<name>+]<bytes> |
                      [<name>+]<bytes/2^20>M |
                      [<name>+]<bytes/2^30>G

        # Filesystem type. Defaults to none. (optional)
        filesystem: none | vfat | ext4

        # Filesystem label. Defaults to name of structure item. (optional)
        filesystem-label: <label>

        # Content to be copied from gadget snap into the structure. This
        # field takes a list of one of the following formats. (required)
        content:

            # Copy source (relative to gadget base directory) into filesystem
            # at target (relative to root). Directories must end in a slash.
            - source: <filename> | <dir>/  # (required)
              target: <filename> | <dir>/  # (required)

            # Dump image (relative to gadget base directory) of the raw data
            # as-is into the structure at offset. If offset is omitted it
            # defaults to right after prior content item. If size is omitted,
            # defaults to size of contained data.
            - image: <filename>                                 # (required)
              offset: <bytes> | <bytes/2^20>M | <bytes/2^30>G   # (optional)
              offset-write: (see respective item above)         # (optional)
              size: <bytes> | <bytes/2^20>M | <bytes/2^30>G     # (optional)
```

#### Example: a raspberry pi 3 gadget.yaml

    device-tree: bcm2710-rpi-3-b.dtb
    volumes:
      pi3:
        schema: mbr
        bootloader: u-boot
        structure:
          - type: 0C
            filesystem: vfat
            filesystem-label: system-boot
            size: 128M
            content:
              - source: boot-assets/
                target: /

Used with the following directory structure:

    .
    ├── boot-assets
    │   ├── (...)
    │   └── bcm2710-rpi-3-b.dtb
    ├── meta
    │   ├── (...)
    │   ├── gadget.yaml
    │   └── snap.yaml
    ├── (...)
    └── README

## Examples of "production ready" gagdet snaps

- [Beagleblack](http://bazaar.launchpad.net/~snappy-dev/snappy-hub/snappy-systems/files/head:/beagleblack/)
- [Dragonboard](http://bazaar.launchpad.net/~snappy-dev/snappy-hub/snappy-systems/files/head:/dragonboard/)
- [amd64](http://bazaar.launchpad.net/~snappy-dev/snappy-hub/snappy-systems/files/head:/generic-amd64/)
- [i386](http://bazaar.launchpad.net/~snappy-dev/snappy-hub/snappy-systems/files/head:/generic-i386/)
- [pi2](http://bazaar.launchpad.net/~snappy-dev/snappy-hub/snappy-systems/files/head:/pi2/)
- [pi3](http://bazaar.launchpad.net/~snappy-dev/snappy-hub/snappy-systems/files/head:/pi3/)
