(explanation-system-snaps-modem-manager-how-to-guides-gather-modem-information)=
# Gather Modem Information


If we have a modem in the system, we should be able to see it with _mmcli -L_, for instance:

```bash
$ sudo mmcli -L
Found 1 modems:
    /org/freedesktop/ModemManager1/Modem/0 [BRAND] MODEL
```
The command shows the D-Bus path for the modem, with the number at the end of the path being the argument to access it from the cli:

```bash
$ sudo mmcli -m 0

/org/freedesktop/ModemManager1/Modem/0 (device id '817f7e2b3c6dfdf1d4ee7f4c4ecc34de61bc5de9')
