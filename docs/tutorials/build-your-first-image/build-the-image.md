# Build the image

Images are built from the recipe contained in the [model assertion](/tutorials/build-your-first-image/create-a-model) using [ubuntu-image](https://github.com/canonical/ubuntu-image), a tool to generate a bootable image.

## Compile the image

First, install the `ubuntu-image` command from its snap:

```
sudo snap install ubuntu-image --classic
```

The `ubuntu-image` command requires two arguments; `snap` to indicate we're building a snap-based Ubuntu Core image, and the filename of our previously-signed model assertion to build an image:

```bash
$ ubuntu-image snap my-model.model
[0] prepare_image
WARNING: proceeding to download snaps ignoring validations, this default will change in the future. For now use --validation=enforce for validations to be taken into account, pass instead --validation=ignore to preserve current behavior going forward
WARNING: the kernel for the specified UC20+ model does not carry assertion max formats information, assuming possibly incorrectly the kernel revision can use the same formats as snapd
[1] load_gadget_yaml
[2] set_artifact_names
[3] populate_rootfs_contents
[4] generate_disk_info
[5] calculate_rootfs_size
[6] populate_bootfs_contents
[7] populate_prepare_partitions
[8] make_disk
[9] generate_snap_manifest
Build successful
```
You can safely ignore both of the above warnings, and the entire process should only take a few minutes (depending on your connectivity), with the creation of  a `pi.img` Ubuntu Core image file being the end result.

```{tip}
 
The _console-conf_ user-interface that configures the network and system user when a device first boots has migrated to an optional snap in Ubuntu Core 24 and later.

This is covered in [Create a model assertion](/tutorials/build-your-first-image/create-a-model), but `ubuntu-image` can add `console-conf` at image build time with an additional `--snap console-conf ` argument. For more details on these changes, see [console-conf for device onboarding](/how-to-guides/image-creation/add-console-conf).
```

## Write the image

The next step is to write the `pi.img` file to the microSD card. There are many ways to do this, but our recommended way is to use Raspberry Pi Imager. This can be installed from its snap:

```bash
sudo snap install rpi-imager
```

After installation, launch Raspberry Pi Imager from the desktop. Click on the first 'Choose OS' button under 'Operating System' and select 'Use custom'.

This will open a file requester, and you now need to navigate to, and select, the `pi.img` file we generated in the previous step.

Next, make sure the microSD card is inserted to a connected microSD card reader and select 'Choose storage' under 'Storage'. Your microSD card will be listed and needs to be selected.

With the microSD card selected, select the final 'Write' button to commence the image writing process.

When the process completes, you can safely remove the microSD card.

```{tip}
Developers used to writing raw bootable images to SD cards can still use the `dd` command.
```

