---
title: Welcome the Ubuntu Core documentation
---

# Welcome to the Ubuntu Core documentation

## Concepts and terms

### Snaps

A snap is a packaged app. It has a read-only squashFS filesystem containing your app code, a snap.yaml file and metadata. Once installed, it also has selected writable areas for the app. It is self-contained and bundles most of the libraries and runtimes it needs. It can be updated and reverted without affecting the rest of the OS. It is confined from the OS and other snaps through security mechanisms, but can exchange content and functions with them according to fine-grained policies controlled by the user and the OS defaults.

### snapd

snapd is the utility that allows you to manage snaps on a system. You can interact with it through the `snap` command.
