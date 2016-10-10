---
title: Gadget snap syntax
---
A gadget snap requires two files in the `meta` directory of your snap.

* a `gadget.yaml` file that describes the device partitioning and boot system
* a `snap.yaml` file that describes the gadget snap and how it will be presented in stores

## The gadget.yaml file

Three YAML keys are used to describe your target device:

* `device-tree` (string): the Device Tree Blob path.
* `device-tree-origin` (string): `kernel` or `gadget` (default) depending if the DTB is located in the kernel or in the gadget snap.
* `volumes` (YAML sub-section, required): the volumes layout, where each disk image is represented as a YAML sub-section.

### The `volumes` sub-section

Each volume is described by:

* a name (required)
* a partition structure (required)
* a bootloader definition (`grub`, `u-boot`)
* a partitioning schema eg. `mbr`

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
