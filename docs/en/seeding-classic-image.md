---
title: "Seeding a Classic Image"
table_of_contents: true
---

# Seeding a Classic Image

## Introduction
A Classic image is seeded to include snaps and [assertions][assertions]. That
is, you add the snaps and the assertions to the image so that on first boot it
contains what your product needs. For example, a [gadget snap][gadget-snap] is
normally seeded to point the system at a Serial Vault. Also, one seeds snaps
to provide the software that customizes the system. This document explains
what you may want to seed and how to do it.


!!! Note:
           Core images are seeded automatically with snaps and the model
          assertion when created with the normal  ubuntu-image tool (available
          as a snap in the beta channel). But, ubuntu-image does not yet
          support building Classic images. However, the principles explained
          here can be used to manually modify a Core image after it is built
to
          seed additional snaps and assertions.

## What to seed
Usually one needs to seed:

 - A model assertion.
 - An account assertion: for the brand SSO account used to authenticate the
model assertion.
 - An account-key assertion: to authenticate the key that signs the model
assertion.
 - A gadget snap and its assertions.

!!! Note:
          The gadget snap uploader must be the brand SSO account

 - A core snap and its assertions.
 - Any additional snaps (each with an assertion file).

How to obtain these assertions and snap files is explained below.

## Seed directory
After you have built an image, you will need to add a seed directory to it
(explained below): `/var/snapd/seed/`

This directory has a certain structure. For example:

 - `/var/snapd/seed/snaps/` contains the snap package files you want to seed.
 - `/var/snapd/seed/assertions/` contains the assertions you want to seed.
 - `/var/snapd/seed/seed.yaml` provides configuration data.

All you need to do is add this directory to your image in the required place.
On first boot, snapd handles the rest, verifying the snaps by their assertions
and installing them, and verifying and importing any assertions (such as  the
model assertion).

### Creating your seed directory
Create your seed directory as follows:

1. Make the root seed directory:

        $ mkdir seed

1.  Make the assertions subdirectory

        $ mkdir seed/assertions

1.  Make the snaps subdirectory

        $ mkdir seed/snaps

The seed directory needs to be owned by root user.  Change ownership of these
directories as follows:

1. From the parent directory of seed/, change the owner recursively to root
user as follows:

        $ sudo chown -R root:root seed


!!! Note:
          All files in the `seed` directory should be owned by root. Therefore,
          this command is executed later as well.

## Getting the snap files and assertions
You need to add a snap file for the core snap, for the gadget snap, and for
any other snaps you seed into the `seed/snaps/` directory. You also need to
place an assertion file for each snap in `seed/assertions/`.


!!! Note:
          You should only seed snaps that are available in the store the image
          points at. Otherwise the snap cannot be updated in the running
          system.  (The core snap is always available in every store. )

You can download both the snap and its assertion file with a single command.
When the snap is published in a brand store, you need to know the store ID.
The default behavior  downloads from the stable channel of the store. You can
optionally download from any channel.  You can also download a snap (and its
assertion) by specifying the snap’s revision (if the snap is not published on
a channel, you can only download it by revision if you are the snap uploader
or a collaborator).

Download the latest revision from the stable channel of the global store as
follows:

    $ snap download SNAPNAME

Download the latest revision from the stable channel of a brand store (where
the store ID is “my-brand-store”) as follows:

    $ UBUNTU_STORE_ID=my-brand-store snap download SNAPNAME

Alternatively, add a channel option as follows:

    $ UBUNTU_STORE_ID=my-brand-store snap --beta download SNAPNAME

The result is two files, for example:

- classic-gadget-1_1.assert
- classic-gadget-1_1.snap

By default, snap download gets a snap of the same CPU architecture as the
current host system’s CPU architecture.  If your classic image is a different
CPU architecture than your host system, you can download that different arch
with the U`BUNTU_STORE_ARCH` env variable.

For example, the following downloads  a snap named classic-gadge (and its
assertion file)t from my-brand-store of CPU architecture armhf (if the store
has it):

    $ UBUNTU_STORE_ARCH=armhf UBUNTU_STORE_ID=my-brand-store snap download classic-gadget

Next, we cover what to do with these files.

### Getting the core snap file and assertion file
The core snap is always in the global store.

1. Download the core snap and its assertion file:

        $ snap download core

1. Show the downloaded files:

        $ ls
        core_3247.assert  core_3247.snap

1. Copy the snap to `seed/snaps/`
1. Copy the assertion file to `seed/assertions/`

### Getting the gadget snap
Your gadget snap may be published in a brand store. Let’s assume the store ID
is “my-brand-store”.

1. Download your gadget snap and its assertion file from my-brand-store as
follows:

        $ UBUNTU_STORE_ID=my-brand-store” snap download SNAPNAME

