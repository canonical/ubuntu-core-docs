# Release notes

This page outlines the release notes of Ubuntu Core, summarising new features, bug fixes and changes in each version.

### Latest stable release

* **[Ubuntu Core 24](#ubuntu-core-24-release-notes)** (4th June 2024)

### Older releases

* **[Ubuntu Core 22](#ubuntu-core-20-release-notes)** (15th June 2022)

## Release policy and schedule

A new version of Ubuntu Core is released every two years, and each release is considered an LTS release. Minor updates are delivered continuously through new versions of snapd.

To upgrade an Ubuntu Core image from one version to another, see [Upgrade Ubuntu Core](/how-to-guides/manage-ubuntu-core/upgrade-ubuntu-core.md).

When Ubuntu Core is running, its snap packages update automatically. To manually control or modify this process, see [Refresh control](/explanation/refresh-control).

The snap daemon, snapd, manages snap package updates and Ubuntu Core functionality. For the snapd release plan and a complete list of changes, please refer to the [snapd roadmap](https://snapcraft.io/docs/snapd-roadmap). Feel free to provide your test feedback on the [forum](https://forum.snapcraft.io/c/snapd/5), or directly in [Launchpad](https://bugs.launchpad.net/snapd/+filebug).

To ensure you receive latest security updates and bug fixes, ensure you upgrade to a new release of snapd shortly after it is released.

## Ubuntu Core 24 release notes

Released: 4th June 2024.

Ubuntu Core 24 (UC24) is the latest Ubuntu Core release, and is built on the foundations of [Ubuntu 24.04 LTS (Noble Numbat)](https://releases.ubuntu.com/24.04/).

With 12 years of Long Term Support, our strictly-confined OS enables developers to [build production-grade images](/tutorials/build-your-first-image/index)  for embedded devices on various architectures.

Ubuntu Core 24 delivers a new factory installation system for IoT device makers, GPU support for AIoT and device management with Landscape in its fifth LTS release. We've also added support for the Raspberry Pi 5.

New features for this release include:
- Improved GPU integration
- Device management with Landscape
- Edge and cloud integration with _Azure IoT Edge_
- New ROS integration for robotics developers
- New documentation and documentation structure

In addition to the above, Ubuntu Core 24 bundles both the latest Linux Kernel  6.8 and *systemd* 2.55 and includes all the latest features of _snapd_, including [Dynamic kernel boot parameters](/how-to-guides/manage-ubuntu-core/modify-kernel-options), [Quota group limits for Journal log](https://snapcraft.io/docs/quota-groups#heading--journal) and [Offline remodelling](/explanation/remodelling.md#offline-remodelling).

Support for Ubuntu Core has also been added to [Multipass](/tutorials/try-pre-built-images/install-on-a-vm), for single-command deployment.

See [Get started with Ubuntu Core](/tutorials/index)  to build your own image, or to try a pre-built image of Ubuntu Core 24.

### Improved GPU integration

This release improves hardware compatibility through updated graphics drivers and optimises resource utilisation via a shared userspace environment. For more information, please review the [interface documentation](https://mir-server.io/docs/the-gpu-2404-snap-interface?_ga=2.82007062.1233933483.1719497012-1412176395.1700477775). 

Developers can use the GPU interface to embed graphical applications with graphics acceleration, making it a robust platform to deploy interactive kiosks, digital signage solutions, or any other products that require a graphical output.

Ubuntu Frame, Ubuntu Core display server, also has new features, including support for hybrid GPU systems, multi-display device solutions, screen locking, seamless boot, support for drag and drop, power-saving displays, remote assistance support, runtime display layout modification, and a new user-configurable diagnostic screen. For more information please visit [Ubuntu Frame's documentation](https://mir-server.io/docs). 

Access to Nvidia drivers will be available by Q4 this year due to Nvidia's licensing policy. 

### Device management with Landscape

Ubuntu Core 24 offers a new integration with [Landscape](https://ubuntu.com/landscape), Canonical’s systems management tool, to enable efficient device management, security and updates.

This new integration offers centralised control of OTA updates, auditing, access control, and compliance across devices. Landscape supports both well-connected and air-gapped environments. It comes with features like canary releases, remote device remodelling, and system monitoring to streamline device management tasks.

Landscape is available for Core customers. Users with an Ubuntu Pro subscription can also use Landscape to manage up to 5 machines for free. To learn more visit the [Landscape Client snap package](https://ubuntu.com/landscape/docs/how-to-configure-the-landscape-client-snap) documentation.

### Edge and cloud integration with Azure IoT Edge

The [Azure IoT Edge Agent snaps](https://canonical.com/blog/canonicals-ubuntu-core-receives-microsoft-azure-iot-edge-tier-1-supported-platform-status) deliver seamless integration of Ubuntu Core devices with Microsoft Azure cloud.

These snaps enable organisations to deploy, manage, and monitor OCI edge workloads across fleets of compatible devices directly from Azure.

### New ROS integration for robotics developers

Core 24 delivers production-ready integrations for developers deploying solutions with the Robot Operating System (ROS).

Canonical has made [ROS foundational snaps](https://snapcraft.io/docs/ros2-applications#heading--content-sharing) available for modular deployments. These snaps are maintained by Canonical, and include sets of common ROS packages, such as ros_core, ros_base or desktop, available in several flavours per ROS distribution. With them, developers can design modular ROS snap deployments, enabling configurability and reducing overall memory and OTA update bandwidth.

### New documentation and documentation structure

Our documentation has been restructured to primarily support image building, which is focus for Ubuntu Core. This includes a step-by-step [Build your first Ubuntu Core image](/tutorials/build-your-first-image/index) tutorial, new documentation on [Using ubuntu-image](/how-to-guides/image-creation/use-ubuntu-image), and including the [console-conf for device onboarding](/how-to-guides/image-creation/add-console-conf), plus an overhauled [First steps with Ubuntu Core](/how-to-guides/using-ubuntu-core).

We've also removed a lot of the duplication in the Ubuntu Core documentation and the [snapcraft.io/docs](https://snapcraft.io/docs) documentation, and we now have in-depth guides on [Creating a recovery system from the REST API](/how-to-guides/manage-ubuntu-core/create-a-recovery-system-from-the-api), [calculating partition sizes](/how-to-guides/image-creation/calculate-partition-sizes),
 
There's also a new section on using Ubuntu Core to host containers, with how-to guides on [Running Docker containers](/how-to-guides/container-deployment/run-a-docker-container) and on [building your own Docker-snap](/how-to-guides/container-deployment/deploy-docker-from-a-snap) to deploy containers from an image.

### Further improvements

This release adds many other new features, including:

- [Dynamic kernel parameter modification](/how-to-guides/manage-ubuntu-core/modify-kernel-options)
- [Optional console-conf for device onboarding](/how-to-guides/image-creation/add-console-conf)
- [Configurable splash screen](/how-to-guides/image-creation/add-a-splash-screen)
- [Offline device upgrades and remodelling](/explanation/remodelling.md#offline-remodelling)

## Ubuntu Core 22 release notes

Released: 15th June 2022.

Ubuntu Core 22 (UC22) is built on the foundations of [Ubuntu 22.04 LTS (Jammy Jellyfish)](https://releases.ubuntu.com/22.04/). It’s the next generation of Ubuntu for embedded devices, and builds on the advances we've made in both Ubuntu Core 20 and Ubuntu Core 18.

New features for this release include:

* [Validation sets](https://snapcraft.io/docs/validation-sets) to permit a set of snap revisions to be installed and updated together
* The ability to migrate devices from Ubuntu Core 20 to Ubuntu Core 22
* A [factory reset](/explanation/recovery-modes) option to autonomously restore a device to its initial state
* [Quota groups](https://snapcraft.io/docs/quota-groups) to set CPU and memory resource limits per grouped snap services
* [MicroK8s](https://microk8s.io/) support for an easily deployed, streamlined, embedded Kubernetes experience
* Initial [MAAS](https://maas.io/) & cloud-init support

## Older releases

Previous updates to Ubuntu Core have added:

* [Raspberry Pi support](/tutorials/try-pre-built-images/install-on-a-device/use-raspberry-pi-imager) (both ARMv7 and ARM v8)
* Full-disk encryption via [TPM integration](/explanation/full-disk-encryption)
   _Currently x86-only with ARM to follow.  TPM integration works with existing CA_
* New [recovery and reinstall](/explanation/recovery-modes) modes
* A [recovery mode menu and chooser](/explanation/recovery-modes)

