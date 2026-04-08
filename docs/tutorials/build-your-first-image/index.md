(ref-index-build-your-first-image)=
# Build your first image

This tutorial will guide you through the steps required to **create your own Ubuntu Core image**, with **your own selection of snaps**, and **install it on a Raspberry Pi**.  

This same process can be used to build Ubuntu Core images for various hardware and devices.

## Requirements

In addition to having a basic understanding of Linux and running commands from the terminal, this tutorial has hardware requirements.

* {ref}`Hardware requirements for building an Ubuntu Core image <ref-requirements_requirements>`

  See the recommended hardware configuration of the host and target systems specific to this tutorial.

## Create an Ubuntu One account

Before you can use Ubuntu Core, build or sign an image, or publish a snap, you will need to create an Ubuntu One account, supply it with Snapcraft credentials, and retrieve the developer account ID.

Ubuntu One is a single sign-on service (SSO) for Ubuntu and its affiliated projects, including [snapcraft.io](https://snapcraft.io), the central resource for all snap-related publishing.

See the details on how to create an account, login, and retrieve your developer account details.

* {ref}`Create the account online <ref-access-ubuntu-one_create-an-ubuntu-one-account>`

  Learn how to create an account and register an SSH key.

* {ref}`Export login credentials with Snapcraft <ref-access-ubuntu-one_snapcraft-credentials>`

  Use Snapcraft to export your login authentication credentials and place them within an environment variable.

* {ref}`Retrieve your developer account id <ref-access-ubuntu-one_retrieve-your-developer-account-id>`

  Use the `snapcraft whoami` command to display your developer identifier.

## Create the model assertion

A _model assertion_ is a signed recipe that describes the components that comprise a complete image at the heart of a custom Ubuntu Core.

* {ref}`Download a model assertion <ref-create-a-model_download-a-model-file>`

  Download the 64-bit reference model for the Raspberry Pi: [ubuntu-core-24-pi-arm64.json](https://raw.githubusercontent.com/snapcore/models/master/ubuntu-core-24-pi-arm64.json), save it locally with the `wget` command.

* {ref}`Edit the model assertion <ref-create-a-model_edit-the-model-file>`

  Edit `my-model.json` using a text editor.

* {ref}`authority-id and brand-id <ref-create-a-model_authority-id-and-brand-id>`

  Replace "canonical" in `my-model.json` with your developer and brand ID.

* {ref}`timestamp <ref-create-a-model_timestamp>`

  Provide the timestamp at the end of the process.

* {ref}`snaps <ref-create-a-model_snaps>`

  Add the snaps **pi**, **pi-kernel**, **core24** and **snapd** that are required for a functioning Ubuntu Core device.

* {ref}`A complete model assertion <ref-create-a-model_complete-model-example>`

  Review `my-model.json` after finishing the edits above.

## Sign the model assertion

Learn how to sign a model with a GPG key to make it into a _model assertion_.

* {ref}`Create a key <ref-sign-the-model_create-a-key>`

  Use `snapcraft` to create a key that will be used across all models or model families.

* {ref}`Register the key <ref-sign-the-model_register-the-key>`

  Upload the key and register it with your Ubuntu One account by using `register-key` command. After creating the key, update the timestamp in `my-model.json`.

* {ref}`Sign the model <ref-sign-the-model_sign-the-model>`

  Use the `snap sign` command to update the JSON file with the key name.

## Build and write the image

Using [ubuntu-image](https://github.com/canonical/ubuntu-image), generate a bootable image from the recipe contained in the {ref}`model assertion <ref-create-a-model_create-a-model>`.

* {ref}`Compile the image <ref-build-the-image_compile-the-image>`

  Install the `ubuntu-image` command and use the arguments `snap`, `--allow-snapd-kernel-mismatch` and the file name of the previously signed model assertion to build an image.

* {ref}`Write the image <ref-build-the-image_write-the-image>`

  Install Raspberry Pi Imager and use it to write the image on a microSD card.

## Boot the image

Now that you have a custom image for a Raspberry Pi on a microSD card, the device can now be booted and configured.

* {ref}`Boot Ubuntu Core <ref-boot-the-image_boot-ubuntu-core>`

  Insert the microSD card into the powered-off Raspberry Pi and turn it on to boot up your image.

* {ref}`Configure a network connection <ref-boot-the-image_configure-a-network-connection>`

  Choose a wired connection (Ethernet) or Wi-Fi to setup Ubuntu Core.

* {ref}`Connect to the device <ref-boot-the-image_connect-to-the-device>`

  Connect to the AdGuard Home snap of the Ubuntu Core via the published IP address and its configured port (3000 for setup).

```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

Requirements <requirements>
Access Ubuntu One <access-ubuntu-one>
Create a model <create-a-model>
Sign the model <sign-the-model>
Build the image <build-the-image>
Boot the image <boot-the-image>
