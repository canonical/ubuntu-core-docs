(explanation-system-snaps-upower-install-upower)=
# Install Upower


The Upower snap is currently available from the Snap Store. At can be installed on any system that supports snaps but is only recommended on [Ubuntu Core](/index) at the moment.

You can install the snap with the following command (replace 24 with the ubuntu core version you use):
```bash
snap install upower --channel=24/stable
```
All necessary plugs and slots will be automatically connected within the installation process. You can verify this with:

```bash
 snap connections upower
```

**NOTE:**  The  *upower:bluez*  plug only gets connected when the  *bluez*  snap is installed too. Otherwise it stays disconnected.

Once the installation has successfully finished the Upower service is running in the background. You can check its current status with

```bash
snap services upower
```

Now you have Upower successfully installed.

## Tracks and channels

The upower snap has currently 1 track, the track name will refer to the version of the base snap used.

* **24**: Contains upstream 1.90.2 and has a core24 base. This is the default channel.

All these tracks are available with the usual risks: stable, candidate, beta, and edge, but only the stable version should be used for production devices. The meaning of the other risk levels is internal to the development team of the upower snap.

