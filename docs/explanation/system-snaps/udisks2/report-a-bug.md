---
myst:
  html_meta:
    description: Report Udisks2 bugs on Ubuntu Core. File issues with system logs and diagnostic information.
---

(explanation-system-snaps-udisks2-reference-report-a-bug)=
# Report a Bug

Bugs can be reported [here](https://github.com/canonical/udisks2-snap).

When submitting a bug report, please attach system log coming from the journal:

```bash
sudo journalctl --no-pager > system-log
```
