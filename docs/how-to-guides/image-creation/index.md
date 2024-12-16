(how-to-guides-image-creation-index)=
# Image-Creation

Any device running Ubuntu Core is instantiated from an image. This image contains little more than the kernel, an _init_ process, and a few essential tools. On all but the earliest releases of Ubuntu Core, even the _snapd_ daemon that manages snaps is itself installed via its own snap.

Pre-built images are available for supported platforms, including Raspberry Pi, Intel NUCs and x86/KVM virtualisation, and these can be download and easily installed. See [Supported platforms](/reference/testing-platforms) for the current list and for download links to both the images and the model assertions they use.


```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

*
*/index
