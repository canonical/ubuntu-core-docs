# Create a model

At the heart of custom Ubuntu Core image creation is the _model assertion_. An assertion is a signed recipe that describes the components that comprise a complete image. An assertion is provided as JSON in a text file which is signed by a GPG key associated with the publisher's Ubuntu One account.

The model contains:
* identification information, such as the developer-id and model name.
* which [essential snaps](/explanation/core-elements/snaps-in-ubuntu-core) make up the device system.
* other required or optional snaps that implement the device application functionality.

See below for details on how to download and modify a model file to include your own selection of snaps.

## Download a model file

The quickest way to create a new model assertion is to edit a model that already exists. Reference models for every supported Ubuntu Core device can be found in the [snapcore/models](https://github.com/snapcore/models) GitHub repository.

For this project, we're going to modify the 64-bit reference model for the Raspberry Pi: [ubuntu-core-24-pi-arm64.json](https://raw.githubusercontent.com/snapcore/models/master/ubuntu-core-24-pi-arm64.json).

Download and save the file locally with the following _wget_ command. We've called the file `my-model.json`:

```bash
wget -O my-model.json https://raw.githubusercontent.com/snapcore/models/master/ubuntu-core-24-pi-arm64.json
```

## Edit the model file

We now need to edit `my-model.json` using a text editor:

```
nano my-model.json
```

The following fields in `my-model.json` need to be changed:


###  "authority-id" and "brand-id"

```json
"authority-id": "canonical",
"brand-id": "canonical",
```

These properties define the authority responsible for the image. Change both instances of the string "canonical" to your developer id, retrieved with the `snapcraft whoami` command. ("xSfWKGdLoQBoQx88", in our example output). This links the image to your Ubuntu One account and ensures that only *you* can push image updates to devices using your model.

### timestamp


```json
   "timestamp": "2024-04-19T08:42:32+00:00",
```

This needs to be provided at the end of the process; we’ll come back to this.

###  snaps

```json
    "snaps": [
        {
            "name": "pi",
            "type": "gadget",
            "default-channel": "24/stable",
            "id": "YbGa9O3dAXl88YLI6Y1bGG74pwBxZyKg"
        },
       ...
```

This section lists the snaps to be included in the image. **pi** (shown above), **pi-kernel**, **core24** and **snapd** are the four snaps required for a functioning Ubuntu Core device. The additional **console-conf** snap is required for Ubuntu Core 24 devices.

[Console-conf](/how-to-guides/image-creation/add-console-conf) is the interactive setup utility that's used to configure the network and default user when the device is first booted. This is marked as optional, but for this tutorial we need this to be mandatory in our own image. To do this, delete the `"presence": "optional"` line (line 41) and delete the comma at the end of the preceding line.

Additional snaps are included using the same schema, with each snap requiring the following fields:
- `name`: simply the snap name.
- `type`: the [type of snap](/explanation/core-elements/snaps-in-ubuntu-core.md#types-of-snap). This is `app` for standard application snaps.
- `default-channel`: the [channel](https://snapcraft.io/docs/channels) to install the snap from.
- `id`: a unique snap identifier associated with every published snap. This is `snap-id` in the output from `snap info <snap-name>`.

For this tutorial, we're going to add the [AdGuard Home](https://snapcraft.io/adguard-home) snap, an open source network-wide blocker for advertising and tracking. It's an ideal candidate for an Ubuntu Core image like this because it benefits from frequent autonomous updates and a confined environment.

To add the AdGuard Home snap to our image, we need to add the JSON stanza to the _snaps_ section in our _my-model.json_ (note the comma you need to append to the preceding snap entry to show continuation):

```json
        {
            "name": "adguard-home",
            "type": "app",
            "default-channel": "latest/stable",
            "id": "UXZIkJfJT2SPCGejjnSjOBqJ71yHk8bw"
        },
```

Snaps do not have dependencies, but they do require the presence of the [base snap](https://snapcraft.io/docs/base-snaps) they were built on. AdGuard Home is built using a base of `core22` (see the output from `snap info adguard-home --verbose | grep "base:"`). This can be added with the following:

```json
        {
            "name": "core22",
            "type": "base",
            "default-channel": "latest/stable",
            "id": "amcUKQILKXHHTlmSa7NMdnXSx02dNeeT"
        }
```

The `snap-id` for a snap is in the output of the `snap info <snap-name>` command.

### Complete model example

After finishing all your edits, the completed **my-model.json** text file should now contain the following:

```json
{
    "type": "model",
    "series": "16",
    "model": "ubuntu-core-24-pi-arm64",
    "architecture": "arm64",
    "authority-id": "Zg6Qv6Z53HIkziXyxtn1XItIq",
    "brand-id": "Zg6Qv6Z53HIkziXyxtn1XItIq",
   "timestamp": "2024-04-19T08:42:32+00:00",
    "base": "core24",
    "grade": "signed",
    "snaps": [
        {
            "name": "pi",
            "type": "gadget",
            "default-channel": "24/stable",
            "id": "YbGa9O3dAXl88YLI6Y1bGG74pwBxZyKg"
        },
        {
            "name": "pi-kernel",
            "type": "kernel",
            "default-channel": "24/stable",
            "id": "jeIuP6tfFrvAdic8DMWqHmoaoukAPNbJ"
        },
        {
            "name": "core24",
            "type": "base",
            "default-channel": "latest/stable",
            "id": "dwTAh7MZZ01zyriOZErqd1JynQLiOGvM"
        },
        {
            "name": "snapd",
            "type": "snapd",
            "default-channel": "latest/stable",
            "id": "PMrrV4ml8uWuEUDBT8dSGnKUYbevVhc4"
        },
        {
            "name": "console-conf",
            "type": "app",
            "default-channel": "24/stable",
            "id": "ASctKBEHzVt3f1pbZLoekCvcigRjtuqw"
        },
        {
            "name": "adguard-home",
            "type": "app",
            "default-channel": "latest/stable",
            "id": "UXZIkJfJT2SPCGejjnSjOBqJ71yHk8bw"
        },
        {
            "name": "core22",
            "type": "base",
            "default-channel": "latest/stable",
            "id": "amcUKQILKXHHTlmSa7NMdnXSx02dNeeT"
        }
	]
}
```

After the file has been created, the next step is to sign it. See [Sign the model](/tutorials/build-your-first-image/sign-the-model) for further details.
