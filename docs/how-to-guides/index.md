---
myst:
  html_meta:
    description: Learn how to build, deploy, and manage Ubuntu Core images and devices. These how-to guides provide practical instructions for common tasks and workflows in Ubuntu Core, organized by the operational lifecycle.
---

(ref-index_how-to-guides)=
# How-to guides

These guides provide practical instructions for common tasks and workflows in Ubuntu Core, organized by the operational lifecycle.

## Getting started

Start here if you've just installed Ubuntu Core and want to learn the fundamentals. These guides introduce basic principles and common operations you'll use every day.

- {ref}`Using Ubuntu Core <how-to-guides-using-ubuntu-core>`

  An overview of core concepts, system configuration, and essential workflows for day-to-day use.

## Building and deploying images

Create tailored Ubuntu Core images for your hardware, then deploy them to your target devices. These guides cover custom snaps, kernel modifications, and installation on specific hardware platforms.

- {ref}`Image creation <ref-index_image-creation>`

  Build custom images with selected snaps, kernel configurations, and system customizations.

- {ref}`Deploy an image <ref-index_container-deployment>`

  Installation guides for specific platforms including Renesas RZ/G2L, MediaTek Genio, and AMD Kria devices.

## Operating and extending

Manage your running Ubuntu Core systems throughout their lifecycle, and extend them with containerized workloads. These guides cover recovery modes, system users, updates, remodeling, and Docker container deployment.

- {ref}`Manage Ubuntu Core <ref-index_manage-ubuntu-core>`

  System administration, troubleshooting, recovery modes, and day-to-day operational tasks.

- {ref}`Container deployment <ref-index_container-deployment>`

  Deploy and manage Docker containers alongside or within Ubuntu Core images.



```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

Using Ubuntu Core <using-ubuntu-core>
Create an image <image-creation/index>
Deploy an image <deploy-an-image/index>
Manage Ubuntu Core <manage-ubuntu-core/index>
Work with containers <container-deployment/index>
