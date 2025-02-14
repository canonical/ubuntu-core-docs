(explanation-system-snaps-network-manager-how-to-guides-configure-cellular-connections)=
# Configure cellular connections

For cellular connections, first install the modem-manager snap with:
```bash
snap install modem-manager
```
Check whether a modem was properly detected via:

```bash
$ sudo modem-manager.mmcli -L
Found 1 modems:
    /org/freedesktop/ModemManager1/Modem/0 [description]
```
In this case we have just one modem, with index 0 (the number at the end of the D-Bus object path).

Show detailed information about the modem using that index:
```bash
$ sudo modem-manager.mmcli -m 0
/org/freedesktop/ModemManager1/Modem/0 (device id '871faa978a12ccb25b9fa30d15667571ab38ed88')
```
