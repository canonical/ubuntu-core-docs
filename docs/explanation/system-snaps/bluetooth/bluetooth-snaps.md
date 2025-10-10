# Add Bluetooth to snaps

This section will show what are the necessary bits in the  *snapcraft.yaml*  while snapping an application that uses Bluetooth.

## Bluetooth Interfaces

There are two Bluetooth related interfaces available on Ubuntu Core:

- [bluez](https://snapcraft.io/docs/bluez-interface): allows accessing the Bluetooth service through D-Bus API
- [bluetooth-control](https://snapcraft.io/docs/bluetooth-control-interface):  used to talk to the kernel-side of the Bluetooth stack directly.

## Contents of snapcraft.yaml

The bluetoothd service run from the bluez snap provides a D-Bus API that can be
used by other snap applications, by connecting to the `bluez:service` slot for the
*bluez* interface which is provided by the bluez snap.

For this, the application snap must connect to the *bluez* slot by defining a
plug. An example snippet from the *snapcraft.yaml* of an application doing this
could be:

```
plugs:
  client:
      interface: bluez

apps:
  foo:
    command: "bin/foo-command"
    plugs: [client]
``` 

Note that if by any chance an application needs to talk directly to the kernel
bluetooth stack, then the *bluetooth-control* interface will suit these needs
better than the *bluez* one. In this case, there would be no need to install th
bluez snap.