1. Place the snap in the `seed/snaps/` directory.
1. Place the assertion in `seed/assertions/` directory.

### Downloading any other needed snaps
Follow the same procedure for each additional snap you want to seed, copying
the snap to `seed/snaps/` and the assertion to `seed/assertions/`.

## Creating your seed.yaml file
The `seed.yaml` file tells snapd which snaps are seeded in the image (and
included in the seed directory).

1. Create the file in `seed/seed.yaml`.
1. For each snap, fill in the following information:

        snaps:
          - name: core
            snap-id: THE-SNAP-ID
            channel: stable
            file: core_3017.snap
          - name: gadget-gateway7
            snap-id: THE-SNAP-ID
            channel: stable
            file: gadget-gateway7_1_amd64.snap


!!! Note:
          A snap ID is a a long alphanumeric string, for example:
          `X03kFuB2OQ3oiEI563kRMSgdQc8YiBfX`

You can get the snap ID for the core snap (or any other snap) with the snap
info SNAPNAME snap:  

    $ snap info core | grep snap-id
    snap-id:     99T7MUlRhtI3U0QFgl5mXXESAiSwt776

## Getting assertions for the seed/assertions/ directory

### The model assertion
As explained elsewhere, each Brand Store generally has an associated Brand SSO
account that is used for critical brand activities. This includes making and
signing the model assertion:

 - The model assertion must state the account-id of the Brand SSO account in
the brand-id and the  authority-id fields.
 - The model assertion must be signed by a key generated under the Brand SSO
account, and it must be registered.  

Also note:

 - The model’s store field’s value must be the brand store ID.
 - The model’s model field’s value must be registered in the Serial Vault.
 - The model must have `“classic”: true`
 - If the classic image has a gadget snap, it must be mentioned in the model:

        “gadget”: “GADGET-NAME”

Sign the model assertion json file as follows:

    $ cat model.json | snap sign -k model-key > model

For background information on model assertions and signing them, see
[image building][image-building]

### Getting the brand SSO account assertion
As noted, the brand SSO account is used to generate the key used to sign the
model. Therefore, this account assertion needs to be seeded for the model to
be authenticated.

You can download this account assertion as follows:

1. Login to snapcraft:

        $ snapcraft login

    And enter the Brand SSO account credentials.

1. Display the SSO account’s account-id:

        $ snapcraft whoami
        email:        THE-EMAIL
        developer-id: THE-ACCOUNT-ID

1. Download the brand SSO account assertion:

        $ snap known account account-id=THE-ACCOUNT-ID > brand-account.assert

### Getting the brand account-key assertion
As noted, you need to obtain the account-key assertion for the key that signed
the model. For this, you need the SHA3-384 fingerprint of the key. If the keys
were generated on a system you can access, you can do the following on the
system:

1. Login to snapcraft using the brand SSO account details on the machine on
which the model signing key was generated.
1. Display known keys and copy the SHA3-384 fingerprint of the key used to
sign the model:

        $ snapcraft  list-keys
            Name         SHA3-384 fingerprint
        *   model     KEY-SHA3-384-FINGERPRINT
        *   serial    KEY-SHA3-384-FINGERPRINT

    If the keys were generated on another system, you need someone who can access that system provide the fingerprint.

1. With the fingerprint, obtain the assertion as follows:

        $ snap known account-key --remote public-key-sha3-384=KEY-SHA3-384-FINGERPRINT > brand-account-key.assert

## Placing the seed directory into your image
Now, simply copy the seed directory and all that it contains into your image
in `/var/snapd/`, resulting in: `/var/snapd/seed/`.

As noted, the seed directory and all files in it need to be owned by root
user.  Recursively set ownership to root as follows:

1. From the parent directory of seed/, change the owner recursively to root
user as follows:

        $ sudo chown -R root:root seed

## Verifying seeding success
You can verify success in a running image as follows:

1. Verify the snaps you seeded are installed with:

        $ snap list

    You should see each snap you seeded as installed.

1. Verify the model assertion with:

        $ snap known model

    You should see the model assertion you seeded.

1. If your gadget snap includes a prepare-device hook in order to obtain a
signed serial assertion from a serial vault, you can check the status with:

        $ snap known serial

    If there is no serial assertion, the transaction may be in progress, so use:

        $ snap changes

    Find the Initialize device change. If its status is not Done, note the ID and
check the details of the change with:

        $ snap change ID


[image-building]: https://docs.ubuntu.com/core/en/guides/build-device/image-building
[gadget-snap]: https://forum.snapcraft.io/t/the-gadget-snap/696
[assertions]: https://docs.ubuntu.com/core/en/reference/assertions
