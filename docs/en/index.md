---
title: Ubuntu Core documentation
table_of_contents: true
---

# Ubuntu Core documentation

Welcome to the home of Ubuntu Core documentation.

> Ubuntu Core is Ubuntu, engineered for IoT and embedded systems. It's easy to
deploy, tamper-resistant and hardened against corruption.

Ubuntu Core features:

- **simple, consistent installation and deployment**: Ubuntu Core is installed
  via an immutable image, which can be either installed or built specifically
  for your platform and application
- **a read-only filesystem**: apps run in isolation from each other and access
  to system resources is only granted with explicit permissions
- **transactional updates**: signed, autonomous and atomic, updates can withstand
  unpredictable hardware and network conditions, even to the operating system
- **snap-based, security first**: snaps are secure, easy to build, and painless
  to distribute. Public/private key validation ensures what's running is
exactly what's intended to run

From a single Raspberry Pi, to a deployment of tens of thousands, it's the
ideal platform for anything that needs to run securely, be ever-ready,
autonomously updated, and tamper-proof.

To learn more, take a look at the highlighted documentation below, or dive into
the documentation on the left.

**Discovering Ubuntu Core:**

|  |  |
|--|--|
| [Getting started](guides/intro/get-started.md) | Try out Ubuntu Core, learn how to install it, and use it on your device |
| [What is Ubuntu Core](guides/intro/what-is-core.md)  | Discover Ubuntu Core is different and the advantages it offers |
| [Using Ubuntu Core](using-core.md) | Access your device, install apps, manage services and view the logs |

**Advanced features:**

|  |  |
|--|--|
| [Snaps in Ubuntu Core](coresnaps) | Discover which snaps Ubuntu Core is built upon |
| [Security and sandboxing](guides/intro/security.md) | See how security policies allow developers to quickly update their apps |
| [Core configuration](reference/core-configuration) | Access system-wide options to customise your core environment |

**Building images:**

|  |  |
|--|--|
| [Image building](image/image-building) | Use the `ubuntu-image` command to build images for your hardware |
| [Custom images](image/custom-images) | Build a bespoke image for any supported Ubuntu Core platform |
| [Gadget snap](reference/gadget) | Understand the gadget snap, used to manipulate system properties |


