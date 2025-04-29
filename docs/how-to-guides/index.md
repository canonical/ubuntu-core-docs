# How-to guides

If you have a specific goal, but are already familiar with Ubuntu Core, our _How-to_ guides have more in-depth detail than our tutorials and can be applied to a broader set of applications. They'll help you achieve an end result but may require you to understand and adapt the steps to fit your specific requirements.

## How to use Ubuntu Core

While Ubuntu Core is primarily intended for developers to build custom images tailored for their application and targeted hardware, this page is a great place to start after you’ve just installed pre-built Ubuntu Core images and want to learn a few of the basic principles quickly.

- [Using Ubuntu Core](using-ubuntu-core)

## Image creation

Any device running Ubuntu Core is instantiated from an image. This image contains little more than the kernel, an init process, and a few essential tools. On all but the earliest releases of Ubuntu Core, even the snapd daemon that manages snaps is itself installed via its own snap.

- [Create images](image-creation/index)

## Manage Ubuntu Core

Maintain and manage your Ubuntu Core systems, including recovery modes, system users, configuration options and kernel options.

- [Manage Ubuntu Core](manage-ubuntu-core/index)

## Container deployment

Ubuntu Core has been developed specifically to leverage the power of snap packages, with their autonomous upgrades and confined sandbox. But it can also be used to run and deploy Docker container images, either from the command line or embedded within an Ubuntu Core image.

- [Deploy containers](container-deployment/index)



```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

Using Ubuntu Core <using-ubuntu-core>
Create images <image-creation/index>
Manage Ubuntu Core <manage-ubuntu-core/index>
Deploy containers <container-deployment/index>
