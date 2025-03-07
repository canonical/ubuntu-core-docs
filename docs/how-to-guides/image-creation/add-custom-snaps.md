(how-to-guides-image-creation-add-custom-snaps)=
# Add custom snaps

An Ubuntu Core image is built using the [ubuntu-image](/how-to-guides/image-creation/use-ubuntu-image) command with a signed model assertion:

```bash
ubuntu-image snap ubuntu-core-20-amd64.model
```

> See [Build your own Ubuntu Core image](/tutorials/build-your-first-image/index) for more details on the entire process.

_ubuntu-image_ tool retrieves signed snaps with the given _snap-id_ in the model assertion from the store. To override these default snaps, first make sure the [model assertion](/reference/assertions/model.md#model-assertion-fields) has a grade of dangerous to allow non-store snaps to be included:

```
grade: dangerous
```

The `ubuntu-image` command will now build an image using locally sourced and built snaps, such as a custom gadget snap:

```bash
$ ubuntu-image snap my-model.model --snap ./pc_20-0.4_amd64.snap
WARNING: proceeding to download snaps ignoring validations, this default will change in the future. For now use --validation=enforce for validations to be taken into account, pass instead --validation=ignore to preserve current behavior going forward
Fetching snapd
Fetching pc-kernel
Fetching core20
WARNING: "pc" installed from local snaps disconnected from a store cannot be refreshed subsequently!
Copying "./pc_20-0.4_amd64.snap" (pc)
```

You can now use the image to boot either real or virtual hardware. From within a running session on a custom image, you can run the pre-installed snap, such as `htop` in our example.

Use `snap list` to see which snaps are installed:

```bash
$ snap list
Name       Version        Rev   Tracking       Publisher   Notes
core20     20             634   latest/stable  canonical✓  base
htop       3.0.2          1332  latest/stable  maxiberta   -
pc         20-0.4         108   20/stable      canonical✓  gadget
pc-kernel  5.4.0-54.60.1  642   20/stable      canonical✓  kernel
snapd      2.47.1         9721  latest/stable  canonical✓  snapd
```


The `snap model --assertion` command will show the read-only custom model assertion used to build the image:

```
$ snap model --assertion
type: model
authority-id: bJzr2XzZg6Qv6Z53HIeziXyxtn1XItIq
series: 16
brand-id: bJzr2XzZg6Qv6Z53HIeziXyxtn1XItIq
model: ubuntu-core-20-amd64
architecture: amd64
base: core20
grade: signed
snaps:
  -
    default-channel: 20/stable
    id: UqFziVZDHLSyO3TqSWgNBoAdHbLI4dAH
    name: pc
    type: gadget
  -
    default-channel: 20/stable
    id: pYVQrBcKmBa0mZ4CCN7ExT6jH8rY1hza
    name: pc-kernel
    type: kernel
  -
    default-channel: latest/stable
    id: DLqre5XGLbDqg9jPtiAhRRjDuPVa5X1q
    name: core20
    type: base
  -
    default-channel: latest/stable
    id: PMrrV4ml8uWuEUDBT8dSGnKUYbevVhc4
    name: snapd
    type: snapd
  -
    default-channel: latest/stable
    id: hJmReLmgXSUj4SF7WhyTVRV6IzUa4QUZ
    name: htop
    type: app
timestamp: 2020-11-17T13:09:51+00:00
sign-key-sha3-384: 9aZR3b1U[...]
```

