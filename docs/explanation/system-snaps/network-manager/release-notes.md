(explanation-system-snaps-network-manager-reference-release-notes)=
# Release Notes


You can check with the following command which version you have currently installed:

```
$ snap info network-manager
name:      network-manager
summary:   Network Manager
publisher: Canonical✓
store-url: https://snapcraft.io/network-manager
contact:   https://help.ubuntu.com/community/NetworkManager
license:   unset
description: |
  NetworkManager is a system network service that manages your network
  devices and connections, attempting to keep active network connectivity
  when available. It manages ethernet, Wi-Fi, mobile broadband (WWAN) and
  PPPoE devices, provides VPN integration with a variety of different
  VPN serivces.
  Please find the source code for this track at:
    https://code.launchpad.net/~snappy-hwe-team/snappy-hwe-snaps/+git/network-manager/+ref/snap-1.10
commands:
  - network-manager.nmcli
  - network-manager.nmtui
  - network-manager.nmtui-connect
  - network-manager.nmtui-edit
  - network-manager.nmtui-hostname
services:
  network-manager.networkmanager: simple, enabled, active
snap-id:      RmBXKl6HO6YOC2DE4G2q1JzWImC04EUy
tracking:     1.10/stable
refresh-date: today at 10:18 UTC
channels:
  1.10/stable:      1.10.6-7      2020-06-29 (564) 4MB -
  1.10/candidate:   1.10.6-7      2020-06-29 (564) 4MB -
  1.10/beta:        1.10.6-7      2020-06-25 (564) 4MB -
  1.10/edge:        1.10.6-5-dev  2020-04-06 (542) 4MB -
  latest/stable:    1.2.2-25      2020-06-22 (554) 4MB -
  latest/candidate: 1.2.2-25      2020-06-19 (554) 4MB -
  latest/beta:      1.2.2-26      2020-07-07 (573) 4MB -
  latest/edge:      1.2.2-26-dev  2020-07-07 (569) 4MB -
  20/stable:        –                                  
  20/candidate:     –                                  
  20/beta:          1.22.10-1     2020-06-25 (561) 5MB -
  20/edge:          1.22.10-2-dev 2020-07-08 (580) 5MB -
installed:          1.10.6-7                 (564) 4MB -
```

The detailed changelog for each revision can be consulted in the sources for each track:

* For track 20, [here](https://git.launchpad.net/~snappy-hwe-team/snappy-hwe-snaps/+git/network-manager/tree/ChangeLog?h=snap-20)
* For track 1.10, [here](https://git.launchpad.net/~snappy-hwe-team/snappy-hwe-snaps/+git/network-manager/tree/ChangeLog?h=snap-1.10)
* For track latest (note again this is not actually the more modern NM), [here](https://git.launchpad.net/~snappy-hwe-team/snappy-hwe-snaps/+git/network-manager/tree/ChangeLog)

