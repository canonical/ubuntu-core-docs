# Try pre-built images

Ubuntu Core runs on a variety of hardware, and pre-built images are available for various platforms. Generic images can also be installed on a virtual machine.

Pre-built images are ideal for exploration and experimentation, but they are not intended for deployment or use at scale. They include snaps to provide an onboarding and evaluation experience, alongside an SSH connection, and these are unlikely to be required in your own Ubuntu Core deployment. 

Ubuntu Core has instead been designed to facilitate creating, deploying, and managing secure custom images running on your hardware.

See [Supported testing platforms](/reference/testing-platforms) for links to image downloads, and to learn how to create your own custom image, read our {ref}`ref-index-build-your-first-image` guide.

## Install on a virtual machine

You can try Ubuntu Core without any specific hardware from within a virtual machine using Multipass on Windows, Mac and Linux.

* [Install on a VM](install-on-a-vm): Try Ubuntu Core on on a local machine

## Install on a generic device

Ubuntu Core runs on a large range of hardware, and pre-built images are available for amd64 and Raspberry Pi reference platforms.

- [Use Raspberry Pi imager](use-raspberry-pi-imager): install a pre-built Ubuntu Core image on a Raspberry Pi
- [Use the dd command](use-the-dd-command): write an Ubuntu Core reference image to internal storage


```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

Install on a VM <install-on-a-vm>
Use Raspberry Pi Imager <use-raspberry-pi-imager>
Use the dd command <use-the-dd-command>
