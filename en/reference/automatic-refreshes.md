b
---
title: Automatic refreshes
table_of_contents: true
---

# Automatic refreshes

Installed snaps are automatically refreshed a few times a day, assuming a different revision is available on the channel being tracked.

More details about when it is to be triggered may be obtained via:

    systemctl list-timers snapd.refresh.timer

Check whether the update worked with:

    systemctl status -l snapd.refresh.service

and to view any output from the command run

    sudo journalctl -u snapd.refresh.service
