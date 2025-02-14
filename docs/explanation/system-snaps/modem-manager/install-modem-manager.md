(explanation-system-snaps-modem-manager-install-modem-manager)=
# Install Modem Manager

The ModemManager snap is currently available from the Ubuntu Store. It can be installed on any system that supports snaps but is only recommended on [Ubuntu Core](/index) at the moment.

You can install the snap with the following command:
```bash
snap install modem-manager modem-manager (1.10/stable) 1.10.0-4 from Canonical✓ installed
```

All necessary plugs and slots will be automatically connected within the installation process. You can verify this with:
```bash
snap connections modem-manager Interface Plug Slot Notes modem-manager modem-manager:mmcli modem-manager:service - modem-manager network-manager:modem-manager modem-manager:service -
```
We see here that the  *mmcli*  command line utility can use the ModemManager service and that network-manager can do the same (we will see that if the network-manager snap is already installed in the system).

Once the installation has successfully finished the ModemManager service is running in the background. You can check its current status with
```bash
$ systemctl status snap.modem-manager.modemmanager.service 
● snap.modem-manager.modemmanager.service - Service for snap application modem-manager.modemmanager Loaded: loaded (/etc/systemd/system/snap.modem-manager.modemmanager.service; enabled; vendor preset: enabled) 
Active: active (running) since Fri 2020-07-10 08:34:43 UTC; 2min 20s ago Main PID: 2047 (ModemManager) 
Tasks: 3 (limit: 569) 
CGroup: /system.slice/snap.modem-manager.modemmanager.service └─2047 /snap/modem-manager/414/usr/sbin/ModemManager --filter-policy=STRICT --log-level=INFO
```
Now you have ModemManager successfully installed. In the next sections we will briefly explain how to use part of ModemManager's features, using  *mmcli*  command line interface to interact with the service. For a complete reference on what can be done with ModemManager, take a look at [ *mmcli*  man page](https://www.freedesktop.org/software/ModemManager/man/latest/mmcli.8.html) and to [ModemManager's D-Bus interface](https://www.freedesktop.org/software/ModemManager/api/latest/). It is also possible to use  *dbus-send*  to directly access the D-Bus interface if desired.

Finally, note that to run both  *mmcli*  and  *dbus-send*  we need root permissions, so we use  *sudo*  with them.

## Tracks and channels

The modem-manager snap has currently five tracks, and with the exception of the 'latest' and '1.10' track, the track will refer to the version of the base used.

* **24** : Contains upstream version 1.23.4 and has a core24 base.
* **22** : Contains upstream version 1.20.0 and has a core22 base. Nowadays, this is the one installed by default if the channel is not specified when running  `snap install`. 
* **20** : Contains upstream version 1.18.6 and has a core20 base.
* **1.10** : Contains upstream version 1.10.0 and has a core18 base. The track name refers to the upstream version. More modern releases have changed the convention so the track now refers to the base snap.
* **latest** : Contains upstream version 1.8.0 and has a core16 base. Despite the unfortunate name (there are historical reasons for that) it is the oldest version.
