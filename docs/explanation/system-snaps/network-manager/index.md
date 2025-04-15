(explanation-system-snaps-network-manager-index)=
# Network-Manager

Network Manager is a system network service that manages your network devices and connections and attempts to keep network connectivity active when available. It manages Ethernet, Wi-Fi, mobile broadband (WWAN) and PPPoE devices while also providing VPN integration with a variety of different VPN services.

By default network management on [Ubuntu Core](https://www.ubuntu.com/core) is handled by systemd's [networkd](https://www.freedesktop.org/software/systemd/man/systemd-networkd.service.html) and [netplan](https://launchpad.net/netplan). However, when Network Manager is installed, it will take control of all networking devices in the system by creating a netplan configuration file in which it sets itself as the default network renderer.

## What NetworkManager Offers

The upstream Network Manager project offers a wide range of features and most, but not all of them, are available in the snap package at the moment.

Currently we provide support for the following high level features:

* Wi-Fi connectivity
* WAN connectivity (together with Modem Manager)
* Ethernet connectivity
* Wi-Fi access point creation
* Shared connections
* VPN connections

## Upstream documentation

Documentation for the upstream project can be found at [https://wiki.gnome.org/Projects/NetworkManager](https://wiki.gnome.org/Projects/NetworkManager).

```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

*
*/index
