---
title: What is Ubuntu Stacks?
---

# What is Ubuntu Stacks?

Ubuntu Stacks is a set of snap packages that offer system-level functionality that
enables important core system-level functionality not offered by the base Ubuntu Core
system. With little to no additional effort, these snaps can be dropped in place
on one or more new or existing systems bringing significant new functionality.
These snaps have been well tested in various commercial offerings and are
actively maintained by an internal Canonical team.

Please note that some additional integration work to these snaps are required if
new application of these snaps diverges significantly from existing applications.

You may find the existing source repositories for these snaps as well as where to
submit contributions to them [here](https://code.launchpad.net/~snappy-hwe-team/snappy-hwe-snaps/).
You may also file bugs against these snaps [here](https://bugs.launchpad.net/snappy-hwe-snaps).

# What Ubuntu Stacks offers

Ubuntu Stacks currently offers the following areas of functionality that areas
relevant to many different types of Ubuntu Core-based systems:

* [Audio device management](audio/index.md)
* [Bluetooth device management](bluetooth/doc/overview.md)
* [Disk mountpoint management](disk/index.md)
* Location services (GPS, WiFi, etc)
* Media playback/recording management
* Modem device management
* [Network interface management](network/docs/index.md) (both wired and wireless)
* Power management for battery-operated devices
* [TPM](tpm/index.md) [Reference](https://en.wikipedia.org/wiki/Trusted_Platform_Module)
* WiFi Access Point (AP) system offering

* Extensive manual and automatic testing framework for above functionality via
  [Plainbox](https://pypi.python.org/pypi/plainbox) and [Spread](https://github.com/snapcore/spread)
