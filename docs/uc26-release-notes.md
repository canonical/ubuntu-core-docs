(ref-release-notes_ubuntu-core-26-release-notes)=
# Ubuntu Core 26

Released: 7th May 2026

Ubuntu Core 26 (UC26) is the latest Ubuntu Core release, and is built on the foundations of [Ubuntu 26.04 LTS (Resolute Raccoon)](https://canonical.com/blog/canonical-releases-ubuntu-26-04-lts-resolute-raccoon).

With up to 12 years of security maintenance, our minimal, immutable OS enables developers to [build](https://documentation.ubuntu.com/core/tutorials/build-your-first-image/#ref-index-build-your-first-image) and [deploy](https://documentation.ubuntu.com/core/how-to-guides/deploy-an-image/) production-grade images for embedded devices on various architectures at any scale.

Ubuntu Core 26 brings key system improvements for mission-critical operations and low-latency AI workloads, through reduced boot times, 90% smaller OTA updates, and precision-led builds via [Chisel](https://documentation.ubuntu.com/chisel/latest/).

New features for this release include:

* Faster from boot to update
* New era of precision builds with Chisel
* CRA compliance through hardware-rooted security
* Livepatch support for autonomous kernel patching
* Self-service interface connections via new system option

In addition to the above, Ubuntu Core 26 bundles both the latest Linux Kernel 6.8 and *systemd* 2.55 and includes all the latest features of *snapd*, including [Dynamic kernel boot parameters](https://documentation.ubuntu.com/core/how-to-guides/manage-ubuntu-core/modify-kernel-options/#how-to-guides-manage-ubuntu-core-modify-kernel-options), [Quota group limits for Journal log](https://snapcraft.io/docs/quota-groups#heading--journal) and [Offline remodeling](https://documentation.ubuntu.com/core/explanation/remodeling/#ref-remodelling-offline-remodeling).

See [Get started with Ubuntu Core](https://documentation.ubuntu.com/core/tutorials/#tutorials-index) to build your own image, or to try a pre-built image of Ubuntu Core 26\.

### **Improved boot and update time**

For critical infrastructure operators managing large fleets of devices over long lifecycles, the cost of software updates and the time required for device provisioning and image installation quickly compound. Ubuntu Core 26 delivers significant improvements across each of these areas.

Ubuntu Core 26 sets a new efficiency benchmark for over-the-air updates. An improved snap-delta format reduces update sizes between 50% to 90% for most snaps. Updates to the Core base snaps drop from 16MB to just 1.5MB. These gains are paired with boot performance optimizations and initramfs-based installations that bypass redundant reboots by default.

### **Now built with Chisel**

Ubuntu Core 26 introduces a new Chisel-based build system that brings precise composition and transforms how future Core base snaps will be assembled. It relies on Canonical’s release-specific package slice definitions, enforcing explicit, traceable dependencies. As a result, every file in the filesystem can be attributed to its originating slice and source package, improving the accuracy of integrity checks and vulnerability triage. This contrasts with approaches like Yocto builds, where provenance and dependency closure are largely implicit in layered recipes and post-processing. The new build system also contributes to a 7% reduction in base image size.

### CRA compliance through hardware-rooted security

The EU Cyber Resilience Act (CRA) requires products to be secure by default, supported over the long term, and backed by clear accountability across the software stack. As with previous releases, Ubuntu Core aligns naturally with these requirements through its secure design, software traceability, and modular architecture, ensuring well-defined responsibility boundaries across the stack. Canonical assumes Manufacturer responsibilities under the CRA for the operating system’s release cycle by providing security maintenance for Ubuntu Core’s core modules, continuous CVE monitoring and coordinated disclosure, and compliance with IEC 62443-4-1.

### Livepatch support


Devices can now receive critical kernel security updates without requiring a reboot, reducing operational disruption for always-on systems while.

### **API documentation**

Our documentation has been restructured to primarily support image building, which is focus for Ubuntu Core. This includes a step-by-step [Build your first Ubuntu Core image](https://documentation.ubuntu.com/core/tutorials/build-your-first-image/#ref-index-build-your-first-image) tutorial, new documentation on [Using ubuntu-image](https://documentation.ubuntu.com/core/how-to-guides/image-creation/use-ubuntu-image/#how-to-guides-image-creation-use-ubuntu-image), and including the [console-conf for device onboarding](https://documentation.ubuntu.com/core/how-to-guides/image-creation/add-console-conf/#ref-add-console-conf-add-console-conf), plus an overhauled [First steps with Ubuntu Core](https://documentation.ubuntu.com/core/how-to-guides/using-ubuntu-core/#how-to-guides-using-ubuntu-core).

We’ve also removed a lot of the duplication in the Ubuntu Core documentation and the [snapcraft.io/docs](https://snapcraft.io/docs) documentation, and we now have in-depth guides on [Creating a recovery system from the REST API](https://documentation.ubuntu.com/core/how-to-guides/manage-ubuntu-core/create-a-recovery-system-from-the-api/#how-to-guides-manage-ubuntu-core-create-a-recovery-system-from-the-api), [calculating partition sizes](https://documentation.ubuntu.com/core/how-to-guides/image-creation/calculate-partition-sizes/#how-to-guides-image-creation-calculate-partition-sizes),

There’s also a new section on using Ubuntu Core to host containers, with how-to guides on [Running Docker containers](https://documentation.ubuntu.com/core/how-to-guides/container-deployment/run-a-docker-container/#how-to-guides-container-deployment-run-a-docker-container) and on [building your own Docker-snap](https://documentation.ubuntu.com/core/how-to-guides/container-deployment/deploy-docker-from-a-snap/#how-to-guides-container-deployment-deploy-docker-from-a-snap) to deploy containers from an image.

### **Further improvements**

This release adds many other new features, including:

* [Dynamic kernel parameter modification](https://documentation.ubuntu.com/core/how-to-guides/manage-ubuntu-core/modify-kernel-options/#how-to-guides-manage-ubuntu-core-modify-kernel-options)
* [Optional console-conf for device onboarding](https://documentation.ubuntu.com/core/how-to-guides/image-creation/add-console-conf/#ref-add-console-conf-add-console-conf)
* [Configurable splash screen](https://documentation.ubuntu.com/core/how-to-guides/image-creation/add-a-splash-screen/#how-to-guides-image-creation-add-a-splash-screen)
* [Offline device upgrades and remodeling](https://documentation.ubuntu.com/core/explanation/remodeling/#ref-remodelling-offline-remodeling)

2.75: Add your own certificates to an Ubuntu Core system
2.73: feature release \-
interface system option  \- solves a self-served interface
confdb \- improved configuration

With the arrival of Ubuntu Core 26, we’re bringing seamless security to more users: Canonical [Livepatch](https://ubuntu.com/security/livepatch) is now officially supported on all releases from
 Comment start
Ubuntu Core 20
 Comment end
