---
myst:
  html_meta:
    description: Report Upower bugs on Ubuntu Core. File issues with system logs and power management information.
---

(explanation-system-snaps-upower-reference-report-a-bug)=
# Report a Bug

Bugs can be reported [here](https://github.com/canonical/upower-snap).

When submitting a bug report, please attach system log coming from the journal:

```bash
sudo journalctl --no-pager > system-log
```
