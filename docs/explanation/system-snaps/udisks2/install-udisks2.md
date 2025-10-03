(explanation-system-snaps-udisks2-install-udisks2)=
# Install Udisks2


The Udisks2 snap is currently available from the Snap Store. At can be installed on any system that supports snaps but is only recommended on [Ubuntu Core](/index) at the moment.

You can install the snap with the following command:
```bash
snap install udisks2
```
All necessary plugs and slots will be automatically connected within the installation process. You can verify this with:

```bash
 snap connections udisks2
```

Once the installation has successfully finished the Udisks2 service is running in the background. You can check its current status with

```bash
systemctl status systemctl status snap.udisks2.udisksd
```

Now you have Udisks2 successfully installed.

## Tracks and channels

The Udisks2 snap has currently 3 tracks, and with the exception of the ‘latest’, the track name will refer to the version of the base snap used.

* **24**: Contains upstream 2.10.1 and has a core24 base.
* **22**: Contains upstream 2.9.4 and has a core22 base.
* **latest** : Contains upstream 2.6.4 and has a core16 base. This is the version that will be installed by default, but this is an older stale version that is not recommended for installation.

All these tracks are available with the usual risks: stable, candidate, beta, and edge, but only the stable version should be used for production devices. The meaning of the other risk levels is internal to the development team of the Udisks2 snap.
