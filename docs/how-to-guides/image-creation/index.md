---
myst:
  html_meta:
    description: How-to guides on building and customizing Ubuntu Core images for your hardware and requirements. Whether you're making small modifications to existing images or enabling Ubuntu Core on entirely new hardware platforms, you'll find step-by-step instructions here.
---

(ref-index_image-creation)=
# Image creation

These guides show how to build and customize Ubuntu Core images for your hardware and requirements. Whether you're making small modifications to existing images or enabling Ubuntu Core on entirely new hardware platforms, you'll find step-by-step instructions here.

## Quick customization

Start here if you have an existing hardware platform and want to customize the Ubuntu Core image. These guides cover using the `ubuntu-image` tool, adding custom snaps, configuring console-conf, and optimizing boot performance.

- {ref}`Use ubuntu-image <how-to-guides-image-creation-use-ubuntu-image>`

  Build Ubuntu Core images from model assertions using the command-line tool.

- {ref}`Add custom snaps <how-to-guides-image-creation-add-custom-snaps>`

  Include additional applications and services in your image.

- {ref}`Add console-conf <ref-add-console-conf_add-console-conf>`

  Enable interactive onboarding and device configuration.

- {ref}`Optimise boot speed <how-to-guides-image-creation-optimise-boot-speed>` and {ref}`Add a splash screen <how-to-guides-image-creation-add-a-splash-screen>`

  Improve the user experience with faster boot times and custom visuals.

## Board enablement: New hardware platforms

If you're bringing Ubuntu Core to new hardware, these guides walk through the complete process of platform enablement. This includes building custom kernel and gadget snaps, calculating partition layouts, and handling platform-specific configuration.

- {ref}`Board enablement <how-to-guides-image-creation-board-enablement>`

  Overview of the platform enablement process and how to get started.

- {ref}`Build a gadget snap <how-to-guides-image-creation-build-a-gadget-snap>`

  Create the hardware-specific gadget snap defining system properties and layout.

- {ref}`Build a kernel snap <how-to-guides-image-creation-build-a-kernel-snap>`

  Build a custom kernel snap for your target architecture.

- {ref}`Calculate partition sizes <how-to-guides-image-creation-calculate-partition-sizes>`

  Plan and calculate the partition scheme for your hardware.



```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

Use ubuntu-image <use-ubuntu-image>
Optimise boot speed <optimise-boot-speed>
Add custom snaps <add-custom-snaps>
Add a splash screen <add-a-splash-screen>
Add console-conf <add-console-conf>
Board enablement <board-enablement>
Calculate partition sizes <calculate-partition-sizes>
Build a gadget snap <build-a-gadget-snap>
Build a kernel snap <build-a-kernel-snap>
