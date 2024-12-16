(explanation-system-snaps-network-manager-install-networkmanager)=
# Install NetworkManager


The NetworkManager snap is currently available from the Snap Store. It can be installed on any system that supports snaps but is only recommended on [Ubuntu Core](https://www.ubuntu.com/core) at the moment.

You can install the snap with the following command:
```bash
snap install network-manager network-manager (1.10/stable) 1.10.6-7 from Canonical✓ installed
```
All necessary plugs and slots will be automatically connected within the installation process. You can verify this with:
```bash
$ snap connections network-manager Interface Plug Slot Notes dbus network-manager:wpa - - firewall-control network-manager:firewall-control :firewall-control - hardware-observe network-manager:hardware-observe :hardware-observe - login-session-observe network-manager:login-session-observe :login-session-observe - modem-manager network-manager:modem-manager modem-manager:service - network network-manager:network :network - network-manager network-manager:nmcli network-manager:service - network-observe network-manager:network-observe :network-observe - network-setup-control network-manager:network-setup-control :network-setup-control - network-setup-observe network-manager:network-setup-observe :network-setup-observe - ppp network-manager:ppp :ppp -
```
**NOTE:**  The  *network-manager:modem-manager*  plug only gets connected when the  *modem-manager*  snap is installed too. Otherwise it stays disconnected. Similarly, there is a  *network-manager:wpa*  plug in case we would want to use a custom wpa supplicant snap instead of the one supplied by the core snap (this is not generally recommended).

Once the installation has successfully finished the NetworkManager service is running in the background. You can check its current status with
```bash
systemctl status snap.network-manager.networkmanager.service ● snap.network-manager.networkmanager.service - Service for snap application network-manager.networkmanager Loaded: loaded (/etc/systemd/system/snap.network-manager.networkmanager.service; enabled; vendor preset: enabled) Active: active (running) since Thu 2020-07-09 10:19:01 UTC; 6min ago Main PID: 2850 (NetworkManager) Tasks: 3 (limit: 569) CGroup: /system.slice/snap.network-manager.networkmanager.service └─2850 /snap/network-manager/564/usr/sbin/NetworkManager --config-dir=/var/snap/network-manager/564/conf.d/ --config=/snap/network-manager/564/etc/NetworkManager/NetworkManager.conf --log-level=INFO --no-daemon
```
Now you have NetworkManager successfully installed.

## network-manager tracks and channels

The network-manager snap has currently five tracks, and with the exception of the ‘latest’ and ‘1.10’ track, the track name will refer to the version of the base snap used.

* **24**: Contains upstream 1.46.0 and has a core24 base.
* **22**: Contains upstream 1.36.6 and has a core22 base. Nowadays, this is the one installed by default if the channel is not specified when running `snap install` .
* **20** : Contains upstream 1.22.10 and has a core20 base.
* **1.10** : Contains upstream 1.10.6 and has a core18 base. The track name refers to the upstream version. More modern releases have changed the convention so the track now refers to the base snap.
* **latest** : Contains upstream 1.2.2 and has a core16 base. Despite the unfortunate name (there are historical reasons for that) it is the oldest version.

All these tracks are available with the usual risks: stable, candidate, beta, and edge, but only the stable version should be used for production devices. The meaning of the other risk levels is internal to the development team of the network-manager snap.

