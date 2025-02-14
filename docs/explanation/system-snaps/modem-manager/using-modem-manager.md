# Using Modem Manager

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
```
## Available commands

The ModemManager upstream project comes with a few commands which can be used to control and manage the ModemManager service. This page gives a short overview of those commands which are available as part of the snap and what they are used for. Further details about their usage is given on linked pages.

### mmcli

The  **mmcli**  command offers a command-line based way to control and manage the ModemManager service.

An explanatory description of the command and available options is available [here](https://www.freedesktop.org/software/ModemManager/man/latest/mmcli.8.html)

### modem-manager.mbimcli

**mbimcli**  can be used to control directly devices that use the MBIM protocol.

More details can be found in the [man page](http://manpages.ubuntu.com/manpages/focal/man1/mbimcli.1.html).

### modem-manager.qmicli

**qmicli**  can be used to control directly devices that use the QMI protocol.

More details can be found in the [man page](http://manpages.ubuntu.com/manpages/focal/man1/qmicli.1.html).

### modem-manager.mbim-network

**mbim-network**  can be used to start a cellular connection for devices that support the MBIM protocol, mainly for debugging purposes.

More details can be found in the [man page](http://manpages.ubuntu.com/manpages/focal/man1/mbim-network.1.html).

### modem-manager.qmi-network

**qmi-network**  can be used to start a cellular connection for devices that support the QMI protocol, mainly for debugging purposes.

More details can be found in the [man page](http://manpages.ubuntu.com/manpages/focal/man1/qmi-network.1.html).


## Enter SIM passwords

We can find out if the SIM is locked by issuing:

```bash
sudo mmcli -m 0
```

## Configure cellular connections

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
```

## D-Bus API

Documentation for the D-Bus API is provided by the ModemManager upstream project [here](https://www.freedesktop.org/software/ModemManager/api/latest/).

