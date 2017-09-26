---
title: What is Ubuntu Stacks?
---

# What is Ubuntu Core Stacks?

Ubuntu Core Stacks is a set of snap packages that offer system-level functionality that
enables important core system-level features not offered by the base Ubuntu Core
system. With little to no additional effort, these snaps can be dropped in place
on existing systems bringing significant new value to these systems.
These snaps have been well tested in various commercial offerings and are
actively maintained by an internal Canonical team.

Please note that some additional integration work to these snaps may be required if
new applications of these snaps diverges significantly from existing applications.

# What Ubuntu Core Stacks offers

Ubuntu Core Stacks currently offers the following areas of functionality relevant
to many different types of Ubuntu Core-based systems:

* [Audio management](audio/index.md)
* [Bluetooth device management](bluetooth/index.md)
* [Disk management](disk/index.md)
* [Easy OpenVPN](easy-openvpn/index.md)
* [Location services](location/index.md)
* Multimedia management
* [Cellular modem device data management](network/modem-manager/docs/index.md)
* [Network interface management](network/network-manager/docs/index.md) (both wired and wireless)
* [Power management for battery-operated devices](power/index.md)
* [TPM](tpm/index.md) [Reference](https://en.wikipedia.org/wiki/Trusted_Platform_Module)
* [WiFi Access Point (AP)](network/wifi-ap/docs/index.md)
* [Utilities](utilities/index.md)
* Extensive manual and automatic testing framework for above functionality via
  [Plainbox](https://pypi.python.org/pypi/plainbox) and [Spread](https://github.com/snapcore/spread)

# Contributing source changes to these snaps

  You may find the existing source repositories for these snaps as well as where to
  submit contributions to them [here](https://code.launchpad.net/~snappy-hwe-team/snappy-hwe-snaps/).
  You may also file bugs against these snaps [here](https://bugs.launchpad.net/snappy-hwe-snaps).

  Please see the following documentation which covers how to retrieve and submit sources
  from Launchpad using git: [getting and pushing code](https://help.launchpad.net/Code/Git#Getting_code)
