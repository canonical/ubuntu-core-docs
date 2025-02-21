(how-to-guides-image-creation-board-enablement)=
# Board enablement

Board enablement is the process of constructing a complete Ubuntu Core image for an unsupported device. This process typically involves the following steps, each of which is outlined in greater detail below.

This process has been tested and performed on a _Roseapple Pi_. You can find the complete example source in [this repository](https://github.com/kubiko/roseapple-pi-ubuntuCore-build), but the same process should be applicable to other hardware.

## Create the kernel snap

The kernel snap contains the Linux kernel for the device.

Ubuntu Core kernels are based on the `multiv7_defconfig` Linux kernel build target plus some mandatory Ubuntu configs (see the `snapcraft.yaml` example below).

You can find reference kernels here: <https://github.com/snapcore/sample-kernels>

Once you have a kernel ready for Ubuntu Core, the recommended way to build a kernel is with [snapcraft](https://snapcraft.io/docs/snapcraft-overview). Preferably host the `snapcraft.yaml` for the kernel in your device build tree, independent of the kernel tree.

### Kernel snapcraft.yaml example

[Source](https://github.com/kubiko/roseapple-pi-ubuntuCore-build/blob/master/builder/kernel/snapcraft.yaml)

```yaml
name: roseapple-pi-kernel
version: 3.10.37-1
summary: A roseapple kernel built from source
description: This is the reference kernel from xapp-le branch Ubuntu-Snappy-Core
type: kernel
architectures: [ armhf ]

parts:
    kernel:
        plugin: kernel
        source: https://github.com/kubiko/kernel-roseapple-pi.git
        source-branch: Ubuntu-Snappy-Core
        source-type: git
        kdefconfig: [snappy-actduino_bubble_gum_linux_defconfig]
        kconfigs:
            - CONFIG_LOCALVERSION="-roseapple"
            - CONFIG_DEBUG_INFO=n
            - CONFIG_SQUASHFS=m
            - CONFIG_DEVPTS_MULTIPLE_INSTANCES=y
            - CONFIG_RTL8192U=m
            - CONFIG_BT_BCM=m
            - CONFIG_MAC80211_LEDS=y
            - CONFIG_RFKILL_LEDS=y
            - CONFIG_ATH_COMMON=y
            - CONFIG_ATH_CARDS=y
            - CONFIG_ATH9K_HW=y
            - CONFIG_ATH9K_COMMON=y
            - CONFIG_ATH9K_BTCOEX_SUPPORT=y
            - CONFIG_ATH9K_HTC=y
            - CONFIG_ATH9K_HTC_DEBUGFS=y
            - CONFIG_LEDS_TRIGGERS=y

        kernel-initrd-modules:
            - squashfs
        kernel-image-target: zImage
        kernel-device-trees:
            - actduino_bubble_gum_sdboot_linux
        build-packages: [bc, kmod, cpio]
```

## The gadget snap

The [gadget snap](/reference/gadget-snap-format.md) is an essential part of Ubuntu Core. It's responsible for defining and manipulating device-specific system properties and configuration, as well as the boot and file system layout which is used for image building. 

You will need to create two files in the `meta` directory of this snap:

-   `meta/snap.yaml` containing the basic device description, together with device specific interfaces if needed
-   `meta/gadget.yaml` describing the device boot mode and its filesystem layout.

### meta/snap.yaml example

```yaml
    name: roseapple-pi
    version: 16.04-1
    summary: Roseapple Pi support package
    description: |
     Support files for booting Roseapple Pi
    type: gadget
    architectures:
        - armhf
```
### meta/gadget.yaml example

```yaml
    device-tree: actduino_bubble_gum_sdboot_linux.dtb
        volumes:
          roseapplepi:
            schema: mbr
            bootloader: u-boot
            structure:
              - offset: 2097152 #4096*512
                size: 2097152 #2M
                type: mbr
                content:
                    - image: boot-assets/bootloader.bin
                      offset: 512 #(4097-4096)*512
                    - image: boot-assets/u-boot.bin
                      offset: 1048576 #(6144-4096)*512
              - type: 0C
                filesystem: vfat
                filesystem-label: system-boot
                size: 128M
                content:
                  - source: boot-assets/
                    target: /
```

See [Building a gadget snap](/how-to-guides/image-creation/build-a-gadget-snap) for details on how to build the gadget snap.

## Create the model assertion

Before you can build an image to flash on the board, you need to prepare a [model assertion](/reference/assertions/model) and sign it.

First, prepare a JSON file describing the model assertion:

### Example model assertion for a Roseapple Pi

```yaml
    {
      "type": "model",
      "authority-id": "<your store account id>",
      "brand-id": "<your store account id>",
      "series": "16",
      "model": "roseapple",
      "architecture": "armhf",
      "gadget": "roseapple-pi",
      "kernel": "roseapple-pi-kernel",
      "timestamp": "<timestamp>"
    }
```

### Keys description

-   `type`: the assertion type you are creating
-   `authority-id`, `brand-id` refer to your store account id. You will find it on [your account page](https://dashboard.snapcraft.io/dev/account/), in the `Account-Id` field.
-   `series`: the Ubuntu Core series in use
-   `model`: a free form lower-case name for your target device
-   `architecture`: the architecture of the device you are building the image for
-   The `gadget` and `kernel` values refer to the name of your kernel and gadget snaps
-   `timestamp` is a valid timestamp you need to generate using the `date -Iseconds --utc` command

Additional supported keywords for model assertion are:

-   `required-snaps`: list of strings describing the list of additional snaps to be preinstalled
-   `core`: define a custom core snap that needs to be used

See [Model assertion](/reference/assertions/model) for more details on what a model assertion can contain.

## Sign the model assertion

Before signing the model, you need to have a valid key registered with your store account. Make sure the `snapcraft` and `snap` commands know about you by logging in using the email address attached to your account.

```bash  
snapcraft login
snap login you@yourdomain.com
```

Note that `logout` commands are available as well.

To check for keys on your machine, run

```bash
snap keys
```

For backup purposes, snap keys are stored under `~/.snap/gnupg`

### Key creation

If you do not have a key, create a new one. You can pass an optional name for the key. If you don't, the key name will be `default`.

```bash
snap create-key my-key
```

Then, register the key with your store account:

```bash
snapcraft register-key my-key
```

### Signature step

Now you have to sign the model assertion with your key, by piping your JSON model through the `snap sign -k <key name>` command and outputting a model file you will use to build your image.

```bash
cat roseapple-model.json | snap sign -k my-key | tee roseapple.model
```

You can find a more detailed example of this process on the [Custom image building](/tutorials/build-your-first-image/sign-the-model) page.

### Canonical signed assertions

Alternatively, if you just want to build an image using kernel and gadget snaps signed by Canonical, you can use Canonical signed model assertions. Assertions for Canonical supported boards can be fetched directly from the Ubuntu Store, for example:

```bash
curl -H "Accept: application/x.ubuntu.assertion" "https://assertions.ubuntu.com/v1/assertions/model/16/canonical/pc-amd64"
```
Or

```bash
curl -H "Accept: application/x.ubuntu.assertion" "https://assertions.ubuntu.com/v1/assertions/model/16/canonical/pi3"
```

You can also use the _snap_ command:

```bash
snap known --remote model series=16 brand-id=canonical model=pc-amd64
```
Or

```bash
snap known --remote model series=16 brand-id=canonical model=pi3
```

## Image building

Images are built from a model assertion using [ubuntu-image](https://github.com/CanonicalLtd/ubuntu-image), a tool to generate a bootable image. It can be installed on a [snap-supporting Linux system](https://snapcraft.io/docs/installing-snapd) as follows:

```bash
snap install ubuntu-image --classic
```
    
You can now build your image using the following command:

```bash
sudo ubuntu-image \
-c stable \        # available channels are: edge/beta/candidate/stable
--image-size 4G \
--extra-snaps <gadget snap file name, e.g. roseapple-pi_16.04-1_armhf.snap> \
--extra-snaps <kernel snap file name, e.g. roseapple-pi-kernel_3.10.37-1_armhf.snap> \
--extra-snaps <add more preinstalled snaps here, names from the store or local paths> \
-o <image output file name, e.g. roseapple-pi-20161107-0.img> \
<model file name, e.g. roseapple.model>
```

Note: The `--extra-snaps` argument takes either a snap name accessible from the store or a local path to a built snap.

Your image is ready, you can use a tool like `dd` to write the image to an SD Card and boot your board.

## Build a custom image for a reference board

To build a custom image for one of the Canonical supported boards, use a Canonical signed model assertion, as described above and use a gadget and kernel snaps from the store.

### Raspberry Pi image example

```bash
curl -H "Accept: application/x.ubuntu.assertion" "https://assertions.ubuntu.com/v1/assertions/model/16/canonical/pi3" > pi3.model
```

```bash
sudo ubuntu-image \
-c stable \
--image-size 4G \
--extra-snaps pi2-kernel \
--extra-snaps pi3 \
--extra-snaps nextcloud \
-o pi3-20161107-0.img \
pi3.model
```
