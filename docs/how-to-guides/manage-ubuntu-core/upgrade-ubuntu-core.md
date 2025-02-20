(how-to-guides-manage-ubuntu-core-upgrade-ubuntu-core)=
# Upgrade Ubuntu Core

A device can be upgraded to a later Ubuntu Core release if it has:

- **an assigned serial number**: from either a serial assertion or the Snap Store.
- **identical storage layout**: layouts are identical unless they've been manually reconfigured.
- **consistent base and system snaps**: significant differences will cause an upgrade to fail.

It is not currently possible to upgrade from releases earlier than UC20, or from either a UC20 reference image or a reference [model assertion](/reference/assertions/model), including those available on [https://cdimage.ubuntu.com/ubuntu-core/20](https://cdimage.ubuntu.com/ubuntu-core/20). However, reference model assertions can be easily modified to build a [custom image](/tutorials/build-your-first-image/index) that can be upgraded. 

Upgrades are performed by [remodelling](/explanation/remodelling), which is the process of replacing one model assertion with another on a deployed system. For an upgrade from UC20 to UC22, for example, this means updating the base and system snaps in a UC20 model assertion with their UC22 counterparts.

## Prerequisites

On the device, run `snap model` to make sure the device has been assigned a serial:

```bash
$ snap model
brand   <brand-id>
model   ubuntu-core-20-amd64
grade   signed
serial  810d53c7-a741-9351-0a7e2b96095b
```

The contents of `/etc/os-release` show which version of Ubuntu Core is running:

```bash
$ cat /etc/os-release
NAME="Ubuntu Core"
VERSION="20"
ID=ubuntu-core
PRETTY_NAME="Ubuntu Core 20"
VERSION_ID="20"
HOME_URL="https://snapcraft.io/"
BUG_REPORT_URL="https://bugs.launchpad.net/snappy/"
```

## Model assertions

The model assertion defines which [system snaps](/explanation/core-elements/inside-ubuntu-core.md#ubuntu-core-snaps) make up the device's operating system, including the gadget snap, kernel snap and the base snap with the (read-only) root filesystem.

On an Ubuntu Core 20 system, _kernel_ and _gadget_ snaps are installed from a `20` [track](https://snapcraft.io/docs/channels#heading--tracks), with the [base snap](https://snapcraft.io/docs/base-snaps) being `core20`. The _snapd_ snap remains unchanged, as it's always at the latest version available.

The following is a complete unsigned reference model for an amd64 Ubuntu Core 20 image:

```json
{
    "type": "model",
    "series": "16",
    "authority-id": "<your-brand-id>",
    "brand-id": "<your-brand-id>",
    "model": "ubuntu-core-20-amd64",
    "architecture": "amd64",
    "serial-authority": ["generic"],
    "timestamp": "2021-10-05T09:50:53+00:00",
    "base": "core20",
    "grade": "signed",
    "snaps": [
       {
            "name": "pc",
            "type": "gadget",
            "default-channel": "20/stable",
            "id": "UqFziVZDHLSyO3TqSWgNBoAdHbLI4dAH"
        },
        {
            "name": "pc-kernel",
            "type": "kernel",
            "default-channel": "20/stable",
            "id": "pYVQrBcKmBa0mZ4CCN7ExT6jH8rY1hza"
        },
        {
            "name": "core20",
            "type": "base",
            "default-channel": "latest/stable",
            "id": "DLqre5XGLbDqg9jPtiAhRRjDuPVa5X1q"
        },
        {
            "name": "snapd",
            "type": "snapd",
            "default-channel": "latest/stable",
            "id": "PMrrV4ml8uWuEUDBT8dSGnKUYbevVhc4"
        }
    ]
}
```

The above example includes the necessary `serial-authority` definition to ensure the device is given a serial number. In this case, `["generic"]` will ask for a serial to be generated and assigned by the Snap Store.

To create a model assertion that can be used to upgrade a device running on an image generated with the above example, replace the `20` tracks with `22` and `core20` with `core22` for the base snap:

```json
{
    "type": "model",
    "series": "16",
    "authority-id": "<your-brand-id>",
    "brand-id": "<your-brand-id>",
    "model": "ubuntu-core-22-amd64",
    "architecture": "amd64",
    "revision": "1",
    "serial-authority": ["generic"],
    "timestamp": "2021-10-05T09:50:53+00:00",
    "base": "core22",
    "grade": "signed",
       "snaps": [
        {
            "name": "pc",
            "type": "gadget",
            "default-channel": "22/stable",
            "id": "UqFziVZDHLSyO3TqSWgNBoAdHbLI4dAH"
        },
        {
            "name": "pc-kernel",
            "type": "kernel",
            "default-channel": "22/stable",
            "id": "pYVQrBcKmBa0mZ4CCN7ExT6jH8rY1hza"
        },
        {
            "name": "core22",
            "type": "base",
            "default-channel": "latest/stable",
            "id": "amcUKQILKXHHTlmSa7NMdnXSx02dNeeT"
        },
        {
            "name": "snapd",
            "type": "snapd",
            "default-channel": "latest/stable",
            "id": "PMrrV4ml8uWuEUDBT8dSGnKUYbevVhc4"
        }
    ]
}
```

The above example has an updated model name, ubuntu-core-22-amd64, but this arbitrary and can remain the same or be something entirely different.

Note that with the exception of the base snap, the snap _id_ for each snap also remain the same, as does the brand-id of the Snap Store account responsible for creating the original image.

Another important requirement for the updated model is the inclusion of a `revision` field.

The presence of a revision value permits an assertion to be updated to an updated assertion with a higher revision value. If no revision is specified, as in our previous UC20 example, a revision value of `0` is implied. Consequently, our UC22 example above has a revision value of `1`. See [Assertions](/reference/assertions/index) for further details.

The updated model will need to be signed with the same key that the original model was signed with. See [Signing a model assertion](/tutorials/build-your-first-image/sign-the-model) for detailed instructions.

Reference unsigned model assertions for both UC20 and UC22 can be found here: [https://github.com/snapcore/models](https://github.com/snapcore/models).

## Perform the upgrade

To manually upgrade a device running the original UC20 model assertion, first copy the signed and updated UC22 model assertion to the device. This can be accomplished in many ways, but _scp_ OpenSSH secure file copy is a good option:

```
scp <uc22-model.model-assertion> <sso-account-name>@<device-ip>:/home/<sso-account-name>
```

The final step is to run `sudo snap remodel <uc22-model.model-assertion>` on the device itself:

```bash
$ ssh <sso-account-name>@<device-ip>
<ubuntu-core> $ sudo snap remodel my-uc22-model.model-assertion
Download snap "pc-kernel" (991) from channel "22/beta"
[...]
```

The process will take some time and will involve several device restarts before eventually completing. You can then reconnect and check it's been upgraded to UC22:

```bash
$ cat /etc/os-release
NAME="Ubuntu Core"
VERSION="22"
ID=ubuntu-core
PRETTY_NAME="Ubuntu Core 22"
VERSION_ID="22"
HOME_URL="https://snapcraft.io/"
BUG_REPORT_URL="https://bugs.launchpad.net/snappy/"
```

And also using the new model assertion:

```bash
$ snap model
brand   <brand-id>
model   ubuntu-core-22-amd64
grade   signed
serial  810d53c7-a741-9351-0a7e2b96095b
```

