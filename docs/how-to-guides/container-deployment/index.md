(how-to-guides-container-deployment-index)=
# Container-Deployment

Ubuntu Core has been developed specifically to leverage the power of snap packages, with their autonomous upgrades and confined sandbox.

However, Ubuntu Core can also be used to run and deploy Docker container images, either from the command line or embedded within an Ubuntu Core image.

* [Run a Docker container](/how-to-guides/container-deployment/run-a-docker-container)
Install and run Docker from within the Ubuntu Core environment.

* [Deploy Docker containers from a snap](/how-to-guides/container-deployment/deploy-docker-from-a-snap)
Build a snap which embeds the container images you wish to deploy from a device.

* [Package Docker images in a snap](/how-to-guides/container-deployment/package-docker-images-in-a-snap)
Explains how Docker images can be bundled inside snaps to be deployed together with other resources within the package.


```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

*
*/index
