# Image creation

Any device running Ubuntu Core is instantiated from an image. This image contains the kernel, an _init_ process, and a few essential tools. Customising and adding to these images is a fundamental part of how Ubuntu Core operates, whether that's on an established platform, or by creating an image for a new platform.

## Modify and create images

Create an image from the command line, optimise its boot speed, then change its configuration.

- [Use ubuntu-image](use-ubuntu-image)
- [Optimise boot speed](optimise-boot-speed)
- [Add custom snaps](add-custom-snaps)
- [Add a splash screen](add-a-splash-screen)
- [Add console-conf](add-console-conf)

## Board enablement

Build a Ubuntu Core image for a new hardware platform.

- [Board enablement](board-enablement)
- [Calculate partition sizes](calculate-partition-sizes)
- [Build a gadget snap](build-a-gadget-snap)
- [Build a kernel snap](build-a-kernel-snap)

Pre-built images are available for supported platforms, including Raspberry Pi, Intel NUCs and x86/KVM virtualisation, and these can be download and easily installed. See [Supported platforms](/reference/testing-platforms) for the current list and for download links to both the images and the model assertions they use.


```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

Use ubuntu-image <use-ubuntu-image>
Add custom snaps <add-custom-snaps>
Add a splash screen <add-a-splash-screen>
Add console-conf <add-console-conf>
Optimise boot speed <optimise-boot-speed>
Calculate partition sizes <calculate-partition-sizes>
Board enablement <board-enablement>
Build a gadget snap <build-a-gadget-snap>
Build a kernel snap <build-a-kernel-snap>
