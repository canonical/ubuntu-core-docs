(explanation-system-snaps-modem-manager-index)=
# Modem Manager

The modem-manager snap is based on [upstream ModemManager](https://www.freedesktop.org/wiki/Software/ModemManager/), which is a D-Bus-activated daemon which controls mobile broadband (2G/3G/4G) devices and connections. ModemManager is able to prepare and configure a wide variety of modems and setup connections with them.

The modem-manager snap should be used in most cases jointly with the [network-manager](/explanation/system-snaps/network-manager/index) snap. NetworkManager can be used to set cellular connection settings and to start and stop the connection.

The recommended way of using a modem in [Ubuntu Core](/index) is described in [NetworkManager documentation](../network-manager/index). This documentation serves as further reference in case more control on the cellular modem is needed. It is important to note that many of the things explained are automatically performed when using NetworkManager.

## What ModemManager Offers

The main features provided by ModemManager are:

* Cellular connectivity for a [wide variety of modems](https://www.freedesktop.org/wiki/Software/ModemManager/SupportedDevices/)
* Support for AT commands, QMI, and MBIM interfaces
* SMS messages support for USB modems

## Upstream documentation

Existing documentation from the upstream project can be found [here](https://www.freedesktop.org/wiki/Software/ModemManager/).

```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

Install Modem Manager <install-modem-manager>
Using Modem Manager <using-modem-manager>
Debug Modem Manager <debug>
Release notes <release-notes>
