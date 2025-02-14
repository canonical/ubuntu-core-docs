(explanation-system-snaps-network-manager-install-networkmanager)=
# Install NetworkManager


The NetworkManager snap is currently available from the Snap Store. At can be installed on any system that supports snaps but is only recommended on [Ubuntu Core](/index) at the moment.

You can install the snap with the following command:
```bash
snap install network-manager
```
All necessary plugs and slots will be automatically connected within the installation process. You can verify this with:

```bash
 snap connections network-manager
```

**NOTE:**  The  *network-manager:modem-manager*  plug only gets connected when the  *modem-manager*  snap is installed too. Otherwise it stays disconnected. Similarly, there is a  *network-manager:wpa*  plug in case we would want to use a custom wpa supplicant snap instead of the one supplied by the core snap (this is not generally recommended).

Once the installation has successfully finished the NetworkManager service is running in the background. You can check its current status with

```bash
systemctl status snap.network-manager.networkmanager.service
```

Now you have NetworkManager successfully installed.

## Tracks and channels

The network-manager snap has currently five tracks, and with the exception of the ‘latest’ and ‘1.10’ track, the track name will refer to the version of the base snap used.

* **24**: Contains upstream 1.46.0 and has a core24 base.
* **22**: Contains upstream 1.36.6 and has a core22 base. Nowadays, this is the one installed by default if the channel is not specified when running `snap install` .
* **20** : Contains upstream 1.22.10 and has a core20 base.
* **1.10** : Contains upstream 1.10.6 and has a core18 base. The track name refers to the upstream version. More modern releases have changed the convention so the track now refers to the base snap.
* **latest** : Contains upstream 1.2.2 and has a core16 base. Despite the unfortunate name (there are historical reasons for that) it is the oldest version.

All these tracks are available with the usual risks: stable, candidate, beta, and edge, but only the stable version should be used for production devices. The meaning of the other risk levels is internal to the development team of the network-manager snap.

