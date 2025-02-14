(how-to-guides-container-deployment-run-a-docker-container)=
# Run a Docker container

Ubuntu Core is made up entirely of snap packages. To run Docker containers, you need to have the Docker Engine installed as a snap. 

> This page assumes that you have installed Ubuntu Core via a [pre-built image](/tutorials/try-pre-built-images/index) and would like to install the Docker Engine and run containers from the command line. 

## Install Docker Engine
After logging into the Ubuntu Core device, install the Docker Engine snap by running:
```shell
sudo snap install docker
```

## Set up permissions

The installation should automatically connect the [`home` interface](https://snapcraft.io/docs/home-interface) to grant the Docker snap access to the non-hidden files in the user's home directory. 

The list of interface connections can be verified by running `snap connections docker`.

If the home interface hasn't been auto-connected (such as on Ubuntu Core 16), connect it manually by running:
```shell
sudo snap connect docker:home
```

>  :information_source: The `docker` command only has access to your home directory. All files such as `Dockerfile`, `docker-compose.yaml` or `.env` should be inside home.

## Add credentials for registry

If you use certificates to access a private registry, add these certificates into:
```
/var/snap/docker/current/etc/docker/certs.d/
```

## Run the container

Now you can run a container like you would normally do it with Docker:
```
$ sudo docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
478afc919002: Pull complete 
Digest: sha256:a26bff933ddc26d5cdf7faa98b4ae1e3ec20c4985e6f87ac0973052224d24302
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (arm64v8)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/

```

> :information_source:  You have to run all docker commands with `sudo` because it is not possible to add a user to the docker group on Ubuntu Core.

If you prefer using Docker Compose, that is also available:
```
sudo docker compose
```

---

Another way to run Docker containers on Ubuntu Core is via companion snaps. This means each container will be managed by its own snap package, containing its configuration. Such a package has a safer upgrade path, with rollback of config and data if something went wrong. To learn how to create such a companion snap, refer [here](/how-to-guides/container-deployment/deploy-docker-from-a-snap).

