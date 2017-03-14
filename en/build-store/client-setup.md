---
title: Client setup
table_of_contents: true
---

# Client setup

Snap clients can be connected to your store either by setting an environment variable consumed by the `snapd` service, or by being linked to a specific store through a [serial assertion](https://docs.ubuntu.com/core/en/reference/assertions/serial).

## With an env variable

To connect any snap enabled device to your brand store, the snapd service needs to know about your store `id` through the `UBUNTU_STORE_ID` environment variable.

There are several ways to expose an environment variable to a service. Here is one of them, that creates the environment variable and makes it persistent between reboots:

1. Get your store `id` from [this page](https://myapps.developer.ubuntu.com/dev/store/list/?next=/dev/store/admin/), your store id being the value between parenthesis (eg. `my-brand-store`).
* Open `/etc/environment` for edition with root privileges

        $ sudo nano /etc/environment

* Add a new line: `UBUNTU_STORE_ID=my-brand-store` and save the file with `Ctrl+X`
* Restart the snapd service:

        $ sudo service snapd restart

Your brand store should now be the default for snapd clients on the system, such as the snap command-line, snapweb, etc.

[//]: <> (TODO: serial assertions)
