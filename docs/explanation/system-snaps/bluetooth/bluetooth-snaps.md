# Add Bluetooth to snaps

This section will show what are the necessary bits in the  *snapcraft.yaml*  while snapping an application that uses Bluetooth.

## Bluetooth Interfaces

There are two Bluetooth related interfaces available on Ubuntu Core:

- [bluez](https://snapcraft.io/docs/bluez-interface): allows accessing the Bluetooth service through D-Bus API
- [bluetooth-control](https://snapcraft.io/docs/bluetooth-control-interface):  used to talk to the kernel-side of the Bluetooth stack directly.

## Contents of snapcraft.yaml

The bluez snap runs the bluetoothd service. This service provides a D-Bus API that can be accessed by other application snaps by connecting to the `bluez:service` slot for the *bluez* interface provided by the bluez snap.

For this, the application snap must connect to the *bluez* slot by defining a plug, such as in the following *snapcraft.yaml* snippet:

```yaml
plugs:
  client:
      interface: bluez

apps:
  foo:
    command: "bin/foo-command"
    plugs: [client]
``` 

If an application requires direct access to the kernel bluetooth stack, the *bluetooth-control* interface should be used instead. Installation of the *bluez* snap is then not required.
