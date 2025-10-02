# Bluetooth commands

The purpose of the  *bluez*  snap is to provide the BlueZ Bluetooth stack. Apart from this it contains various tools shipped with BlueZ itself. The following table lists the commands that are provided by the  *bluez*  snap:

| Command            | Short description                                 |
|--------------------|---------------------------------------------------|
| bluez.bluetoothctl | An interactive command-line interface to BlueZ    |
| bluez.btattach     | Attaches a serial UART to the BT stack            |
| bluez.btmgmt       | An interactive cli to talk to the kernel BT stack |
| bluez.btmon        | A bluetooth monitor                               |
| bluez.hciattach    | DEPRECATED in favor of btattach                   |
| bluez.hciconfig    | DEPRECATED in favor of bluetoothctl and btmgmt    |
| bluez.hcidump      | DEPRECATED in favor of btmon                      |
| bluez.hcitool      | DEPRECATED in favor of bluetoothctl and btmgmt    |
| bluez.sdptool      | DEPRECATED in favor of bluetoothctl and btmgmt    |
