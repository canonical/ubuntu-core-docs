(explanation-system-snaps-modem-manager-how-to-guides-configure-cellular-connections)=
# Configure cellular connections

To establish a cellular connection:

```bash
$ sudo mmcli -m 0 --simple-connect="apn=my.carrier.apn"
successfully connected the modem
```

NOTE: This makes the modem establish a cellular connection but does not create a network interface, so the connection is not directly usable. To be able to use data, pppd or {mbim,qmi}-proxy need to be run with the right parameters. It is highly recommended to use NetworkManager instead, as explained in the 'About' section.

To find out the bearer path:
```bash
$ sudo mmcli -m 0 --list-bearers
Found 1 bearers:
    /org/freedesktop/ModemManager1/Bearer/0
```
To retrieve information about the bearer (as usual, we specify the bearer with the number at the end of the bearer's D-Bus path):

```bash
$ sudo mmcli -b 0
Bearer '/org/freedesktop/ModemManager1/Bearer/0'
