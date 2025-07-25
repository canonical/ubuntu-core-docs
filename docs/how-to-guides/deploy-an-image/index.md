# Deploy an image

We create pre-built Ubuntu Core images for several testing platforms. These images are a way to explore Ubuntu Core. Canonical produces official images for the [following platforms](https://ubuntu.com/core/docs/supported-platforms).

## Install on a specific device

We also provide instructions for building and installing an Ubuntu Core image on a specific device.

- [Install on a Renesas RZ/G2L](install-on-renesas): Install a pre-built testing image on a [Renesas RZ/G2L](https://www.renesas.com/en/products/microcontrollers-microprocessors/rz-mpus/rzg2l-general-purpose-mpu-dual-core-arm-cortex-a55-cpus-and-single-core-cortex-m33-cpu-3d-graphics-and)
- [Install on a MediaTek Genio](install-on-mediatek): Install a pre-built testing image on a [MediaTek Genio](https://www.mediatek.com/products/iot/genio-iot)

## Image writing

For generic devices, we recommend users try pre-built Ubuntu Core images on a Raspberry Pi or Intel NUC, as these range of devices are easy to use and widely accessible.

- [Use Raspberry Pi imager](/tutorials/try-pre-built-images/use-raspberry-pi-imager): install a pre-built Ubuntu Core image on a Raspberry Pi
- [Use the dd command](/tutorials/try-pre-built-images/use-the-dd-command): write an Ubuntu Core reference image to internal storage


```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

Install on a Renesas RZ/G2L <install-on-renesas>
Install on a MediaTek Genio <install-on-mediatek>
