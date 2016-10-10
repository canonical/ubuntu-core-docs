# ubuntu-core documentation

This documentation is currently in progress, and will be officially released alongside the official ubuntu-core series 16 images.

This documentation will walk you through the steps of building and managing an ubuntu-core device.

## Table of contents

### Guides

#### Introduction to Ubuntu core

- Feature overview
- Ubuntu core and snaps
- [Security and sandboxing](guides/intro/security.md)
- [Store and developer accounts](guides/intro/store.md)

#### Build a device

- [Build an ubuntu-core image](guides/build-device/image-building.md)
- Create a gadget snap
- Kernel: porting and requirements
- [Configuration and hooks](guides/build-device/config-hooks.md)
- Assertions and signature keys
- [Interfaces and snap declarations](guides/build-device/interfaces.md)
- Debugging

#### Manage devices

- First boot experience
- Auto-updates and rollbacks
- Distribution and continuous integration

#### Build snaps

- [snapcraft.io](http://snapcraft.io)

### Reference

- [Assertions types and syntax](reference/assertions.md)
- [Gadget snap syntax](reference/gadget.md)
- [Core interfaces reference](reference/interfaces.md)
- [Snapd rest API reference](reference/rest.md)
