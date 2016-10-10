---
title: Create a gadget snap
---

The `gadget` snap package is a snap package `type` that is used to setup and
personalize the system. It's regular snap with additional files and conventions. For example, it can contain a specific DTB for your target device or additional configurations files the device would require to be fully enabled.

There can only be *one* snap package of `type: gadget` on a device and it can only be
installed during image provision.

### meta/gadget.yaml

The gadget snap has an additional `meta/gadget.yaml` file that describes
the gadget specific configuration. The `gadget.yaml` structure is documented in the [gadget snap syntax](/reference/gadget.md) reference.

### File layout conventions

The bootloader configuration is expected to be at the toplevel of the
gadget snap. The filename is `${bootloader_name}.conf`, e.g.
`grub.conf` or `uboot.conf`. This file will be installed into the boot
partition as `grub.cfg` and `uboot.env`. The bootloader configuration
contains the boot logic.

A cloud-init configuration may be provided at the toplevel of the
gadget snap as `cloud.conf`. It will be copied into the image as
`/etc/cloud/cloud.cfg` and will be the only file in that directory.

#### Examples

Production-ready examples can be found in the [gadget snap syntax](/reference/gadget.md) reference.
