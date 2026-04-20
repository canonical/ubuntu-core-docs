---
myst:
  html_meta:
    description: Ubuntu Core release notes. Latest features, updates, and release information for Ubuntu Core versions.
---

(ref-release-notes_release-notes)=
# Release notes

This page outlines the release notes of Ubuntu Core, summarising new features, bug fixes and changes in each version.

## Latest stable release

* **{ref}`Ubuntu Core 24 <ref-release-notes_ubuntu-core-24-release-notes>`** (4th June 2024)

## Older releases

* **{ref}`Ubuntu Core 22 <ref-release-notes_ubuntu-core-22-release-notes>`** (15th June 2022)

(ref-release-notes_release-policy-and-schedule)=
## Release policy and schedule

A new version of Ubuntu Core is released every two years, built on the foundations of a Ubuntu LTS release. Each Ubuntu Core release is considered an LTS release. Minor updates are delivered continuously through new versions of snapd, and other {ref}`essential snaps <ref-snaps-in-ubuntu-core_snaps-in-ubuntu-core>` composing the system (gadget, base and kernel snaps).

A {ref}`base <ref-snaps-in-ubuntu-core_types-of-snap>` snap is released with each Ubuntu Core version, named `core<version>`. This base snap is used to build Ubuntu Core images for a particular version, as specified in the {ref}`model assertion <reference-assertions-model>`. The gadget and kernel snap's tracks are aligned with that of the base snap. Supported kernel tracks for a given Ubuntu Core release should follow this pattern: `<version>[-<suffix>]`.

For example, when building an Ubuntu Core 24 image, the model uses the `core24` base snap. A kernel snap, in general from the `stable` risk-level, should be picked from the following options:

```{terminal}
   :input: snap info pc-kernel | grep "^ *24[/|-]" | grep stable
   :user: ubuntu
   :host: machine-amd64

snap info pc-kernel | grep "^ *24[/|-]" | grep stable
  24-rt-hwe-edge/stable:    6.14.0-1010.10~24.04.1      2025-08-14 (2736) 377MB -
  24-rt-hwe/stable:         6.14.0-1010.10~24.04.1      2025-08-14 (2736) 377MB -
  24-rt/stable:             6.8.1-1030.31               2025-08-18 (2760) 360MB -
  24-hwe-edge/stable:       --
  24-hwe/stable:            6.14.0-28.28~24.04.1        2025-08-18 (2674) 372MB -
  24/stable:                6.8.0-64.67                 2025-08-20 (2575) 319MB -
```

