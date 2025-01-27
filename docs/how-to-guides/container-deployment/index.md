# Container deployment

Ubuntu Core has been developed specifically to leverage the power of snap packages, with their autonomous upgrades and confined sandbox.

However, Ubuntu Core can also be used to run and deploy Docker container images, either from the command line or embedded within an Ubuntu Core image.

## Deploying Docker

Install and run Docker from within the Ubuntu Core environment. Build a snap which embeds the container images you wish to deploy from a device.

- [Run a Docker container](/how-to-guides/container-deployment/run-a-docker-container)
- [Deploy Docker containers from a snap](/how-to-guides/container-deployment/deploy-docker-from-a-snap)

## Packaging Docker

How Docker images can be bundled inside snaps to be deployed together with other resources within the package.

Ship containerised applications with Ubuntu Core by building a custom image that can then be used to create bootable media and can automate deployment of a production system.


- [Package Docker images in a snap](/how-to-guides/container-deployment/package-docker-images-in-a-snap)
- [Build an image for Docker deployment](build-an-image-for-docker-deployment)


```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

Run a Docker container <run-a-docker-container>
Deploy Docker from a snap <deploy-docker-from-a-snap>
Package Docker images in a snap <package-docker-images-in-a-snap>
Build an image for Docker deployment <build-an-image-for-docker-deployment>
