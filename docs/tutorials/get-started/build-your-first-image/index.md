(tutorials-get-started-build-your-first-image-index)=
# Build-Your-First-Image

This tutorial will guide you through the steps required to **create your own Ubuntu Core image**, with **your own selection of snaps**, and **install it on a Raspberry Pi**.  

> The same process can be used to build Ubuntu Core images for various hardware and devices.

## Here's what you'll need for the tutorial

- a basic understanding of Linux and the command line
- a Raspberry Pi 4 Model B, or later
  - 4GB+ microSD card
  - keyboard and display (for setup only)
  - Ethernet or wireless network connectivity
- host system running [Ubuntu 22.04 LTS](https://releases.ubuntu.com/20.04/) or later
- 10GB of free storage space
- a microSD card reader
- a wireless network and access to the internet

The above requirements are specific to this tutorial. Other host distributions can be used, and other [target platforms](/reference/testing-platforms) are supported. 

## Step-by-step guide

Here's an overview of the steps required with links to our separate tutorials that deal with each individual step:

- **1. [Create an Ubuntu One account](/tutorials/get-started/build-your-first-image/access-ubuntu-one)**
  - [1. Create the account online](/t/create-an-ubuntu-one-account/30907#heading--create-account)
  - [2. Retrieve your developer account id](/t/create-an-ubuntu-one-account/30907#heading--developer-id)
- **2. [Create the model assertion](https://discourse.ubuntu.com/t/create-a-model-assertion/30927)**
  - [1. Download a model assertion](/t/create-a-model-assertion/30927#heading--download-model)
  - [2. Edit the model assertion](/t/create-a-model-assertion/30927#heading--edit-model)
  - [2.1 `authority-id` and `brand-id`](/)
  - [2.2 `timestamp`](/)
  - [2.3 `snaps`](/)
  - [2.4 `my-model.json`](/)
  - [3. A complete model assertion](/)
- **3. [Sign the model assertion](/tutorials/get-started/build-your-first-image/sign-the-model)**
  - [1. Create a key](/)
  - [2. Register the key](/)
  - [3. Sign the model ](/)
- **4. [Build and write the image](/tutorials/get-started/build-your-first-image/build-the-image)**
  - [1. Compile the image](/t/build-and-write-an-image/30931#heading--build)
  - [2. Write the image](/t/build-and-write-an-image/30931#heading--write)
- **5. [Boot the image](/tutorials/get-started/build-your-first-image/boot-the-image)**
  - [1. Boot Ubuntu Core](/t/boot-an-image/30932#heading--boot)
  - [1.1 Configure a network connection](/)
  - [2. Connect to the device](/t/boot-an-image/30932#heading--connect)


```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

*
*/index
