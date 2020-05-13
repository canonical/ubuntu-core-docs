---
title: Ubuntu IoT Developer Documentation
---

# Supported platforms

Ubuntu Core runs on a large range of hardware, and pre-built images are available
for specific reference platforms. These images are a great way to quickly get
started with Ubuntu Core on a Raspberry Pi, for example, or to explore Ubuntu
Core's features and evaluate its potential.

Canonical produces official images for the following platforms:

| Platform / model name    | Hardware / CPU | Cores / memory / storage   | Image links |
|--------------------------|--------------|-------------------|-----------|
| Raspberry Pi         <br /> `ubuntu-core-18-pi` | Broadcom BCM2835 <br />ARM Cortex-A72 | 4/1 cores &#124; 1/2/4 GB RAM <br /> no built-in storage | [core-18-pi-arm64][18-pi-arm64] <br /> [core-18-pi-armhf][18-pi-armhf] |
| Raspberry Pi 2       <br /> `ubuntu-core-18-pi2` | Broadcom BCM2836 <br />ARM Cortex-A7 | 4 cores &#124; 1 GB RAM <br /> no built-in storage | <br /> [core-18-pi2-armhf][18-pi2-armhf] |
| Raspberry Pi 3       <br /> `ubuntu-core-18-pi3` | Broadcom BCM2837 <br />ARM Cortex-A53 64-bit | 4 cores &#124; 1 GB RAM <br /> no built-in storage| [core-18-pi3-arm64][18-pi3-arm64] <br /> [core-18-pi3-armhf][18-pi3-armhf]|
| Raspberry Pi CM 3    <br /> `ubuntu-core-18-cm3` | Broadcom BCM2837 <br />ARM Cortex-A53 64-bit | 4 cores &#124; 1 GB RAM <br /> no built-in storage | [core-18-cm3-arm64][18-cm3-arm64] |
| Raspberry Pi 4       <br /> `ubuntu-core-18-pi` | Broadcom BCM2711 <br />Cortex-A72 (ARM v8) 64-bit | 4 cores &#124; 1/2/4 GB RAM  <br /> no built-in storage | [core-18-pi4-arm64][18-pi4-arm64] <br /> [core-18-pi4-armhf][18-pi4-armhf]|
| Qualcomm DragonBoard <br /> `ubuntu-core-18-dragonboard` | Snapdragon 410c <br /> ARM Cortex A53 64-bit | 4 cores &#124; 1 GB RAM <br /> 8 GB eMMC flash storage | [core-18-dragon][18-dragon] |
| Intel NUC            <br /> `ubuntu-core-18-amd64` | Intel Core i3, i5, i7 64-bit | >8 cores &#124; >32 GB RAM <br /> no built-in storage | <br /> [core-18-amd64][18-amd64] |
| Generic x86 / KVM     <br /> `ubuntu-core-18` | Full x86 32/64 bit <br /> CPU virtualisation | as defined | [core-18-amd64][18-amd64] <br /> [core18-i386][18-i386] |

Images are available from
[http://cdimage.ubuntu.com/ubuntu-core/18/stable/current/](http://cdimage.ubuntu.com/ubuntu-core/18/stable/current/)

Ubuntu Core 20 (UC20), built on the foundation of [Ubuntu 20.04 LTS (Focal
Fossa)](https://releases.ubuntu.com/20.04/), is currently under active
development. See [Ubuntu Core 20](releases/uc20.md) for more details.

Ubuntu community members also work with, and produce, images for other
platforms and CPUs. Refer to these individual projects for more information on
what other unofficial images might work for your use cases.

## Installation guides

| Platform   | Requirements | Install guide |
|--------------------------|--------------|-------------------|-----------|
| Raspberry Pi 2, 3, 4 or CM3   | >2GB microSD card, display, USB keyboard, network access | <https://ubuntu.com/download/raspberry-pi-core> |
| Intel NUC | >2GB USB flash storage, USB keyboard, display, network access | <https://ubuntu.com/download/raspberry-pi-core> | 
| Intel® IEI TANK 870 | >2GB USB flash storage, USB keyboard, display, network access | <https://ubuntu.com/download/intel-iei-tank-870> |
| Qualcomm DragonBoard 410c | >2GB microSD card, display, USB keyboard, network access | <https://ubuntu.com/download/qualcomm-dragonboard-410c> |
| KVM | x86 virtualisation with 10GB storage | <https://ubuntu.com/download/kvm> |


<!-- LINKS -->

[18-pi-arm64]:  http://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-arm64+raspi.img.xz 
[18-pi-armhf]:  http://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-armhf+raspi.img.xz 
[18-pi2-armhf]: http://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-armhf+raspi2.img.xz  
[18-pi3-arm64]: http://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-arm64+raspi3.img.xz
[18-pi3-armhf]: http://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-armhf+raspi3.img.xz
[18-cm3-arm64]: http://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-armhf+cm3.img.xz
[18-pi4-arm64]: http://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-arm64+raspi4.img.xz
[18-pi4-armhf]: http://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-armhf+raspi4.img.xz  
[18-dragon]:    http://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-arm64+snapdragon.img.xz
[18-nuc]:       http://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-amd64.img.xz  
[18-amd64]:     http://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-amd64.img.xz
[18-i386]:      http://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-i386.img.xz 
