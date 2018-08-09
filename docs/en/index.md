---
title: Ubuntu IoT Developer Documentation
---

# Getting Started


<!-- 
Version: 1.0
Last released to Markdown: not yet released
-->


## Introduction to Ubuntu IoT Developer documentation
Ubuntu IoT Developer documentation covers the core set of platform and service
technologies that make up Ubuntu’s Internet of Things (IoT) offering. It 
includes a set of Ubuntu operating systems (OSes) geared towards different device 
use cases and associated cloud services. 

Ubuntu Classic includes the traditional Ubuntu Desktop, Ubuntu Server and 
Ubuntu Cloud distributions. These are well-known distributions and have broad
support for various device configurations including user-interactive desktop
systems, enterprise server systems and IoT devices.
Ubuntu Desktop, Server and Cloud are widely deployed across diverse public and
private sectors by millions of people and thousands of organizations. Built
from the common Ubuntu Debian package archives, they are well-known, time-tested
and proven in the field.

Ubuntu Core is the newest Ubuntu OS. It primarily targets
the requirements of headless IoT devices and their distributors. It is a
minimalist rendition of Ubuntu that is lightweight, highly secure, and
transactionally updated. Each application and its data is isolated from every
other application.
An Ubuntu Core system is built using snaps: a core snap, a kernel snap, a gadget
snap, and usually multiple application snaps. Canonical provides
reference snaps and OS images for some current best-of-breed IoT platforms;
you can also roll your own image. Ubuntu Core uses a rolling release model that
aligns with Ubuntu LTS releases. The latest Ubuntu Core is currently UC16 and is
based on the 16.04 long-term support release of Ubuntu Classic. UC18 is currently
under development, and its beta is set to release at the same time as the
18.04 long-term support release of Ubuntu.


### Ubuntu Core highlights

 - Faster, more reliable, and stronger security guarantees for applications and
   users than traditional Linux distributions.
 - Atomic transactional upgrades for applications and the OS itself, which
   can roll back if needed, automating most maintenance and upgrades.
 - Separation of OS and application files into sets of distinct read-only images,
   which supports easily and securely adding multiple applications and additional functionality to a device.
 - Applications are distributed via snaps, a simple packaging system
   that makes it easy for developers to build and distribute applications across
   many Linux distributions from public or private app Stores.
 - Public/private key-based validation and authentication is built-in at every
   stage, proving that what runs is exactly what OS and app developers intend.


### Key Differences between Core and Ubuntu Classic



|                      | Core                                                                                                     | Classic                                                                                                                                                        |
|----------------------|----------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Minimum requirements | 500 MHz single core processor256 MB RAM512 MB storage                                                    | 1 GHz dual core processor512 MB RAM1.5 GB storage                                                                                                              |
| Graphical UI         | None by default (can utilize Wayland or Mir)                                                             | Xorg and GNOME Shell or Wayland and GNOME Shell                                                                                                                |
| Package system       | snaps                                                                                                    | Debs & snaps                                                                                                                                                   |
| Application security | Isolation via AppArmor and Seccomp                                                                       | Traditional user and group permissions (for Debs);Strict isolation via AppArmor and Seccomp for snaps;Transitional security with classic confinement for snaps |
| Updates              | Pushed from the Global (public) Store & optionally a Brand (private) Store;All updates are transactional | Traditional apt repository updates;Also from public Store & optionally Brand Store for snaps;Updates for snaps are transactional                               |


## Snaps

Snap is the native Ubuntu Core packaging system. There is no Debian package support in the runtime of Ubuntu Core. And, Snaps are increasingly used in Ubuntu Classic flavours and other Linux distributions. 

Snaps solve multiple problems at the same time:

 - It’s easy to package applications pulled from multiple upstream sources using diverse build systems.
Each snap includes its own dependencies, freeing publishers from problems when  implicit dependencies change without their knowledge.
 - Developers publish snaps in a Snap Store (the Global Snap Store or a public or private Brand Store) and take responsibility for their quality, making software distribution fast and free of procedural obstacles.
 - Snaps are sandboxed from each other and from the OS, providing system stability and overall security. Powerful slot-and-plug (“interface”) capabilities enable content sharing of all kinds, including data, sockets, D-Bus and much more. 
 - Snaps use simple declarations for system access (for example network or GPIO), and IoT product developers control whether and how this access is granted. 
 - Automatic roll-backs to a previous installed revision occur if a snap upgrade issue arises, with manual reversion as needed.

Snaps are created for device systems that need to have high availability and security and need to be very robust. They are specifically geared towards delivering applications and their updates in a transactional, minimal-downtime manner to devices that don’t have a lot of or any direct human interaction. Snaps also work well on all Ubuntu Classic flavours (Desktop and Server editions) alongside traditional Debian packages and bring a greater level of predictability, security and robustness to all of Ubuntu.

