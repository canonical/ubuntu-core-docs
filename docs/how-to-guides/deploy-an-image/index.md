---
myst:
  html_meta:
    description: Learn how to build, deploy, and manage Ubuntu Core images and devices. These how-to guides provide practical instructions for common tasks and workflows in Ubuntu Core, organized by the operational lifecycle.
---

(ref-index_how-to-deploy-an-image)=
# Deploy an image

Learn how to install Ubuntu Core on your target hardware. Whether you're deploying a pre-built image for evaluation or a custom image you've built, these guides cover the deployment process for specific hardware platforms.

Once you've built your Ubuntu Core image using the image creation guides, follow the device-specific instructions below to install it on your hardware.

Alternatively, Canonical produces official pre-built images for quick exploration and testing. These guides also cover installation of pre-built images on the same hardware platforms.

## Install on a specific device

The following guides provide device-specific installation instructions. Each guide covers both pre-built images (for evaluation) and custom images (after building).

- {ref}`Install on a Renesas RZ/G2L <ref-install-on-renesas_install-a-pre-built-ubuntu-core-image-on-a-renesas-rz-g2l>`

  Deploy Ubuntu Core on a [Renesas RZ/G2L](https://www.renesas.com/en/products/microcontrollers-microprocessors/rz-mpus/rzg2l-general-purpose-mpu-dual-core-arm-cortex-a55-cpus-and-single-core-cortex-m33-cpu-3d-graphics-and)
- {ref}`Install on a MediaTek Genio <ref-install-on-mediatek_install-a-pre-built-ubuntu-core-image-on-a-mediatek-genio-device>`

  Deploy Ubuntu Core on a [MediaTek Genio](https://www.mediatek.com/products/iot/genio-iot)

- {ref}`Install on an AMD Kria <ref-install-on-amd_install-a-pre-built-ubuntu-core-image-on-an-amd-kria>`
  
  Deploy Ubuntu Core on an [AMD Kria](https://www.amd.com/en/products/system-on-modules/kria.html)

## Generic image writing

For generic devices not listed above (such as Raspberry Pi or Intel NUC), use these image writing methods to deploy your Ubuntu Core image to storage media.

- {ref}`Use Raspberry Pi imager <ref-use-raspberry-pi-imager_use-raspberry-pi-imager>`

  Write an Ubuntu Core image to a Raspberry Pi
- {ref}`Use the dd command <tutorials-get-started-try-pre-built-images-install-on-a-device-use-the-dd-command>`
  
  Write an Ubuntu Core image to internal storage


```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

Install on a Renesas RZ/G2L <install-on-renesas>
Install on a MediaTek Genio <install-on-mediatek>
Install on an AMD Kria <install-on-amd>
