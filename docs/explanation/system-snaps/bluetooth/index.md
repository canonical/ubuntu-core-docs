# Bluetooth

Bluetooth is a standard for wireless communication on short distances. It standardised multiple profiles for different use-cases such as music streaming, serial connections, message exchange, phone calls, and many others. It has been first published in 1994 and since then has been updated several times. The recent version called Bluetooth 5 is a major update and step forward towards the IoT market and it's needs.

Bluetooth is developed and published by the [Bluetooth Special Interest Group](http://www.bluetooth.com/).

## BlueZ

BlueZ is the official Linux Bluetooth stack. It provides, in it's modular way, support for the core Bluetooth layers and protocols.

Currently BlueZ consists of many separate modules:

* Bluetooth kernel subsystem core
* L2CAP and SCO audio kernel layers
* RFCOMM, BNEP, CMTP and HIDP kernel implementations
* HCI UART, USB, PCMCIA and virtual device drivers
* General Bluetooth and SDP libraries and daemons
* Configuration and testing utilities
* Protocol decoding and analysis tools

You can find more information about this on the BlueZ upstream homepage [here](http://www.bluez.org/)

## Bluetooth interfaces

On Ubuntu Core there are two interfaces which define the communication of the Bluetooth stack:

* bluetooth-control
* bluez

You can learn more on the [interfaces documentation](https://snapcraft.io/docs/supported-interfaces).

Note that unlike the  *bluetooth-control*  interface the  *bluez*  interface is not installed by the  *core*  snap, neither the  *gadget*  nor  *kernel* . It's instead installed by the application snap.

## Installation

Install the bluez snap via:
```bash
$ snap install bluez
```
The snap is being downloaded and installed. Observe that the snap has been installed like follows:
```bash
$ snap install bluez
bluez 5.48-4 from Canonical✓ installed
```
The naming scheme for the bluez snap includes the current BlueZ version being packaged in the snap (5.48 in this case) and the revision of the snap itself (4th in this case). Whenever the snap is updated but still provides BlueZ version 5.48 the last digit will be incremented.

The above output informs that BlueZ 5.48 has been installed on the system. This effect is equivalent to typing
```bash
sudo apt install bluez
```
on a classic Ubuntu flavor that you run on your desktop or laptop computer.

Let's list the snap plugs/slots for the snap:

```bash
$ snap connections bluez
Interface          Plug                     Slot           Notes
bluetooth-control  bluez:bluetooth-control  -              -
bluez              bluez:client             bluez:service  -
home               bluez:home               -              -
network-control    bluez:network-control    -              -
uhid               bluez:uhid               :uhid          -
```
Note that the bluez:service slot is provided by the bluez snap itself.

### bluez tracks and channels

The bluez snap has currently four tracks, and with the exception of ‘latest’, the track name will refer to the base snap version used, and that is the convention used at the moment

* 24: Contains upstream version 5.72 and has a core24 base.
* 22: Contains upstream version 5.64 and has a core22 base. Nowadays, this is the one installed by default if the channel is not specified when running `snap install` .
* 20: Contains upstream version 5.53 and has a core20 base.
* latest: Contains upstream version 5.48 and has a core16 base. Despite the unfortunate name (there are historical reasons for that) it is the oldest version.

### Check installation

You can check the _bluez_ snap is installed by using _snap list_:

```bash
$ snap list
Name     Version   Rev   Tracking       Publisher    Notes
bluez    5.48-3    284   latest/stable  canonical*   -
```

If bluez is not listed by the above command you can install it with:

```bash
$ sudo snap install bluez
```

## Bluetooth daemons

Normally, once the snap is installed, the Bluetooth daemon is up and running.

Nevertheless it is still good to verify this.

For bluetoothd type:

```bash
$ systemctl status snap.bluez.bluez.service
```

The expected output should look like:

```bash
● snap.bluez.bluez.service - Service for snap application bluez.bluez
   Loaded: loaded (/etc/systemd/system/snap.bluez.bluez.service; enabled; vendor preset: enabled)
   Active: active (running) since Wed 2016-11-02 15:15:31 UTC; 4 months 11 days ago
 Main PID: 1580 (bluetoothd)
   CGroup: /system.slice/snap.bluez.bluez.service
           └─1580 /snap/bluez/x2/usr/lib/bluetooth/bluetoothd -E
```

For obexd type:

```bash
$ systemctl status snap.bluez.obex.service
```

The expected output should look like:
```bash
● snap.bluez.obex.service - Service for snap application bluez.obex
   Loaded: loaded (/etc/systemd/system/snap.bluez.obex.service; enabled; vendor preset: enabled)
   Active: active (running) since Wed 2016-11-02 15:15:31 UTC; 4 months 11 days ago
 Main PID: 1584 (obexd)
   CGroup: /system.slice/snap.bluez.obex.service
           └─1584 /snap/bluez/x2/usr/lib/bluetooth/obexd
```
Note that you need bluetoothd for the regular Bluetooth usage, however it is not enough for exchanging files over Bluetooth. For this to work you need the obexd daemon. It is mentioned here because, for example, on Ubuntu Desktop the obexd is not started by default.

## Plugs and slots

Checking for the Bluetooth plug and slot being auto-connected is one of the snap verification criteria therefore in 99.9% cases it will be as expected. For the sake of exercise it is good to verify:

```
$ snap connections bluez
Interface          Plug                     Slot           Notes
bluetooth-control  bluez:bluetooth-control  -              -
bluez              -                        bluez:service  -
bluez              bluez:client             -              -
home               bluez:home               :home          -
network-control    bluez:network-control    -              -
uhid               bluez:uhid               :uhid          -
```

You should expect the output like the above, that is the bluez:service slot is connected with the bluez:client plug.


```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

Bluetooth commands <commands>
Add Bluetooth to snaps <bluetooth-snaps>
Kernel configuration <kernel-configuration>
Device pairing <pairing>