Snaps provide a fast developer iteration cycle, much faster than with traditional Linux packaging systems like Debian or RPM. You can snap up a simple application and can be testing it on a real system in minutes. Snaps pair with the Global Snap Store or a Brand Store that make it easy to deliver your applications to devices.

For more detailed information about snaps including what they are, an architectural overview and how to get started with them, [please see the full snap documentation][please-see-the-full-snap-documentation].

## Stores

Stores are a key part of Ubuntu IoT development as they provide a mechanism to store and deliver versions of applications packaged as snaps to devices. Without a Store, a vendor has to manually distribute their snaps to their users having a difficult time keeping track of who’s received the latest version of their application.

The Global Snap Store is the default Store that every modern Linux distribution with snapd uses. It is public and it is global so that a common repository of software is available to and searchable by as wide an audience as possible. Anyone with a valid Ubuntu SSO account may publish and distribute their snapped application via the Global Snap Store.

The Global Snap Store also supports paid apps, which place some restrictions on who can download an application. All paid applications are searchable in the Store just like non-paid apps. However, paid applications can only be installed after a user has paid for gaining access to this application.

You may follow this [step-by-step guide][step-by-step-guide] that will show you how to distribute snaps to your devices through the Snap Store.

Brand Stores allow distributing snaps to a brand's devices. A Brand Store provides the ability to restrict the scope within which your snaps are visible, which gives you complete control over what devices may search and install your applications.

A Brand Store can be configured such to inherit all snaps from the Global Snap Store and/or inherit snaps from another Brand Store. It is possible to inherit snaps from as many other Stores as desired creating as flexible of a hierarchy as needed to deliver your snaps and control the deployment to the right set of devices.

The following table covers some scenarios when you’d want to use the Global Snap Store versus a private Brand Store.

| Scenario                                                      | Global Snap Store | Private Brand Store |
|---------------------------------------------------------------|-------------------|---------------------|
| Distribute an application to anyone                           |        ✓          |                     |
| Distribute an application to certain clients via a paywall    |        ✓          |                     |
| Distribute an application to a specific set of client devices |                   |          ✓          |
| Canonical-hosted Store solution                               |        ✓          |          ✓          |
| Can be proxied and cached on local premises                   |        ✓          |          ✓          |
| *Self-hosted Store solution                                   |                   |          ✓          |

(* A self-hosted Store solution is an upcoming feature).

There are many other important things to know about the Global Snap Store
and Brand Stores. These are covered in greater detail in later sections of
this documentation.

Follow this [guide][guide] to request a Brand Store or
[get in contact][get-in-contact] with someone from Canonical to learn more
about getting your own Brand Store.

## Platforms

There are several hardware platforms that run Ubuntu Core with snaps. Each has
a pre-built reference image that you are able to get started with right now.
This section describes each and points you to more information on getting started
with these. These reference platforms/Ubuntu Core images are meant to get you
started evaluating and working with Ubuntu Core as quickly and inexpensively as
possible. If a particular reference platform matches your own use cases, you may
take these Canonical-provided images and customize them for your purposes.

The following table shows the reference hardware platforms that run
Ubuntu Core and use snaps:


| Platform Name         | Hardware Description                         |
|-----------------------|----------------------------------------------|
| Raspberry Pi 2        | ARM H2 Quad-core Cortex-A7 64-bit CPU <br> 256/512 MB of RAM <br> No built-in flash storage |
| Raspberry Pi 3         | Broadcom BCM2837 4x ARM Cortex-A53 64-bit CPU<br>1 GB of RAM<br>No built-in flash storage|
| Raspberry Pi Compute Module 3 | Broadcom BCM2837 4x ARM Cortex-A53 64-bit CPU<br>1 GB of RAM<br>No built-in flash storage |
| Orange Pi Zero         | ARM H2 Quad-core Cortex-A7 64-bit CPU<br>256/512 MB of RAM<br>No built-in flash storage |
| Qualcomm Snapdragon 410c | ARM Quad-core Cortex A53 64-bit CPU<br>1 GB of RAM<br>8 GB eMMC on-board flash storage |
| Intel NUC             | Intel Core i3, i5, i7 64-bit CPU<br>Up to 32 GB of RAM<br>No built-in flash storage |
| Samsung Artik 5       | ARM Dual/Quad Core Cortex-A7 64-bit CPU<br>512 MB/1 GB of RAM<br>4 GB eMMC on-board flash storage |
| Samsung Artik 10      | ARM Quad Cortex-A15 + quad Cortex-A7 64-bit CPU<br>2 GB of RAM<br>16 GB eMMC on-board flash storage |
| KVM                   | Full x86 32/64 bit CPI software virtualization platform|

There are official images produced by Canonical for these specific hardware
platforms. Also, Ubuntu community members work with and produce images for
other platforms and CPUs. Refer to these individual projects for more information
on what other unofficial images might work for your use cases.

For more information on getting started developing your own Ubuntu Core image and
configuring a useful developer setup,
[refer to this documentation][refer-to-this-documentation].

