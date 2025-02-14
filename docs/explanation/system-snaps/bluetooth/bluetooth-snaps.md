# Add Bluetooth to snaps

This section will show what are the necessary bits in the  *snapcraft.yaml*  while snapping an application that uses Bluetooth.

## Bluetooth Interfaces

There are two Bluetooth related interfaces available on Ubuntu Core:

- [bluez](https://snapcraft.io/docs/bluez-interface): allows accessing the Bluetooth service through D-Bus API
- [bluetooth-control](https://snapcraft.io/docs/bluetooth-control-interface):  used to talk to the kernel-side of the Bluetooth stack directly.

## Contents of snapcraft.yaml

This section presents a  *snapcraft.yaml*  template for applications that use Bluetooth.

The  *bluez*  snap discussed previously is a somewhat complex thing because it includes both the Bluetooth service ( *bluetoothd*  and  *obexd* ) and the client applications ( *bluetoothctl*  and  *obexctl* ). Because of this it defines the slots and plugs.

The standalone Bluetooth application that could be used in place of  *bluetoothctl*  needs to take care only of the client side. In fact all it has to do is to define a  *bluez*  plug.

In the example below the  *foo*  application defines a  *client*  plug that is nothing more than a plug side of the  *bluez*  interface.
```
plugs:
  client:
      interface: bluez

apps:
  foo:
    command: "bin/foo-command"
    plugs: [client]

```
Note that if by any chance your application needs to talk directly to the chip, then the  *bluetooth-control*  interface will suit these needs better than the  *bluez*  one.
