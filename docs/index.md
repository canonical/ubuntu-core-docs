---
myst:
  html_meta:
    description: Official Ubuntu Core documentation. Comprehensive guides, references, and explanations for building, deploying, and managing Ubuntu Core images and devices.
---

(ref-index_ubuntu-core-documentation)=
# Ubuntu Core documentation

**Ubuntu Core** is an immutable and transaction-based version of Ubuntu that's engineered for cloud, embedded, and IoT systems. 

It provides an image-based deployment infrastructure with automatic updates for sandboxed applications, enabling the creation of production-ready systems with minimal attack surface and automatic rollback capabilities.

Ubuntu Core reduces the time to production by eliminating manual provisioning, ensuring systems remain secure throughout their lifecycle, and enabling rapid updates across fleets of devices at scale.

It is designed for embedded Linux developers, IoT device manufacturers, cloud-based applications, and organizations deploying embedded systems in robotics, automotive, signage, industrial automation, and IoT applications - from single devices to thousands in the field.

## In this documentation

### First steps

Start by exploring Ubuntu Core with pre-built images and learning the fundamentals. These resources introduce the system, basic concepts, and common operations you'll use every day.

* **Image installation**: {ref}`Try pre-built images <ref-index_try-pre-built-images>`
* **Learn the basics**: {ref}`Using Ubuntu Core <how-to-guides-using-ubuntu-core>`

### Image building

Create tailored Ubuntu Core images for your specific hardware and requirements, then deploy them to your target devices.

* **Getting started**: {ref}`Build your first Ubuntu Core image <ref-index-build-your-first-image>` • {ref}`Image creation guides <ref-index_image-creation>` • {ref}`Use ubuntu-image <how-to-guides-image-creation-use-ubuntu-image>`
* **Customization**: {ref}`Add custom snaps <how-to-guides-image-creation-add-custom-snaps>` • {ref}`Build a gadget snap <how-to-guides-image-creation-build-a-gadget-snap>` • {ref}`Build a kernel snap <how-to-guides-image-creation-build-a-kernel-snap>` • {ref}`Add console conf <ref-add-console-conf_add-console-conf>` • {ref}`Optimise boot speed <how-to-guides-image-creation-optimise-boot-speed>` • {ref}`Add a splash screen <how-to-guides-image-creation-add-a-splash-screen>` • {ref}`Calculate partition sizes <how-to-guides-image-creation-calculate-partition-sizes>`
* **New hardware**: {ref}`Board enablement <how-to-guides-image-creation-board-enablement>`
* **Deploy to hardware**: {ref}`Install on AMD Kria <ref-install-on-amd_install-a-pre-built-ubuntu-core-image-on-an-amd-kria>` • {ref}`Install on MediaTek Genio <ref-install-on-mediatek_install-a-pre-built-ubuntu-core-image-on-a-mediatek-genio-device>` • {ref}`Install on Renesas RZ/G2L <ref-install-on-renesas_install-a-pre-built-ubuntu-core-image-on-a-renesas-rz-g2l>`
* **Snap stores**: {ref}`Store overview <explanation-stores-store-overview>` • {ref}`Brand accounts <explanation-stores-brand-accounts>` • {ref}`Dedicated snap store <ref-dedicated-snap-store_dedicated-snap-store>` • {ref}`Store scoping <explanation-stores-store-scoping>`

### Device management

Manage your running Ubuntu Core systems throughout their lifecycle. Keep systems updated, recover from issues, extend with containers, and optimize performance.

