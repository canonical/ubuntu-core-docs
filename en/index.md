---
title: What is Ubuntu Core?
---

# What is Ubuntu Core?

Ubuntu Core is a minimalist rendition of Ubuntu. It is a lightweight, transactionally updated OS, where every application is installed confined from others. It is designed to run securely on autonomous machines, devices and other internet-connected digital things.

## What Ubuntu Core offers

* Faster, more reliable and stronger security guarantees for apps and users.
* Atomic transactional upgrades for apps and the OS itself, all of which can be rolled back if needed, for simple maintenance and upgrades.
* Separation of OS and application files as a set of distinct read-only images, to easily and securely add multiple apps and functionalities onto a single device.
* Snaps, a new and simple application packaging system to make it easier for developers to build and maintain apps within a application store model.
* Signature authentication to prove that what’s running is exactly what developers have published, for greater end user security.

This documentation will walk you through the steps to install and manage Ubuntu Core on any device as well as creating your own Ubuntu Core images.

### Ubuntu Core terminology

* **Snaps**: apps packaged in the `snap` packaging format
* **`snapd`**: the daemon managing and running snaps
* **`snap`**: the command-line interface to interact with `snapd`
* **YAML**: the text format used to create snaps

#### Developer tools and websites

* [myapps.ubuntu.com](https://myapps.ubuntu.com): the developer portal to manage your snaps in the store
* [snapcraft.io](http://snapcraft.io): the snap format and snap creation reference documentation
* **`snapcraft`**: the command-line tool to guide you through creating snaps, push and release them to users
* **`ubuntu-image`**: the command-line tool to guide you through creating your own Ubuntu Core images
