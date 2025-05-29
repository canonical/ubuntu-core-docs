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

The `ubuntu-image` command can now build an image using locally sourced and built snaps, such as a custom gadget snap:

```bash
ubuntu-image snap my-model.model --snap ./pc_20-0.4_amd64.snap
```

It is also possible to pre-download the snaps included in a model assertion, and include them manually with the `--snap` flag. This uses the locally cached copies and can save download and build time, which is useful for testing.

You can now use the image to boot either real or virtual hardware. From within a running session on a custom image, you can run the pre-installed snap. Use `snap list` to see which snaps are installed:

```bash
$ snap list
Name       Version            Rev    Tracking       Publisher      Notes
core20     20250429           2582   latest/stable  canonical✓     base
pc         20-0.4             x1     -              -              gadget
pc-kernel  5.4.0-214.234.1    2421   20/stable      canonical✓     kernel
snapd      2.68.4             24505  latest/stable  canonical✓     snapd
wormhole   0.16.0+2.g1bd72f3  509    latest/stable  snapcrafters✪  -
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
grade: dangerous
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