* **System administration**: {ref}`Add a system user <how-to-guides-manage-ubuntu-core-add-a-system-user>` • {ref}`Set system options <how-to-guides-manage-ubuntu-core-set-system-options>` • {ref}`Connect with SSH <how-to-guides-manage-ubuntu-core-use-ubuntu-one-ssh>` • {ref}`Modify kernel options <how-to-guides-manage-ubuntu-core-modify-kernel-options>` • {ref}`Set system time <how-to-guides-manage-ubuntu-core-set-system-time>` • {ref}`Test on QEMU <how-to-guides-manage-ubuntu-core-test-on-qemu>`
* **Recovery and updates**: {ref}`Recovery modes <explanation-recovery-modes>` • {ref}`Use a recovery mode <how-to-guides-manage-ubuntu-core-use-a-recovery-mode>` • {ref}`Update control <explanation-refresh-control>` • {ref}`Remodeling <explanation-remodeling>` • {ref}`Remodel essential snaps <ref-remodel-essential-snaps_remodel-essential-snaps>` • {ref}`Upgrade Ubuntu Core <how-to-guides-manage-ubuntu-core-upgrade-ubuntu-core>` • {ref}`Troubleshooting <how-to-guides-manage-ubuntu-core-troubleshooting>`
* **Container deployment**: {ref}`Container deployment <ref-index_container-deployment>` • {ref}`Docker companion snap <explanation-docker-companion-snap>`
* **Performance**: {ref}`Preseed performance <explanation-preseed-performance>`

### System architecture

Understand the core concepts, design decisions, and technical internals of Ubuntu Core. Learn how the system maintains security, reliability, and enables rapid updates.

* **Core elements**: {ref}`Inside Ubuntu Core <ref-inside-ubuntu-core_inside-ubuntu-core>` • {ref}`Storage layout <explanation-core-elements-storage-layout>` • {ref}`Snaps in Ubuntu Core <ref-snaps-in-ubuntu-core_snaps-in-ubuntu-core>` • {ref}`System snaps <ref-index_system-snaps>`
* **Deployment internals**: {ref}`How installation works <explanation-how-installation-works>` • {ref}`System requirements <reference-system-requirements>`
* **Security**: {ref}`Full disk encryption <explanation-full-disk-encryption>` • {ref}`Full disk encryption with OP-TEE <ref-explanation-full-disk-encryption>` • {ref}`Sandboxing <explanation-security-and-sandboxing>` • {ref}`CVE remediation <explanation-cve-remediation>`
* **Reference**: {ref}`Gadget snap format <reference-gadget-snap-format>` • {ref}`Assertions <ref-index_assertions>` • {ref}`Testing platforms <reference-testing-platforms>` • {ref}`Release notes <ref-release-notes_release-notes>`

## How this documentation is organised

This documentation uses the [Diátaxis documentation structure](https://diataxis.fr/).

* [{ref}`Tutorials <tutorials-index>`](tutorials/index.md) take you step-by-step through building and deploying your first Ubuntu Core image.
* [{ref}`How-to guides <ref-index_how-to-guides>`](how-to-guides/index.md) provide instructions for specific tasks like customizing snaps, deploying to platforms, and managing devices.
* [{ref}`Reference <ref-index_reference>`](reference/index.md) provides technical specifications, formats, and details you need while working.
* [{ref}`Explanation <ref-index_explanation>`](explanation/index.md) provides conceptual context about architecture, security, storage, and update mechanisms.

## Project and community

Ubuntu Core is a member of the Ubuntu family. It's an open source project that welcomes community contributions, suggestions, fixes and constructive feedback.

* {ref}`Community engagement <ref-community-engagement_community-engagement>`
* [Code of Conduct](https://ubuntu.com/community/ethos/code-of-conduct)
* [Support](https://ubuntu.com/support/community-support)
* [Discourse forum](https://forum.snapcraft.io/c/device/10)
* [Matrix chat](https://matrix.to/#/#snapd:ubuntu.com)
* [Roadmap](https://snapcraft.io/docs/snapd-roadmap)

Thinking about using Ubuntu Core for your next project? [Get in touch](https://ubuntu.com/core/contact-us?product=core-overview). 

<!-- Metadata for discourse module -->

```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

Tutorials <tutorials/index>
How-to guides <how-to-guides/index>
Reference <reference/index>
Explanation <explanation/index>
```

```{toctree}
:hidden:
:maxdepth: 2

Contributing <contributing/index.md>
```