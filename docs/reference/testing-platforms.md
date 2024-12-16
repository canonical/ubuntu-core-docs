(reference-testing-platforms)=
# Testing platforms

These images are a great way to quickly get started with Ubuntu Core and to explore Ubuntu Core's features and evaluate its potential. Canonical produces official images for the following platforms:

| Platform / model name    | Hardware / CPU | Cores / memory / storage   | Image links |
|--------------------------|--------------|-------------------|-----------|
| **Generic x86**<br /> `ubuntu-core-24` <br /> `ubuntu-core-22` <br /> `ubuntu-core-20` <br /> | Full x86 32/64 bit | as defined | [core-24-amd64][24-amd64] <br />  [core-22-amd64][22-amd64] <br /> [core-20-amd64][20-amd64] <br /> |
| **Raspberry Pi 5**   <br /> `ubuntu-core-24-pi` <br /> | Broadcom BCM2712 <br /> Cortex-A76 (ARM v8) 64-bit | 4 cores &#124; 4/8 GB RAM  <br /> no built-in storage | [core-24-pi-arm64][24-pi-arm64] <br /> |
| **Raspberry Pi 4**   <br /> `ubuntu-core-24-pi` <br /> `ubuntu-core-22-pi`<br />`ubuntu-core-20-pi` <br /> | Broadcom BCM2711 <br /> Cortex-A72 (ARM v8) 64-bit | 4 cores &#124; 1/2/4/8 GB RAM  <br /> no built-in storage |  [core-24-pi-arm64][24-pi-arm64] <br /> [core-22-pi-armhf][22-pi-armhf] <br /> [core-22-pi-arm64][22-pi-arm64] <br /> [core-20-pi-armhf][20-pi-armhf] <br /> [core-20-pi-arm64][20-pi-arm64] <br />  <br /> |
| **Raspberry Pi CM 3**  <br /> `ubuntu-core-22-pi`<br />`ubuntu-core-20-pi`<br /> | Broadcom BCM2837 <br />ARM Cortex-A53 64-bit | 4 cores &#124; 1 GB RAM <br /> no built-in storage | [core-22-pi-armhf][22-pi-armhf] <br /> [core-22-pi-arm64][22-pi-arm64] <br /> [core-20-pi-armhf][20-pi-armhf] <br /> [core-20-pi-arm64][20-pi-arm64] <br />   |
| **Raspberry Pi Zero 2 W and Raspberry Pi 3** <br /> `ubuntu-core-22-pi`<br /> `ubuntu-core-20-pi` <br /> | Broadcom BCM2837 <br />ARM Cortex-A53 64-bit | 4 cores &#124; 0.5/1 GB RAM <br /> no built-in storage| [core-22-pi-armhf][22-pi-armhf] <br /> [core-22-pi-arm64][22-pi-arm64] <br /> [core-20-pi-armhf][20-pi-armhf] <br /> [core-20-pi-arm64][20-pi-arm64] <br />  |
| **Raspberry Pi 2** <br /> `ubuntu-core-22-pi`<br /> `ubuntu-core-20-pi` <br /> | Broadcom BCM2836 <br />ARM Cortex-A7 | 4 cores &#124; 1 GB RAM <br /> no built-in storage |   [core-22-pi-armhf][22-pi-armhf] <br /> [core-20-pi-armhf][20-pi-armhf] |


**Ubuntu Core 24** (UC24) images are available from:
[http://cdimage.ubuntu.com/ubuntu-core/24/stable/current/](http://cdimage.ubuntu.com/ubuntu-core/24/stable/current/)

**Ubuntu Core 22** (UC22) images are available from:
[http://cdimage.ubuntu.com/ubuntu-core/22/stable/current/](http://cdimage.ubuntu.com/ubuntu-core/22/stable/current/)

**Ubuntu Core 20** (UC20) images are available from:
[http://cdimage.ubuntu.com/ubuntu-core/20/stable/current/](http://cdimage.ubuntu.com/ubuntu-core/20/stable/current/)


Ubuntu community members also work with, and produce, images for other platforms and CPUs. Refer to these individual projects for more information on what other unofficial images might work for your use cases.

<!-- LINKS -->

[24-pi-arm64]:  https://cdimage.ubuntu.com/ubuntu-core/24/stable/current/ubuntu-core-24-arm64+raspi.img.xz
[24-amd64]:     https://cdimage.ubuntu.com/ubuntu-core/24/stable/current/ubuntu-core-24-amd64.img.xz
[22-pi-armhf]:  https://cdimage.ubuntu.com/ubuntu-core/22/stable/current/ubuntu-core-22-armhf+raspi.img.xz
[22-amd64]:     https://cdimage.ubuntu.com/ubuntu-core/22/stable/current/ubuntu-core-22-amd64.img.xz
[22-pi-arm64]:  https://cdimage.ubuntu.com/ubuntu-core/22/stable/current/ubuntu-core-22-arm64+raspi.img.xz
[20-pi-armhf]:  https://cdimage.ubuntu.com/ubuntu-core/20/stable/current/ubuntu-core-20-armhf+raspi.img.xz
[20-amd64]:     https://cdimage.ubuntu.com/ubuntu-core/20/stable/current/ubuntu-core-20-amd64.img.xz
[20-pi-arm64]:  https://cdimage.ubuntu.com/ubuntu-core/20/stable/current/ubuntu-core-20-arm64+raspi.img.xz
[18-pi-arm64]:  https://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-arm64+raspi.img.xz 
[18-pi-armhf]:  https://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-armhf+raspi.img.xz 
[18-pi2-armhf]: https://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-armhf+raspi2.img.xz  
[18-pi3-arm64]: https://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-arm64+raspi3.img.xz
[18-pi3-armhf]: https://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-armhf+raspi3.img.xz
[18-cm3-arm64]: https://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-armhf+raspi3.img.xz
[18-pi4-arm64]: https://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-arm64+raspi4.img.xz
[18-pi4-armhf]: https://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-armhf+raspi4.img.xz  
[18-nuc]:       https://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-amd64.img.xz  
[18-amd64]:     https://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-amd64.img.xz
[18-i386]:      https://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-i386.img.xz