Other [risks levels](https://snapcraft.io/docs/channels) are available for testing. However, kernel snaps based on interim (non-LTS) releases are not supported in Ubuntu Core images.

## Update mechanisms in Ubuntu Core

When Ubuntu Core is running, its snap packages update (aka refresh) automatically. To manually control or modify this process, see {ref}`Refresh control <explanation-refresh-control>`. Essential snaps, such as the base and kernel snaps, can be refreshed assuming the updated version is built from the same build-base used in the original model definition. When refreshing the base or kernel snaps, the system will automatically reboot to apply the freshly installed snap. When refreshing the gadget snap, a reboot occurs if the [boot-assets](https://snapcraft.io/docs/gadget-boot-assets) are modified.

To upgrade an Ubuntu Core image from one version to another, see {ref}`Upgrade Ubuntu Core <how-to-guides-manage-ubuntu-core-upgrade-ubuntu-core>`. This process is known as {ref}`remodeling <explanation-remodeling>`.

The snap daemon, snapd, manages snap package updates and Ubuntu Core functionality. For the snapd release plan and a complete list of changes, please refer to the [snapd roadmap](https://snapcraft.io/docs/snapd-roadmap). Feel free to provide your test feedback on the [forum](https://forum.snapcraft.io/c/snapd/5), or directly in [Launchpad](https://bugs.launchpad.net/snapd/+filebug).

To ensure you receive latest security updates and bug fixes, ensure you upgrade to a new release of snapd shortly after it is released.

(ref-release-notes_ubuntu-core-24-release-notes)=
## Ubuntu Core 24 release notes

Released: 4th June 2024.

Ubuntu Core 24 (UC24) is the latest Ubuntu Core release, and is built on the foundations of [Ubuntu 24.04 LTS (Noble Numbat)](https://releases.ubuntu.com/24.04/).

With 12 years of Long Term Support, our strictly-confined OS enables developers to {ref}`build production-grade images <ref-index-build-your-first-image>`  for embedded devices on various architectures.

Ubuntu Core 24 delivers a new factory installation system for IoT device makers, GPU support for AIoT and device management with Landscape in its fifth LTS release. We've also added support for the Raspberry Pi 5.

New features for this release include:
- Improved GPU integration
- Device management with Landscape
- Edge and cloud integration with _Azure IoT Edge_
- New ROS integration for robotics developers
- New documentation and documentation structure

In addition to the above, Ubuntu Core 24 bundles both the latest Linux Kernel  6.8 and *systemd* 2.55 and includes all the latest features of _snapd_, including {ref}`Dynamic kernel boot parameters <how-to-guides-manage-ubuntu-core-modify-kernel-options>`, [Quota group limits for Journal log](https://snapcraft.io/docs/quota-groups#heading--journal) and {ref}`Offline remodeling <ref-remodelling_offline-remodeling>`.

Support for Ubuntu Core has also been added to {ref}`Multipass <tutorials-get-started-try-pre-built-images-install-on-a-vm>`, for single-command deployment.

See {ref}`Get started with Ubuntu Core <tutorials-index>`  to build your own image, or to try a pre-built image of Ubuntu Core 24.

### Improved GPU integration

This release improves hardware compatibility through updated graphics drivers and optimises resource utilisation via a shared userspace environment. For more information, please review the [interface documentation](https://mir-server.io/docs/the-gpu-2404-snap-interface?_ga=2.82007062.1233933483.1719497012-1412176395.1700477775). 

Developers can use the GPU interface to embed graphical applications with graphics acceleration, making it a robust platform to deploy interactive kiosks, digital signage solutions, or any other products that require a graphical output.

Ubuntu Frame, Ubuntu Core display server, also has new features, including support for hybrid GPU systems, multi-display device solutions, screen locking, seamless boot, support for drag and drop, power-saving displays, remote assistance support, runtime display layout modification, and a new user-configurable diagnostic screen. For more information please visit [Ubuntu Frame's documentation](https://mir-server.io/docs). 

Access to Nvidia drivers will be available by Q4 this year due to Nvidia's licensing policy. 

### Device management with Landscape

Ubuntu Core 24 offers a new integration with [Landscape](https://ubuntu.com/landscape), Canonical’s systems management tool, to enable efficient device management, security and updates.

This new integration offers centralized control of OTA updates, auditing, access control, and compliance across devices. Landscape supports both well-connected and air-gapped environments. It comes with features like canary releases, remote device remodeling, and system monitoring to streamline device management tasks.

Landscape is available for Core customers. Users with an Ubuntu Pro subscription can also use Landscape to manage up to 5 machines for free. To learn more visit the [Landscape Client snap package](https://ubuntu.com/landscape/docs/how-to-configure-the-landscape-client-snap) documentation.

### Edge and cloud integration with Azure IoT Edge

The [Azure IoT Edge Agent snaps](https://canonical.com/blog/canonicals-ubuntu-core-receives-microsoft-azure-iot-edge-tier-1-supported-platform-status) deliver seamless integration of Ubuntu Core devices with Microsoft Azure cloud.

These snaps enable organisations to deploy, manage, and monitor OCI edge workloads across fleets of compatible devices directly from Azure.

### New ROS integration for robotics developers

Core 24 delivers production-ready integrations for developers deploying solutions with the Robot Operating System (ROS).

Canonical has made [ROS foundational snaps](https://snapcraft.io/docs/ros2-applications#heading--content-sharing) available for modular deployments. These snaps are maintained by Canonical, and include sets of common ROS packages, such as ros_core, ros_base or desktop, available in several flavours per ROS distribution. With them, developers can design modular ROS snap deployments, enabling configurability and reducing overall memory and OTA update bandwidth.

### New documentation and documentation structure

Our documentation has been restructured to primarily support image building, which is focus for Ubuntu Core. This includes a step-by-step {ref}`Build your first Ubuntu Core image <ref-index-build-your-first-image>` tutorial, new documentation on {ref}`Using ubuntu-image <how-to-guides-image-creation-use-ubuntu-image>`, and including the {ref}`console-conf for device onboarding <ref-add-console-conf_add-console-conf>`, plus an overhauled {ref}`First steps with Ubuntu Core <how-to-guides-using-ubuntu-core>`.

We've also removed a lot of the duplication in the Ubuntu Core documentation and the [snapcraft.io/docs](https://snapcraft.io/docs) documentation, and we now have in-depth guides on {ref}`Creating a recovery system from the REST API <how-to-guides-manage-ubuntu-core-create-a-recovery-system-from-the-api>`, {ref}`calculating partition sizes <how-to-guides-image-creation-calculate-partition-sizes>`,
 
There's also a new section on using Ubuntu Core to host containers, with how-to guides on {ref}`Running Docker containers <how-to-guides-container-deployment-run-a-docker-container>` and on {ref}`building your own Docker-snap <how-to-guides-container-deployment-deploy-docker-from-a-snap>` to deploy containers from an image.

### Further improvements

This release adds many other new features, including:

- {ref}`Dynamic kernel parameter modification <how-to-guides-manage-ubuntu-core-modify-kernel-options>`
- {ref}`Optional console-conf for device onboarding <ref-add-console-conf_add-console-conf>`
- {ref}`Configurable splash screen <how-to-guides-image-creation-add-a-splash-screen>`
- {ref}`Offline device upgrades and remodeling <ref-remodelling_offline-remodeling>`

(ref-release-notes_ubuntu-core-22-release-notes)=
## Ubuntu Core 22 release notes

Released: 15th June 2022.

Ubuntu Core 22 (UC22) is built on the foundations of [Ubuntu 22.04 LTS (Jammy Jellyfish)](https://releases.ubuntu.com/22.04/). It’s the next generation of Ubuntu for embedded devices, and builds on the advances we've made in both Ubuntu Core 20 and Ubuntu Core 18.

New features for this release include:

* [Validation sets](https://snapcraft.io/docs/validation-sets) to permit a set of snap revisions to be installed and updated together
* The ability to migrate devices from Ubuntu Core 20 to Ubuntu Core 22
* A {ref}`factory reset <explanation-recovery-modes>` option to autonomously restore a device to its initial state
* [Quota groups](https://snapcraft.io/docs/quota-groups) to set CPU and memory resource limits per grouped snap services
* [MicroK8s](https://microk8s.io/) support for an easily deployed, streamlined, embedded Kubernetes experience
* Initial [MAAS](https://maas.io/) & cloud-init support

## Older releases

Previous updates to Ubuntu Core have added:

* {ref}`Raspberry Pi support <ref-use-raspberry-pi-imager_use-raspberry-pi-imager>` (both ARMv7 and ARM v8)
* Full-disk encryption via {ref}`TPM integration <explanation-full-disk-encryption>`
   _Currently x86-only with ARM to follow.  TPM integration works with existing CA_
* New {ref}`recovery and reinstall <explanation-recovery-modes>` modes
* A {ref}`recovery mode menu and chooser <explanation-recovery-modes>`