## Assertions

Assertions are digitally signed documents that express a fact or policy by a particular signing authority about a particular object in the snap ecosystem. While assertions may seem like a technical detail that most people don’t need to understand, they are a fundamental and widely used concept to snaps and Ubuntu.

Assertions enable transmission of trusted information between the different parts of the snap ecosystem (snapd daemon, snapcraft tool and store). They are used for things like stating who is the publisher of a snap, who is the creator of a device image, and for allowing specific actions if the right assertion is provided (e.g. creating a system user). They enable confirmation that different parts of a snap system can be trusted and are robust when system parts change.

An assertion consists of a set of structured headers, which vary based on the particular type of assertion, an optional body (UTF-8 text, with format depending on type of assertion) and a signature.

Assertions are intended to be readable and understandable. Validation requires the use of provided tooling.

The following table summarizes types of assertions and what they’re used for:

| Assertion Type   | Use Case                                                                                                                  |
|------------------|---------------------------------------------------------------------------------------------------------------------------|
| account          | Ties a name for an account to its identifier and provides the authority's confidence in the name's validity.              |
| account-key      | Holds a public key belonging to an SSO account.                                                                           |
| model            | Lists the properties of a device model. It should contain all needed information to create a working Ubuntu Core image.   |
| serial           | Binds a particular device identity to a device public key.                                                                |
| snap-declaration | Defines some of the properties of a snap such as the snap-id, the official snap name, the publisher, etc.                 |
| snap-build       | Defines the basic properties of a snap at the time it was built by the developer.                                         |
| snap-revision    | Acknowledges receipt of a build of a snap and labels it with a snap revision.                                             |
| system-user      | A permit by the brand for local system users to be created on specific devices.                                           |
| validation       | Shows that a certain revision for a snap that is gated by another snap has been validated for a given Ubuntu Core series. |


More details about assertions will be covered in greater detail in later sections of this documentation.

## Resources

Ubuntu Core is part of the larger IoT ecosystem which includes various things like snapd, other operating systems, Snap Store, Snap Store Proxies, etc. The documentation for these other things are contained elsewhere. This section provides some convenient links to these other technologies and their respective documentation.


### Snap and snapd documentation

Snap and snapd are the technologies behind the snap packaging format.
They provide the command line and behind-the-scenes services that allow
snap packages to be installed on a system and kept up-to-date.
[The documentation for snap and snapd is located on the snapcraft.io site][snapcraft.io-site]. 
There is also a [public forum][public-forum] where you are able to interact with other people involved in the snap community by asking and answering questions.

You can find the [source code to snap and snapd on github][source-code-to-snap-and-snapd-on-github].


### Tutorials

There is also the [Ubuntu Tutorials][ubuntu-tutorials] site that covers tutorials about creating and working with snaps, creating new Ubuntu images (both Ubuntu Classic and Core), advanced snap usage such as snapping up applications using various programming languages, integrating a continuous integration (CI) system into working with snaps, and much more.

## Introduction to snap architecture

Snaps are different from other packaging systems and require a different
way of thinking when working with them. One main concept is to provide a
highly robust system in which applications and daemons are isolated from
each other and any co-interaction is carefully mediated. Tighter security
and a system always being in a known good state are the two most
significant characteristics of a system based on snaps, such as Ubuntu Core.

On an Ubuntu Core system, only snaps are used for installing new software.
Debian packages are not supported and will not work on Ubuntu Core. This
makes Ubuntu Core more robust than using a system like Ubuntu Classic
where both Debian and snap packages coexist. The tradeoff of this is a
decrease in flexibility when working with Ubuntu Core since snap package
confinement requires more attention to detail. Sharing resources or
required external communication between your application and other parts
of the system, requires an interface declaration.

Interfaces are defined as an internal declaration within snapd. Many
existing common interfaces exist with most being reusable by any snap.

As an example of what an interface is used for, in order for a snap to
gain access to the data in a user’s home directory, a snap needs to use
the home interface.

More information on the specifics of how snaps work and how they’re
architected is available in the [snapcraft.io snap documentation][snapcraft.io-snap-documentation].

<!-- LINKS -->
[snapcraft.io-snap-documentation]: https://docs.snapcraft.io/snaps/intro
[ubuntu-tutorials]: https://tutorials.ubuntu.com/?q=snap
[source-code-to-snap-and-snapd-on-github]: https://github.com/snapcore/snapd
[public-forum]: https://forum.snapcraft.io/categories
[snapcraft.io-site]: https://docs.snapcraft.io/
[refer-to-this-documentation]: https://developer.ubuntu.com/core/get-started/developer-setup
[get-in-contact]: https://www.ubuntu.com/core/contact-us
[guide]: https://docs.ubuntu.com/core/en/build-store/create
[step-by-step-guide]: https://snapcraft.io/docs/build-snaps/publish
[please-see-the-full-snap-documentation]: https://docs.snapcraft.io/snaps/

