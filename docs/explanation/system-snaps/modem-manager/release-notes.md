(explanation-system-snaps-modem-manager-reference-release-notes)=
# Release Notes


The version numbers mentioned on this page correspond to those released in the Ubuntu snap store.

You can check with the following command which version you have currently installed:
```bash
$ snap info modem-manager name: modem-manager summary: ModemManager is a service which controls mobile broadband publisher: Canonical✓ store-url: https://snapcraft.io/modem-manager contact: snaps@canonical.com license: unset description: | ModemManager is a D-Bus-activated daemon which controls mobile broadband (2G/3G/4G) devices and connections. Whether built-in devices, USB dongles, bluetooth-paired telephones or professional RS232/USB devices with external power supplies, ModemManager is able to prepare and configure the modems and setup connections with them. The modem-manager snap is usually used together with the network-manager snap. The snap is geared towards devices and IoT and is optimized for Ubuntu Core. Its usage on desktop/server Ubuntu is possible, but manual connection of interfaces is needed and do not expect full integration with the GUI. Documentation on how to use the snap can be found in https://docs.ubuntu.com/core/en/stacks/network/modem-manager/docs/. Please find the source code at https://code.launchpad.net/~snappy-hwe-team/snappy-hwe-snaps/+git/modem-manager commands: - modem-manager.mbim-network - modem-manager.mbimcli - modem-manager.mmcli - modem-manager.qmi-network - modem-manager.qmicli services: modem-manager.modemmanager: simple, enabled, active snap-id: KtwxgRlwCAVKFw92BUdt1WloH1Va3QPo tracking: 1.10/stable refresh-date: today at 08:34 UTC channels: 1.10/stable: 1.10.0-4 2020-01-21 (414) 1MB - 1.10/candidate: 1.10.0-4 2020-01-21 (414) 1MB - 1.10/beta: 1.10.0-4 2020-01-20 (414) 1MB - 1.10/edge: 1.10.0-5-dev 2020-02-11 (438) 1MB - latest/stable: 1.8.0-12 2020-02-04 (426) 1MB - latest/candidate: 1.8.0-12 2020-02-04 (426) 1MB - latest/beta: 1.8.0-12 2020-01-21 (426) 1MB - latest/edge: 1.8.0-12 2020-02-04 (426) 1MB - 20/stable: – 20/candidate: – 20/beta: 1.12.8-1 2020-06-22 (454) 1MB - 20/edge: 1.12.8-1-dev 2020-06-22 (451) 1MB - installed: 1.10.0-4 (414) 1MB -
```
The detailed changelog for each version can be consulted in the sources for each track:

* For track 20, [here](https://git.launchpad.net/~snappy-hwe-team/snappy-hwe-snaps/+git/modem-manager/tree/ChangeLog?h=snap-20)
* For track 1.10, [here](https://git.launchpad.net/~snappy-hwe-team/snappy-hwe-snaps/+git/modem-manager/tree/ChangeLog?h=snap-1.10)
* For track latest (note again this is not actually the more modern MM), [here](https://git.launchpad.net/~snappy-hwe-team/snappy-hwe-snaps/+git/modem-manager/tree/ChangeLog)

