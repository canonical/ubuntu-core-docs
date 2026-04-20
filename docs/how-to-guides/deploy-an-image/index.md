---
myst:
  html_meta:
    description: Learn how to build, deploy, and manage Ubuntu Core images and devices. These how-to guides provide practical instructions for common tasks and workflows in Ubuntu Core, organized by the operational lifecycle.
---

(ref-index_how-to-deploy-an-image)=
# Deploy an image

We create pre-built Ubuntu Core images for several testing platforms. These images are a way to explore Ubuntu Core. Canonical produces official images for the [following platforms](https://ubuntu.com/core/docs/supported-platforms).

## Install on a specific device

We also provide instructions for building and installing an Ubuntu Core image on a specific device.

- {ref}`Install on a Renesas RZ/G2L <ref-install-on-renesas_install-a-pre-built-ubuntu-core-image-on-a-renesas-rz-g2l>`

  Install a pre-built testing image on a [Renesas RZ/G2L](https://www.renesas.com/en/products/microcontrollers-microprocessors/rz-mpus/rzg2l-general-purpose-mpu-dual-core-arm-cortex-a55-cpus-and-single-core-cortex-m33-cpu-3d-graphics-and)
- {ref}`Install on a MediaTek Genio <ref-install-on-mediatek_install-a-pre-built-ubuntu-core-image-on-a-mediatek-genio-device>`

  Install a pre-built testing image on a [MediaTek Genio](https://www.mediatek.com/products/iot/genio-iot)

- {ref}`Install on an AMD Kria <ref-install-on-amd_install-a-pre-built-ubuntu-core-image-on-an-amd-kria>`
  
  Install a pre-built testing image on an [AMD Kria](https://www.amd.com/en/products/system-on-modules/kria.html)

## Image writing

For generic devices, we recommend users try pre-built Ubuntu Core images on a Raspberry Pi or Intel NUC, as these range of devices are easy to use and widely accessible.

- {ref}`Use Raspberry Pi imager <ref-use-raspberry-pi-imager_use-raspberry-pi-imager>`

  Install a pre-built Ubuntu Core image on a Raspberry Pi
- {ref}`Use the dd command <tutorials-get-started-try-pre-built-images-install-on-a-device-use-the-dd-command>`
  
  Write an Ubuntu Core reference image to internal storage


```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

Install on a Renesas RZ/G2L <install-on-renesas>
Install on a MediaTek Genio <install-on-mediatek>
Install on an AMD Kria <install-on-amd>
