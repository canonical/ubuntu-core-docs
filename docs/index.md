(index)=

(ref-index_ubuntu-core-documentation)=
# Ubuntu Core documentation

**Ubuntu Core** is an immutable and transaction-based version of Ubuntu that's engineered for cloud, embedded, and IoT systems. 

It provides an image-based deployment infrastructure with automatic updates for sandboxed applications, enabling the creation of production-ready systems with minimal attack surface and automatic rollback capabilities.

Ubuntu Core reduces the time to production by eliminating manual provisioning, ensuring systems remain secure throughout their lifecycle, and enabling rapid updates across fleets of devices at scale.

It is designed for embedded Linux developers, IoT device manufacturers, cloud-based applications, and organizations deploying embedded systems in robotics, automotive, signage, industrial automation, and IoT applications - from single devices to thousands in the field.

## In this documentation

### Orientation

Build and deploy your first Ubuntu Core image, customized for your hardware and use case.

* **Get started:** {ref}`Build and deploy your first Ubuntu Core image <ref-index-build-your-first-image>` • {ref}`Using Ubuntu Core <how-to-guides-using-ubuntu-core>` 
* **Installation:** {ref}`Install on AMD <ref-install-on-amd_install-a-pre-built-ubuntu-core-image-on-an-amd-kria>` • {ref}`Install on MediaTek <ref-install-on-mediatek_install-a-pre-built-ubuntu-core-image-on-a-mediatek-genio-device>` • {ref}`Install on Renesas <ref-install-on-renesas_install-a-pre-built-ubuntu-core-image-on-a-renesas-rz-g2l>`
* **Custom images:** {ref}`Add custom snaps <how-to-guides-image-creation-add-custom-snaps>` • {ref}`Build a gadget snap <how-to-guides-image-creation-build-a-gadget-snap>` • {ref}`Build a kernel snap <how-to-guides-image-creation-build-a-kernel-snap>` • {ref}`Add console conf <ref-add-console-conf_add-console-conf>`

### Operating and understanding

Manage your devices throughout their lifecycle and learn how Ubuntu Core's architecture, security, and store integration work.

* **Management:** {ref}`Add a system user <how-to-guides-manage-ubuntu-core-add-a-system-user>` • {ref}`Update control <explanation-refresh-control>` • {ref}`Remodeling <explanation-remodeling>` • {ref}`Upgrade Ubuntu Core <how-to-guides-manage-ubuntu-core-upgrade-ubuntu-core>`
* **Architecture:** {ref}`How installation works <explanation-how-installation-works>` • {ref}`Inside Ubuntu Core <ref-inside-ubuntu-core_inside-ubuntu-core>` • {ref}`Storage layout <explanation-core-elements-storage-layout>` • {ref}`Snaps in Ubuntu Core <ref-snaps-in-ubuntu-core_snaps-in-ubuntu-core>`
* **Security:** {ref}`Full disk encryption <explanation-full-disk-encryption>` • {ref}`Sandboxing <explanation-security-and-sandboxing>` • {ref}`CVE remediation <explanation-cve-remediation>`
* **Snap stores:** {ref}`Store overview <explanation-stores-store-overview>` • {ref}`Brand accounts <explanation-stores-brand-accounts>` • {ref}`Store scoping <explanation-stores-store-scoping>`

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
How to contribute <contributing>

