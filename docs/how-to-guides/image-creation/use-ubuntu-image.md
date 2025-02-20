(how-to-guides-image-creation-use-ubuntu-image)=
# Use ubuntu-image

Images are built from a model assertion using [ubuntu-image](https://canonical-subiquity.readthedocs-hosted.com/en/latest/reference/ubuntu-image.html), a tool to generate a bootable image. It can be installed on a [snap-supporting Linux system](https://snapcraft.io/docs/installing-snapd) as follows:

```bash
sudo snap install ubuntu-image --classic
```

The `ubuntu-image` command requires only a path to a model assertion to build an image.

If you want to include your own core snaps, such as a custom gadget snap, see [Building an image with custom snaps](/how-to-guides/image-creation/add-custom-snaps) for details on how the model assertion and _ubuntu-image_ command need to be modified.

## Inside a model

Creating an Ubuntu Core image starts with a _model assertion_, a digitally signed text file with structured headers defining every aspect of the image.

The input model for defining and signing such a document is provided as JSON text:

```json
{
    "type": "model",
    "series": "16",
    "model": "ubuntu-core-24-pi-arm64",
    "architecture": "arm64",
    "authority-id": "canonical",
    "brand-id": "canonical",
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
            "id": "ASctKBEHzVt3f1pbZLoekCvcigRjtuqw",
            "presence": "optional"
        }
    ]
}
```

The above example shows an unsigned reference model for [Raspberry Pi/arm64](http://cdimage.ubuntu.com/ubuntu-core/24/stable/current/ubuntu-core-24-arm64.model-assertion). To see how this can be modified and signed, see [Add custom snaps](add-custom-snaps).

The model includes details such as the store to use (`brand-id` and `authority-id`), the model name (`ubuntu-core-24-pi-arm64`) and the hardware architecture (`arm64`). Any snaps installed on the device will respect this selected architecture.

As outlined in [Snaps in Ubuntu Core](/explanation/core-elements/snaps-in-ubuntu-core), there are four principle types of snap that combine to create the Ubuntu Core environment. These are **kernel**, **gadget**, **base** and **snapd**, and all four need to be referenced within a model assertion.

```{tip}
 
The _console-conf_ user-interface that configures the network and system user when a device first boots, has migrated to an optional snap in Ubuntu Core 24 and later. See [console-conf for device onboarding](/how-to-guides/image-creation/add-console-conf) for further details.
```

## Building with ubuntu-image

The following will build an _amd64_ image using the [ubuntu-core-24-amd64.model](https://raw.githubusercontent.com/snapcore/models/master/ubuntu-core-24-amd64.model) reference model:


```bash
ubuntu-image snap ubuntu-core-24-amd64.model
```

The output includes the _img_ file itself, alongside a _seed.manifest_ file. The manifest file simply lists the specific revision numbers of the snapd, pc, pc-kernel and core snaps built within the image, plus any other snaps added to the model.

## Additional snaps

Snaps can be optionally added at build time with the '--snap' argument.

These additional snaps can include [custom snaps](/how-to-guides/image-creation/add-custom-snaps), locally-stored [offline snaps](/explanation/remodelling.md#offline-remodelling-with-offline), and snaps that can be downloaded directly from the store.

- **Custom snaps** can only be added when a [model](/reference/assertions/model) has a `grade` attribute of `dangerous` 
- Production-grade images cannot include custom snaps, and additional snaps must first be declared with a `presence` attribute of `optional` in the model.
- **Offline snaps** must include locally cached assertions. Using offline locally stored snaps can speed up the image creation process.

## Image size

The size of a generated disk image can optionally be controlled with the `--image-size` argument.

The value is the size in bytes, with allowable suffixes M for MiB and G for GiB and if this size is smaller than the minimum calculated size of the volume, a warning is issued and the option is ignored.

An extended syntax is supported for [Gadget snaps](/how-to-guides/image-creation/build-a-gadget-snap) that specify multiple volumes (i.e. disk images). In that case, a single SIZE argument is used for all the defined volumes, with the same rules for ignoring values that are too small. You can specify the image size for a single volume using an indexing prefix on the SIZE parameter, where the index is either a volume name or an integer index starting at zero. For example, to set the image size only on the second volume, which might be called sdcard in gadget.yaml, use: --image-size 1:8G (the number 1 index indicates the second volume; volumes are 0-indexed). Or use --image-size sdcard:8G.

You can also specify multiple volume sizes by separating them with commas, and you can mix and match integer indices and volume-name indices. Thus, if gadget.yaml names three volumes, and you want to set all three to different sizes, you can use --image-size 0:2G,sdcard:8G,eMMC:4G.

## Testing an image

Rather than immediately booting an image on native hardware, it's good practice to boot an image first with QEMU ([https://www.qemu.org/](https://www.qemu.org)). See [Testing Ubuntu Core with QEMU](/how-to-guides/manage-ubuntu-core/test-on-qemu) for further details.

After a successful boot, Ubuntu Core initialisation will ask for both networking parameters and an Ubuntu One account (see <a href="https://snapcraft.io/account" class="uri">https://snapcraft.io/account</a>). 

When the initialisation process has finished, and rebooted, you can SSH to the device using either the physical device network address,  or localhost port 8022 for the above QEMU example command:

``` bash
ssh <username>@localhost -p 8022
```

You are now connected to the Ubuntu Core virtual machine, from where you can configure and install whatever apps you need. 

To list which snaps are installed, for example, type 'snap list' and to view the model assertion used to build the image, type `snap model --assertion`:

```bash
$ snap model --assertion
type: model                                                                                                                                                
authority-id: canonical                                                                                                                                    
series: 16                                                                                                                                                 
brand-id: canonical                                                                                                                                        
model: ubuntu-core-24-amd64                                                                                                                                
architecture: amd64                                                                                                                                        
base: core24                                                                                                                                               
grade: signed                                                                                                                                              
[...]
```

To output the serial assertion rather than the model assertion, type `snap model --serial`:

```bash
$ snap model --serial
brand-id:  canonical
model:     ubuntu-core-24-amd64
grade:     signed
serial:    1194d330-d27b-4230-a16f-ab0d23665010
```

See the [Snap documentation](https://snapcraft.io/docs) for more details on working with snaps. To build a custom image that includes your own selection of snaps, take a look at [Add custom snaps](add-custom-snaps).

