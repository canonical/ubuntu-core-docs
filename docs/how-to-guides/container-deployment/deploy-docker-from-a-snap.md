(how-to-guides-container-deployment-deploy-docker-from-a-snap)=
# Deploy Docker from a snap

As with any other snap-enabled environment, Ubuntu Core can install and deploy _Docker containers_ from the command line, first by installing the [Docker container runtime](https://snapcraft.io/docker) snap, and then running either `docker run` or `docker compose`. This approach is useful for testing, but it's difficult to scale.

Ubuntu Core has been designed to boot into a production state without manual interaction. This is accomplished by building a [custom Ubuntu Core image](/tutorials/build-your-first-image/index) for your specific application and device deployment.

To build such an image to deploy Docker with your own configuration requires the creation a [companion snap](/explanation/docker-companion-snap), the creation of which is described in this _How-to_. Our example will deploy [RabbitMQ](https://www.rabbitmq.com/), an industry-grade message broker implementing protocols such as AMQP and MQTT, but it can easily be adapted to deploy any other Docker application.

Basic familiarity with snaps isn't required but paves the way for a smooth experience. We suggest going though the [tutorial on creating a snap](https://snapcraft.io/docs/create-a-new-snap) or another similar guide.

## Create the snap

Start by initializing a snap project in a clean directory:
```shell
snapcraft init
```

Open the newly created `snap/snapcraft.yaml` file with your favourite editor. Modify and make it technically equivalent to the following. Choose suitable metadata if you plan to publish this snap.

```yaml
name: rabbitmq-docker-guide
base: core22
version: 'demo' 
summary: RabbitMQ Docker companion snap demo
description: This snap manages the RabbitMQ Docker container, via the Docker Engine.

grade: devel
confinement: strict

environment:
  # Add the docker bin to PATH globally.
  # We need this for the app as well as the hooks.
  PATH: $SNAP/docker/bin:$PATH
  # This is the Docker image tag associated with this revision of the snap
  DOCKER_IMAGE_TAG: 3.13-management

plugs:
  # Configure the interface for using Docker executables from the Docker snap.
  # Once connected, several directories will bind mount under the target path.
  # We are interested in the Docker CLI at: $SNAP/docker/bin/docker
  docker-executables:
    interface: content
    content: docker-executables
    target: $SNAP/docker
    default-provider: docker

parts:
  # This part adds our snap-specific files to the package
  local:
    plugin: dump
    source: snap/local

apps:
  rabbitmq:
    command: bin/run.sh
    daemon: simple
    plugs:
      - docker-executables
      - docker
```

The above file is self-described; read the inline comments.
This is the definition of our snap, including the metadata, interfaces to access external resources, build, as well as the runtime logic.

Note that the global manipulation of `PATH` results in deviations from the default built behavior. If you plan to add Debian packages or use plugins, it is best to set it to `$SNAP/docker/bin:$SNAP/usr/sbin:$SNAP/usr/bin:$SNAP/sbin:$SNAP/bin:$PATH` instead. 

Now, we need to add some scripts to implement the container management operations.

Create a script at `snap/local/bin/run.sh` with the following content:

```bash
#!/bin/bash -eu

container_name="$SNAP_INSTANCE_NAME"
image_name="rabbitmq:$DOCKER_IMAGE_TAG"

if [ ! "$(docker ps --all --quiet --filter name="$container_name")" ]; then
    echo "Container does not exist. Creating ..."
    docker create \
        --name "$container_name" \
        --publish 5672:5672 \
        --publish 15672:15672 \
        --log-driver none \
        "$image_name"   
fi

echo "Starting container ..."
docker start --attach "$container_name"

```
Then, make it executable: `chmod +x snap/local/bin/run.sh`.

This script is responsible for (creating and) starting the Docker container.

It is important to disable the log driver (by setting it to `none`) so that we don't store the logs twice. Docker Engine uses the [`json-file`](https://docs.docker.com/config/containers/logging/configure/) driver by default. Snaps write logs to Journal.
With the given configuration, the service's standard output will be written to Journal only.

The snap is almost ready but we need to ensure that we can update the container image too, after the deployment. There are a few ways to do this, but we choose to rely on a publisher-managed delivery via the snap. In other words, we update the snap which in turn updates the docker image and the container instance.

To realize that, we leverage the [post-refresh hook](https://snapcraft.io/docs/supported-snap-hooks#heading--post-refresh) which is a script executed whenever the snap has updated. All this script needs to do is to remove the container, so a new one gets created using the Docker tag specified in the `snapcraft.yaml` file.

Add the following script at `snap/hooks/post-refresh`:

```bash
#!/bin/bash -eu

container_name="$SNAP_INSTANCE_NAME"

# Remove the container so it gets recreated upon snap's service startup
# This results in creating the container based on the updated configuration
# such as image name/tag, volumes, and ports.
docker rm "$container_name"

```
Then, make the script executable: `chmod +x snap/hooks/post-refresh`

Here, we could add additional logic such as removing the old image, or preparing the application for this upgrade.

For completeness, let's also create a [remove hook](https://snapcraft.io/docs/supported-snap-hooks#heading--remove), to remove the container when the snap is uninstalled. This prevents container name conflicts if the snap is re-installed.

Create the following script at `snap/hooks/remove`:
```bash
#!/bin/bash -eu

container_name="$SNAP_INSTANCE_NAME"

docker rm -f "$container_name"
```
Make it executable: `chmod +x snap/hooks/remove`

This is also a good place to remove obsolete images to save disk space, but we leave that out of this documentation.


Finally, verify the location of created files:
```bash
$ tree
.
└── snap
    ├── hooks
    │   ├── post-refresh
    │   └── remove
    ├── local
    │   └── bin
    │       └── run.sh
    └── snapcraft.yaml

5 directories, 4 files
```

At this point, we are ready to build the snap:

```console
snapcraft -v
```
This will create: `rabbitmq-docker-guide_demo_amd64.snap`

You could use [`--destructive-mode`](https://snapcraft.io/docs/build-options#heading--snapcraft) flag to build it natively, instead of using LXD.
This speeds up the build and is safe because building this snap makes no changes on the host and doesn't link against any of the host shared libraries (e.g. by using build/stage packages).

## Install the snap

```shell
sudo snap install --dangerous ./rabbitmq-docker-guide_demo_amd64.snap
```
The [`--dangerous`](https://snapcraft.io/docs/install-modes#heading--dangerous) flag is set because this is a locally built, unsigned snap.

Connect the following [interfacess](https://snapcraft.io/docs/interfaces):
```shell
# For access to Docker Daemon
sudo snap connect rabbitmq-docker-guide:docker docker:docker-daemon
# For access to Docker CLI
sudo snap connect rabbitmq-docker-guide:docker-executables docker:docker-executables
```

Start the [service](https://snapcraft.io/docs/service-management):
```shell
sudo snap start rabbitmq-docker-guide
```

Verify that everything is working and setup correctly by looking into the following:
- Snap logs: `snap logs -n 100 rabbitmq-docker-guide`
- Docker containers: `docker ps`

You should be able to access the RabbitMQ's management dashboard via a web browser.
By default, it is available at http://localhost:15672 (username/password: `guest`).

![RabbitMQ Management Dashboard|800x397](https://assets.ubuntu.com/v1/616d2ae4-deploy-docker-from-a-snap.png)


## Persist the application data

By looking into the logs we can identify that the container uses the following path to write its data:
```
home dir       : /var/lib/rabbitmq
data dir       : /var/lib/rabbitmq/mnesia/rabbit@b3c91694093c
```

First we need to set a hostname for the container so that the data directory name doesn't change with the container. Docker generate a random hostname by default. Set the hostname to `demo` by setting `--hostname demo` argument for the `docker create` command inside `run.sh`. You may need to revisit this if you plan to run a RabbitMQ cluster.

The Docker image specifies a volume at `/var/lib/rabbitmq` and the Docker engine maintains it internally. However, the volume will be lost if the container is removed, for example during an upgrade.
We will mount `SNAP_DATA/data` as a volume inside the container, so that the container data gets persisted as snap's own data and copied from one version of the snap to the next. Read more about snap's [data locations](https://snapcraft.io/docs/data-locations) and [snapshots](https://snapcraft.io/docs/snapshots).

This can be achieved by adding the following argument to the `docker create` command inside the `run.sh` script: `--volume $SNAP_DATA/data:/var/lib/rabbitmq`.

Now, rebuild the snap and re-install it, then verify the location of container data:
```console
$ tree -L 2 /var/snap/rabbitmq-docker-guide/current/data/
/var/snap/rabbitmq-docker-guide/current/data/
└── mnesia
    ├── rabbit@demo
    ├── rabbit@demo-feature_flags
    ├── rabbit@demo.pid
    └── rabbit@demo-plugins-expand

4 directories, 2 files
```

## Change configuration via environment variables

There are many ways to pass configuration to a Docker container on Ubuntu Core. This also heavily depends on the application inside the container.

A nice way to enable configuration of snaps is via [snap configuration option](https://snapcraft.io/docs/configuration-in-snaps). To make use of this configuration mechanism, we need to implement a script which reads the snap configuration options and then writes equivalent environment variables into a file. We leverage the snap's [configure hook](https://snapcraft.io/docs/supported-snap-hooks#heading--the-configure-hook) for this purpose so that we perform the mapping every time the user sets snap configurations.

To write environment variables into a file whenever the user sets a snap configuration option, create a script at `snap/hooks/configure` with the following content:
```bash
#!/bin/bash -eu

env_file="$SNAP_COMMON/conf.env"

# Clear the file
> "$env_file"

default_user="$(snapctl get default-user)"
if [[ -n "$default_user" ]] ; then
    echo "RABBITMQ_DEFAULT_USER=$default_user" >> "$env_file"
fi

default_pass="$(snapctl get default-pass)"
if [[ -n "$default_pass" ]] ; then
    echo "RABBITMQ_DEFAULT_PASS=$default_pass" >> "$env_file"
fi

```
Make the script executable: `chmod +x snap/hooks/configure`

The above script adds a mapping for overriding the default username and password. You can extend it by adding other mappings.

Now, modify the `run.sh` script and add the following argument to the `docker create` command to pass the environment file: `--env-file $SNAP_COMMON/conf.env`


The script should now look like:
```bash
#!/bin/bash -eu

container_name="$SNAP_INSTANCE_NAME"
image_name="rabbitmq:$DOCKER_IMAGE_TAG"

if [ ! "$(docker ps --all --quiet --filter name="$container_name")" ]; then
    echo "Container does not exist. Creating ..."
    docker create \
        --name "$container_name" \
        --publish 5672:5672 \
        --publish 15672:15672 \
        --log-driver none \
        --hostname demo \
        --volume "$SNAP_DATA/data:/var/lib/rabbitmq" \
        --env-file "$SNAP_COMMON/conf.env" \
        "$image_name"    
fi


echo "Starting container ..."
docker start --attach "$container_name"

```

Note that the configurations are passed during the container creation. So for them to be effective, they need to be set before starting the service for the first time.

To test: 
1. Rebuild the snap
2. Remove and re-install it
3. Connect the interfaces
4. Set the configuration with `sudo snap set rabbitmq-docker-guide default-user=admin default-pass=<secret>`
5. Start the service

Then open the web GUI and login with the new credentials: `admin`/`<secret>`.

To debug possible issues:
- Look at the container logs
- Check the environment file at `/var/snap/rabbitmq-docker-guide/common/conf.env`

It is possible to tweak this method and support changing of configurations without having to re-create the container via re-install the snap. That is however beyond the scope of this guide. Alternatively, you may consider supplying a configuration file via a mounted volume.

## Supply a configuration file

We could provide an additional configuration file to the container via the snap. This is useful for static configurations that can be shipped to every deployment. Alternatively, we could supply the configuration file from another path on host, a [removable media](https://snapcraft.io/docs/removable-media-interface), or a configuration provider snap (a snap providing configuration via a [content interface](https://snapcraft.io/docs/content-interface)).

To provide a configuration file from the snap to the Docker container, we need to add the file to the snap and a mount during runtime as a volume inside the container.

For example:
1. Add the file under `snap/local/conf/rabbitmq.conf`
2. Set the following argument for the `docker create` command inside `run.sh`: `--volume $SNAP/conf/rabbitmq.conf:/etc/rabbitmq/conf.d/rabbitmq.conf:ro`
3. Rebuild the snap
4. Re-install the snap

This will make the file deployed at `/snap/rabbitmq-docker-guide/current/conf/rabbitmq.conf` available inside the container.

To verify this setup:
- Look at the container logs
- Check the deployed read-only configuration file at `/snap/rabbitmq-docker-guide/conf/rabbitmq.conf`
- Check the mounted file inside the container with `docker exec rabbitmq-docker-guide cat /etc/rabbitmq/conf.d/rabbitmq.conf`

## Allow container creation configuration

In the earlier steps we hard coded some of the container configurations, passed to the `docker create` command in the `run.sh` script.
For example, we exposed the service ports with the same number on the host:
```bash
if [ ! "$(docker ps --all --quiet --filter name="$container_name")" ]; then
    ...
    docker create \
        ...
        --publish 5672:5672 \
        --publish 15672:15672 \
        ...
...
```

This would work if those ports are available on the host. However, it is generally risky to make strong deployment-specific assumptions at packaging time.

We can make the port mapping configurable using snap configuration options. For example, to make RabbitMQ's AMQP listener port configurable, but falling back to the default:
```bash
# Read the value set via snap config option
amqp_port="$(snapctl get amqp-port)"

# If not set, use default
if [[ -z "$amqp_port" ]] ; then
    amqp_port="5672"
    echo "AMQP port not set, using $amqp_port"
fi

if [ ! "$(docker ps --all --quiet --filter name="$container_name")" ]; then
    ...
    docker create \
        ...
        --publish "$amqp_port":5672 \
        --publish 15672:15672 \
        ...
...
```

To verify that this works:
1. Re-build the snap
2. Re-install it
3. Set the AMQP port: `sudo snap set rabbitmq-docker-guide amqp-port=8072`
4. Start the service
5. Execute `docker ps` and look for `0.0.0.0:8072->5672/tcp`


For setting defaults, a more maintainable approach would be to set them in the [install hook](https://snapcraft.io/docs/supported-snap-hooks#heading--install).
As an example, create an executable script at `snap/hooks/install` with the following content:
```bash
#!/bin/bash -eu

snapctl set amqp-port=5672

```
This way, the user can also query and see the default via `snap get <snap>`, offering better visibility.
Keep in mind that the install hook is called only when installing the snap from scratch, not when re-installing or refreshing.

## Version the snap

In the `snapcraft.yaml` file, we set the version of the snap to `demo`. That isn't really helpful because it makes it hard to know which version of the Docker image is installed with this snap. 

It's better to set the version to something that reflects the snap's content. Using the RabbitMQ Docker image tag is a good option.

The version can be set manually on every upgrade, together with the existing environment variable for the tag:
```yaml
...
version: '3.13-management'
...
environment:
  ...
  DOCKER_IMAGE_TAG: '3.13-management'
```

We can eliminate version repetition by using a YAML anchor and alias. Let's define an anchor called `TAG` the first time we set the version and then use it as alias further below:
```yaml
...
version: &TAG '3.13-management'
...
environment:
  ...
  DOCKER_IMAGE_TAG: *TAG
```

Build the snap:
```console
snapcraft -v
```
This will create: `rabbitmq_3.13-management_amd64.snap`, using the Docker image tag as the snap's version!

## Next steps
In this guide, we created a RabbitMQ companion snap that made it possible to deploy, configure, and maintain the RabbitMQ Docker image on Ubuntu Core. 

The companion snap can be extended to take care of many other requirements including:
- Shipping the Docker image inside the snap for better reproducibility and deployment in air-gapped environments; see [Package Docker images in a snap](package-docker-images-in-a-snap).
- Pruning dangling images to save disk space after upgrades
- Using Docker compose; although this isn't recommended because it will encapsulate several containers into a single service

Apart from installing the snap, we performed a few manual operations on target such as for interface connections and setting snap configuration options. This went against our initial goal of deploying the application without manual interaction. Ubuntu Core leverages other tools and services to automate such operations. These include Ubuntu Core [image creation](/tutorials/build-your-first-image/index) with custom snaps, [gadget snaps](https://snapcraft.io/docs/the-gadget-snap) for adding default configurations and connections into the image, and [dedicated snap stores](/explanation/stores/dedicated-snap-stores) with deployment-specific interface auto-connection assertions.

The created snap and its future revisions can be published to a snap store to allow remote deployment and OTA updates of the Docker container.

