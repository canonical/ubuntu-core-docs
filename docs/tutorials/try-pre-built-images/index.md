# Try pre-built images

Ubuntu Core runs on a variety of hardware, and pre-built images are available for _amd64_ and _ARM_ platforms (among others). These images can also be installed on a virtual machine.

Pre-built images are ideal for exploration and experimentation, but they are not intended for deployment or use at scale. They include snaps to provide an onboarding and evaluation experience, alongside an SSH connection, and these are unlikely to be required in your own Ubuntu Core deployment. 

Ubuntu Core has instead been designed to facilitate creating, deploying, and managing secure custom images running on your hardware.

See [Supported testing platforms](/reference/testing-platforms) for links to image downloads, ant to learn how to create your own custom image, read our [Build an image](/tutorials/build-your-first-image/index) guide.

## Install on a virtual machine

You can try Ubuntu Core without any specific hardware from within a virtual machine using Multipass on Windows, Mac and Linux.

* [Install on a VM](install-on-a-vm): Try Ubuntu Core on on a local machine

## Install on a generic device

Ubuntu Core runs on a large range of hardware, and pre-built images are available for amd64 and Raspberry Pi reference platforms.

- [Use Raspberry Pi imager](install-on-a-device/use-raspberry-pi-imager): install a pre-built Ubuntu Core image on a Raspberry Pi
- [Use the dd command](install-on-a-device/use-the-dd-command): write an Ubuntu Core reference image to internal storage

## Install on a specific device

- [Install on a Renesas RZ/G2L](install-on-a-device/install-on-renesas): Create an image to run on a Renesas RZ/G2L <install-on-renesas>


```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

Install on a VM <install-on-a-vm>
Install on a device <install-on-a-device/index>
