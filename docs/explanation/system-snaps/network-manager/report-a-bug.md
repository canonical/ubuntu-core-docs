(explanation-system-snaps-network-manager-reference-report-a-bug)=
# Report a Bug

Bugs can be reported [here](https://bugs.launchpad.net/snappy-hwe-snaps/+filebug).

When submitting a bug report, please attach system log coming from the journal:

```bash
journalctl --no-pager > system-log
```

And the output of the following two commands:

```bash
nmcli d
nmcli c
```
It is a good idea to set the log level to DEBUG so that the verbose information is provided. To do this for NetworkManager please see the {ref}`Logging Messages <explanation-system-snaps-network-manager-how-to-guides-message-logging>` page.

If there is a modem and the modem-manager snap is installed, also add the output of
```bash
sudo modem-manager.mmcli -m <N>
```
With being the modem number as reported by
```bash
sudo modem-manager.mmcli -L
```

