---
title: Ubuntu IoT Developer Documentation
---

# What is Ubuntu Core?


<!-- 
Version: 2.0
-->

Ubuntu Core is Ubuntu for IoT and embedded environments, optimised for security and
reliable updates. It's easy to deploy, tamper-resistant, and hardened against
corruption.

Ubuntu Core is engineered to meet the precise requirements of IoT devices. It
runs an large range of hardware, including Raspberry Pi, Intel NUC, Qualcomm
Snapdragon 410c and even a KVM. Features include:

- **simple, consistent installation and deployment**: Ubuntu Core is install
  via an immutable image, which can be either installed or build specifically
  for your platform and application.
- **a read-only filesystem**: apps run in immutable isolation from each other
  and access to system resources is only granted with explicit permissions
- **transactional updates**: autonomous and impregnable, updates can withstand
  unpredictable hardware and network conditions, even to the operating system
- **snap-based, security first**: snaps are secure, easy to build, and painless
  to distribute. Public/private key validation ensures what's running is
exactly what's intended to run

> A snap is a bundle of an app and its dependencies that's confined from the rest
of the system. They work, without modification, across many different Linux
distributions. 

Designed from the ground-up to solve the complex problems associated with
deploying, running and updating critical software, **Ubuntu Core** makes updates
automatics, reliable, secure and transparent whilst still offering a broad and
carefully selected level of control and customisation over an update’s
deployment.

#### How Ubuntu Core compares to Ubuntu

Both Ubuntu Core and Ubuntu are built from the same foundations, but they
differ in the way those foundations are packaged and deployed.

| **Comparison** | Ubuntu Core | Ubuntu |
|--|--|--|
| Minimum requirements | 500Mhz single-core CPU <br /> 256MB RAM, 512MB storage | 1GHz dual-core CPU <br /> 512MB RAM, 1.5GB storage | 
| Package system       | Snaps, with autonmous updates via either the global store or a private brand store | Debs and snaps, with traditional update mechanics and organisation |
| App security         | Confinement via AppArmor / Seccomp | No system-wide confinement for deb packages |
| Graphical UI         | None by default (can utilize Wayland or Mir)	| Xorg/GNOME Shell or Wayland/GNOME Shell |

