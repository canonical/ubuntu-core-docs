(how-to-guides-container-deployment-build-an-image-for-docker-deployment)=
# Build an image for Docker deployment

Ubuntu Core runs applications as snaps, and running the Docker Engine as a snap is no exception.

To run Docker containers on a running Ubuntu Core instance, install the Docker snap and {ref}`run your docker commands <how-to-guides-container-deployment-run-a-docker-container>`.

You can even create a {ref}`companion snap <explanation-docker-companion-snap>` that {ref}`runs the container <how-to-guides-container-deployment-deploy-docker-from-a-snap>` and takes care of updates to the {ref}`bundled container image <how-to-guides-container-deployment-package-docker-images-in-a-snap>`.

To ship containerised applications with Ubuntu Core, you need to create a custom image. The custom image can then be used to create bootable media and can automate deployment of a production system.

To create a custom Ubuntu Core image with one or more containerised Docker applications, the applications need to be first packaged as {ref}`Docker companion snaps <explanation-docker-companion-snap>`, listed in the model assertion along with the Docker snap, and given the right permissions to operate.

The image may also include container configurations.

Start by creating a {ref}`model assertion <reference-assertions-model>`. Add the Docker snap and all other companion snaps to the list:

```json
{
    "name": "docker",
    "type": "app",
    "default-channel": "latest/stable",
    "id": "sLCsFAO8PKM5Z0fAKNszUOX0YASjQfeZ"
},
{
    "name": "<my-companion-snap>",
    "type": "app",
    "default-channel": "<channel>",
    "id": "<snap-id>"
}
```

This example only lists one companion snap, available in a snap store. A single companion snap could manage multiple Docker containers.

Each companion snap needs access to the Docker snap to operate. We grant the access via [snap interface](https://snapcraft.io/docs/supported-interfaces) connections between the snaps. In order to automate the granting of access, each companion snap must be published to a store and have an ID. There are two ways to configure this automated interface connection: via an auto-connection assertion defined in a snap store, or via a custom gadget. Here we cover the method via a custom gadget.

Read the [gadget snaps documentation](https://snapcraft.io/docs/the-gadget-snap) to get familiar with the concepts and instructions. Inside the `gadget.yaml` file, adapt and add the following to `connections`, for each companion snap:

```yaml
connections:
    # Needed to communicate with Docker over the Unix socket
    - slot: sLCsFAO8PKM5Z0fAKNszUOX0YASjQfeZ:docker-daemon
      plug: <companion snap id>:docker
    # Needed to use the docker CLI
    - slot: sLCsFAO8PKM5Z0fAKNszUOX0YASjQfeZ:docker-executables
      plug: <companion snap id>:docker-executables
```

Container configuration can be passed on to the companion snap, via [snap configuration options](https://snapcraft.io/docs/adding-snap-configuration). To set such configurations in the Ubuntu Core image, add them to the same `gadget.yaml` file, under `defaults`:

```yaml
defaults:
  <companion snap id>:
    key: value
```

Finally, replace the default gadget snap listed in the model assertion with the custom one that has the connections:

```json
{
    "name": "<custom-gadget>",
    "type": "gadget",
    "default-channel": "<channel>",
    "id": "<gadget snap id>"
}
```

Omit `default-channel` and `id` if you want to {ref}`build the image using a custom gadget snap <how-to-guides-image-creation-add-custom-snaps>` that hasn't been uploaded to a store.

