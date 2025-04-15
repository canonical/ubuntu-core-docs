# Snaps in Ubuntu Core

Ubuntu Core is built from *snaps*, a secure, confined, dependency-free, cross-platform Linux packaging format.

Snaps are self-contained, which means they possibly include everything needed to run or use components from other snaps in a limited and controlled manner. They're used by Ubuntu Core to both compose the image that's run on a device, and to deliver consistent and reliable software updates, often to low-powered, inaccessible, and remotely administered embedded and IoT systems.

Whether it's an update to a single device, a specific subset of devices, or a deployment of tens of thousands of devices, snaps enable Ubuntu Core to maintain and verify a system’s integrity:

* **Autonomous updates to any device**: the update service needs to be a reliable and automatic process, catering for a predictable update cadence and an optional fine level of control over when and how updates are delivered

* **Incomplete and problematic update recovery**: the inaccessible nature of many embedded device installations makes it imperative that updates are impregnable and capable of withstanding broken, blocked, partial and interrupted updates

* **Critical update provision**: in specific circumstances when an ad-hoc or critical update needs to be made, the update system needs to give these priority and incorporate the update back into the regular update service

* **Unpredictable hardware and network conditions**:  in situations that can’t be easily modelled or predicted, any update system needs to have enough redundancy to handle roll-backs, network-free bootstrapping and autonomous re-provisioning

 Note: For further details on how snaps work and how they're built, see the [Snap documentation](https://snapcraft.io/docs).

## Types of snap

The snap packaging ecosystem consists of the following parts:

* **snap** is both the command line interface and the application package format
* **snapd** is the background service that manages and maintains your snaps
* **snapcraft** is the command and the framework used to build your own snaps
* **[Snap Store](https://snapcraft.io/store)** provides a place to upload your snaps, and for users to browse and install

Developers can publish snaps to the Snap Store or to their own private Brand Store. They take sole responsibility for update cadence and quality. While snaps are commonly known as an application packaging format, Ubuntu Core is built from several different types of snap:

1. **kernel**: contains the Linux kernel for a device
The [kernel snap](https://snapcraft.io/docs/kernel-snap) is selected with the [model assertion](/reference/assertions/model) describing the device which is produced and signed before the image is built. Once the image is built, the kernel snap may be updated but cannot be replaced by a completely different kernel snap.
1. **gadget**: defines device properties
The [gadget snap](/reference/gadget-snap-format) is responsible for defining and manipulating the system properties and configuration which are specific to one or more devices that will usually look similar to one another from an implementation perspective. It is also responsible for shipping the device bootloader and bootloader assets. It is selected with the [model assertion](/reference/assertions/model).
1. **base**: the runtime environment
The [base snap](https://snapcraft.io/docs/base-snaps) provides the run-time environment with a minimal set of libraries that are common to most applications. Base snaps mirror Ubuntu LTS releases and include core20, built from Ubuntu 20.04 LTS, core18 based on Ubuntu 18.04 LTS, and core, based on Ubuntu 16.04 LTS. One of them, selected with the model assertion, also serves as the root file system for the Ubuntu Core system.
For historical reasons the core snap has a different specific type: core.
1. **snapd**: the snap daemon
The core16, core18 and core20 onwards base snaps do not include the snap daemon (core, however, does). Instead, they package the daemon as an upgradeable snap of this type.
> The core16 base snap is supported inline with the wider [Ubuntu release cycle](https://ubuntu.com/about/release-cycle) and cannot run the latest versions of the daemon.
1. **app**: applications, daemons and tools
Packages applications, pulled from multiple upstream sources using diverse build systems. The snapd daemon is itself installed as a snap (except with an old core, where it's included).

As with the core file system, snaps are presented to the system as read-only and are granted access to whatever resources they need through a set of explicit permissions, known as interfaces. Interfaces are implemented using well-tested Linux kernel confinement features.

