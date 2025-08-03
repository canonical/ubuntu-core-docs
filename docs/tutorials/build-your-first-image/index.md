# Build your first image

This tutorial will guide you through the steps required to **create your own Ubuntu Core image**, with **your own selection of snaps**, and **install it on a Raspberry Pi**.  

This same process can be used to build Ubuntu Core images for various hardware and devices.

## Requirements

In addition to having a basic understanding of Linux and running commands from the terminal, this tutorial has hardware requirements.

* [Hardware requirements for building an Ubuntu Core image](requirements.md)

  See the recommended hardware configuration of the host and target systems specific to this tutorial.

## Create an Ubuntu One account

Before you can use Ubuntu Core, build or sign an image, or publish a snap, you will need to create an Ubuntu One account, supply it with Snapcraft credentials, and retrieve the developer account ID.

Ubuntu One is a single sign-on service (SSO) for Ubuntu and its affiliated projects, including [snapcraft.io](https://snapcraft.io), the central resource for all snap-related publishing.

See the details on how to create an account, login, and retrieve your developer account details.

* [Create the account online](access-ubuntu-one.md#create-an-ubuntu-one-account)

  Learn how to create an account and register an SSH key.

* [Export login credentials with Snapcraft](access-ubuntu-one.md#snapcraft-credentials)

  Use Snapcraft to export your login authentication credentials and place them within an environment variable.

* [Retrieve your developer account id](access-ubuntu-one.md#retrieve-your-developer-account-id)

  Use the `snapcraft whoami` command to display your developer identifier.

## Create the model assertion

A _model assertion_ is a signed recipe that describes the components that comprise a complete image at the heart of a custom Ubuntu Core.

* [Download a model assertion](create-a-model.md#download-a-model-file)

* [Edit the model assertion](create-a-model.md#edit-the-model-file)

* [authority-id and brand-id](create-a-model.md#authority-id-and-brand-id)

* [timestamp](create-a-model.md#timestamp)

* [snaps](create-a-model.md#snaps)

* [A complete model assertion](create-a-model.md#complete-model-example)



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
