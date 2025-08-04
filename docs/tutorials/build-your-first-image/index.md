(ref-index-build-your-first-image)=
# Build your first image

This tutorial will guide you through the steps required to **create your own Ubuntu Core image**, with **your own selection of snaps**, and **install it on a Raspberry Pi**.  

This same process can be used to build Ubuntu Core images for various hardware and devices.

## Step-by-step guide



1. [Requirements](requirements)
1. [Create an Ubuntu One account](access-ubuntu-one)
   1. [Create the account online](access-ubuntu-one.md#create-an-ubuntu-one-account)
   1. [Retrieve your developer account id](access-ubuntu-one.md#retrieve-your-developer-account-id)
1. [Create the model assertion](create-a-model)
   1. [Download a model assertion](create-a-model.md#download-a-model-file)
   1. [Edit the model assertion](create-a-model.md#edit-the-model-file)
   1. [authority-id and brand-id](create-a-model.md#authority-id-and-brand-id)
   1. [timestamp](create-a-model.md#timestamp)
   1. [snaps](create-a-model.md#snaps)
   1. [A complete model assertion](create-a-model.md#complete-model-example)
1. [Sign the model assertion](sign-the-model)
   1. [Create a key](sign-the-model.md#create-a-key)
   1. [Register the key](sign-the-model.md#register-the-key)
   1. [Sign the model](sign-the-model.md#sign-the-model)
1. [Build and write the image](build-the-image)
   1. [Compile the image](build-the-image.md#compile-the-image)
   1. [Write the image](build-the-image.md#write-the-image)
1. [Boot the image](boot-the-image)
   1. [Boot Ubuntu Core](boot-the-image.md#boot-ubuntu-core)
   1. [Configure a network connection](boot-the-image.md#configure-a-network-connection)
   1. [Connect to the device](boot-the-image.md#connect-to-the-device)

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
