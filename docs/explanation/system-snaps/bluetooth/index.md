# Bluetooth

Bluetooth is a standard for wireless communication on short distances. It
defines multiple profiles for different use cases such as music streaming,
serial connections, message exchange, phone calls, and many others. It was
first published in 1994 and since then has it has updated several times.
Bluetooth 5 and its successors are a big step forward to support the IoT market
and it's needs.

Bluetooth is developed and published by the [Bluetooth Special Interest
Group](http://www.bluetooth.com/)

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

On Ubuntu Core there are two
[interfaces](snapcraft.io/docs/supported-interfaces) that define permissions
for the Bluetooth stack:

 * bluetooth-control, that allows managing the kernel Bluetooth stack. The slot
   side of it is provided by the system, while the bluez snap connects with a
   plug to it.
 * bluez, that allows running and using the bluez service. The bluez snap
   installs the slot side of this interface, while plugs can be connected to it
   to be able to interact with the service by using the bluez dbus interface.

## bluez snap tracks

The bluez snap has different tracks that should be used for different Ubuntu Core releases:

* 24: Contains upstream 5.72 and has a core24 base.
* 22: Contains upstream 5.64 and has a core22 base. 
* 20: Contains upstream 5.53 and has a core20 base.
* latest: Contains upstream 5.48 and has a core base. Despite the unfortunate
  name (there are historical reasons for that) it is the oldest version.

The naming scheme for the *bluez* snap version includes the BlueZ version being
packaged in the snap and a version separated by a hypen for the snap itself.
For instance, the version could be 5.64-7, for BlueZ 5.64 and snap subversion
7 - whenever the snap is updated but still provides BlueZ version 5.64 the last
digit will be incremented. The

```bash
$ snap info bluez
```

command shows the tracks, version and additional metadata for this snap.

## Installation

The *bluez* snap can be installed for a given track with:

```
$ snap install --channel=<track> bluez
```

It is recommended that the track matches the system's Ubuntu Core version.

### Check installation

You can check the _bluez_ snap is installed by using _snap list_:

```
$ snap list
Name     Version   Rev   Tracking       Publisher    Notes
bluez    5.48-3    284   latest/stable  canonical*   -
```

To check that the bluez service is running as expected:

```
$ snap services
Service      Startup  Current  Notes
bluez.bluez  enabled  active   -
```

```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

Bluetooth commands <commands>
Add Bluetooth to snaps <bluetooth-snaps>
Device pairing <pairing>
