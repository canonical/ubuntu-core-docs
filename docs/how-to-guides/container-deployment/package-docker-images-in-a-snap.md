(how-to-guides-container-deployment-package-docker-images-in-a-snap)=
# Package Docker images in a snap

Docker containers can be deployed on Ubuntu Core from {ref}`the command-line <how-to-guides-container-deployment-run-a-docker-container>`, or via a {ref}`Docker companion snap <explanation-docker-companion-snap>`.

This guide explains how Docker images can be bundled inside snaps to be deployed together with other resources within the package.

Downloading Docker images from an online registry during the installation is a common approach. There are however situations where this isn't desired:
- Air-gapped environment with no internet connection
- Insecure Docker registry or untrusted image publisher 
- Local Docker image including proprietary software
- Docker image built together with the snap

Consequently, bundling the Docker image inside a snap is useful for both existing and locally built images.

Snaps are signed, which means the entire package, including the Docker image, is a verifiable artefact that can be pulled from an online or on-prem store, built into Ubuntu Core images, or passed around as standalone snaps.

Building a snap that contains and uses an existing image involves a few steps. 

## Save the image to a file

This can be done before or during the snap's build. We'll do this before the build, assuming that a Docker Engine is available to the host, rather than adding one to the snap's build environment. 

To save our image to a file, we should first make sure it is loaded into the Docker Engine. 

The image is loaded to the engine when built locally (e.g. `docker build --tag myapp .`) or pulled from a registry (e.g. `docker pull <image>`):

```console
$ docker images
REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
myapp     latest      93c368f790a8   2 minutes ago   125MB
```

Let's save the image as a tar file:
```
$ docker save --output myapp.tar myapp

$ du -h myapp.tar 
123M    myapp.tar
```

Don't worry about the size; this gets significantly smaller when compressed inside the snap. Moreover, upgrades to the snap will only deploy the delta, calculated on the compressed package, rather than the whole blob.

## Add the image to the snap

Make sure that the snap has a `part` that sources the image.

For example, with a part that sources all the project files:
```yaml
parts:
  all-files:
    plugin: dump
    source: .
```
The tar file would be made available inside the snap, on target at `$SNAP/myapp.tar`.

## Load the image before creating the container

Add the following command to load the image to the Docker Engine before creating the container:
```bash
docker load --input $SNAP/myapp.tar
```

This could be in the service's command or the install/refresh hooks.

That's it. You should now be able to build the snap as usual. 
Refer below for a complete example.

## Example: RabbitMQ Docker companion snap

Let's take the snap created in the {ref}`Docker companion snap <how-to-guides-container-deployment-deploy-docker-from-a-snap>` guide.

With that snap, the Docker image was pulled from DockerHub on first startup and after every refresh (upgrade/downgrade). This is because the image wasn't available locally.

What we need to do is to make sure the image is packaged inside the snap and loaded into the Docker Engine before the container creation.

On the host, pull the image to load it into the Docker Engine:
```bash
docker pull rabbitmq:3.13-management
```

Create the `snap/local/image` directory:
```bash
mkdir snap/local/image
```

Save the image inside it:
```bash
docker save --output snap/local/image/rabbitmq.tar rabbitmq:3.13-management
```

The `image` directory gets added to the snap because of the existing `local` part defined in `snapcraft.yaml`.

In `snap/local/bin/run.sh`:
- Add the following `docker load` command right before creating the container:
```bash
if [ ... ]; then
    ...
    
    docker load --input $SNAP/image/rabbitmq.tar

    docker create \
        ...
fi
```
