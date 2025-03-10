# Image creation

Any device running Ubuntu Core is instantiated from an image. This image contains the kernel, an _init_ process, and a few essential tools.

Customising and adding to Ubuntu Core images is a fundamental part of how Ubuntu Core operates, whether that's on an established platform, or by creating an image for a new platform.

## Modify and create images

Create an image from the command line, optimise its boot speed, then change its configuration.

- [Use ubuntu-image](use-ubuntu-image)
- [Optimise boot speed](optimise-boot-speed)
- [Add custom snaps](add-custom-snaps)
- [Add a splash screen](add-a-splash-screen)
- [Add console-conf](add-console-conf)

## Board enablement

Pre-built images are available for testing a range of devices. See [Testing Platforms](/reference/testing-platforms) for further details.

_Board enablement_, however, is the term we use for building an Ubuntu Core image for a new hardware platform, and there's a well established process for accomplishing this.

- [Board enablement](board-enablement)
- [Calculate partition sizes](calculate-partition-sizes)
- [Build a gadget snap](build-a-gadget-snap)
- [Build a kernel snap](build-a-kernel-snap)



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
