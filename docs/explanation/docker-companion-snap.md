(explanation-docker-companion-snap)=
# Docker companion snap

A Docker companion snap is a package with instructions and artifacts for deploying a Docker Container.

This snap orchestrates the workflow by communicating with a Docker Engine on the host machine.

Companion snaps are most useful when creating self-contained Ubuntu Core images that boot into a production state without manual intervention.

This is achieved by building a {ref}`custom Ubuntu Core image <ref-index-build-your-first-image>` that includes the companion snap along with the [Docker Engine](https://snapcraft.io/docker).

The Ubuntu Core image can also include the application configurations if they aren't sourced from remote media.

While Docker companion snaps are primarily designed for Ubuntu Core, they can also operate in other snap-enabled environments. The main dependencies for it are _snapd_ and Docker Engine.

A companion snap contains one or more apps, just like any other snap.
The app responsible for the container contains a set of instructions passed over to the Docker Engine via a POSIX or TCP socket.
It is the Docker Engine that manages the container's runtime, not the snap.

The companion snap can bundle the container image and handle the container's data, logging, and configurations.

The snap ecosystem enhances Docker deployments with features like transactional updates, rollback, over-the-air (OTA) management, in both internet-connected and air-gapped environments.

For more information on creating Docker companion snaps, refer to  {ref}`Deploy Docker containers from a snap <how-to-guides-container-deployment-deploy-docker-from-a-snap>`.

