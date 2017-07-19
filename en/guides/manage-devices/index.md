---
title: Introduction
table_of_contents: true
---

# Introduction

On first boot, most stock core images finally run a program called console-conf. If the user has a terminal session on the device, they can use console-conf to do various things, such as configure the network and add a system user account.  The system user account can then be used to ssh to the device for various management purposes. 

Or, you can create a system user account with a *system-user assertion*, if you have authority for the image, that is, if you built is using a model assertion that you signed. IF a device is not already **managed**, this system user assertion can be put in the root dir of a USB, with the file name auto-import.assert, and upon insertion it is imported and the system user is created. More on this below.

Let's break this down a bit.

# Making the image

When you make an image with the `ubuntu-image ...` command, you prvoide a signed model assertion as the final argument. (See TODO).

The model assertion contains critical data that is needed when making a system user assertion, for example the:

* model
* brand

When you sign the model assertion (before making the image) you sign it with a key that you have registered with your Ubuntu SSO account. And that key must be available in your current sesssion, that is, the command `snapcraft list-keys must show the key. 

Let's say you have a model JSON file (mypi3model.json) like this:

```code
{
  "type": "model",
  "system-user-authority": "*",
  "authority-id": "xXBKQdXsFgTcTNWFH6NlFsTz7Epn4kvJ",
  "brand-id": "xXBKQdXsFgTcTNWFH6NlFsTz7Epn4kvJ",
  "series": "16",
  "model": "mypi3model",
  "architecture": "armhf",
  "kernel": "pi2-kernel",
  "gadget": "pi3",
  "timestamp": "2017-07-11T15:55:59+00:00"
}
```

It's required that:

* The `authority-id` and the `brand-id` values are an Ubuntu SSO account ID that you can access
* The snapcraft key you will sign the model with is registered to that SSO account

You can sign the model JSON file and create mypi3model.assertion as follows:

```code
cat mypi3model.json | snap sign -k KEY > mypi3model.assertion
```

(Let's assume the name of the registered KEY is "model".)

Then you can build the image (from stable chanel, for example) like so:

```code
sudo ubuntu-image -O outputdir --channel stable mypi3model.assertion
```

You can dd the outputdir/pi3.img file to an SD card and boot a pi3 from it. This pi3 image will be a stock image (unmodified) in every sense **except** it will be **your** model and brand. Therefore, you have athority to create a system-user assertion to create a system user. 

# About system-user assertions

System users can only be added via a system user assertion to a device that is not already **managed**. When you boot a stock image and complete the console-conf process, the result is that the system is **managed**, and you cannot then add a system user via a system user assertion. 

If you have terminal to the device, you can tell if it is managed with:

```code
$ snap managed
true
``e

Some image makers prefer to disable console-conf (covered elsewhere: TODO) entirely. If they need console/system user on a device, they can use the system user assertion on a USB key to create one. 

If you boot a system for the first time in which console-conf is not disabled, and you boot it with a valid system user assertion USB key insterted, the system user on the USB is created, and the portion of console-conf that creates the system user is skipped (but the part that allows you to configure the network is not skipped). 

Let's use the information we have about our image to create a system user assertion

# Creating a system user assertion

There's a snap that makes this part easy: make-system-user

1. Install it 

        snap install make-system-user

1. Check its help:
        sudo make-system-user.run --help

    The help specifies that you need the value of the `brand` field of the model assertion. This are the SSO account ID.

    You also need the value of the `model` field, in this case: `mypi3model`

    It also specifies you need a username and password, and you need to name the key (that was used to sign the model)

1. Here is a sample execution matching the above:

```code
$ sudo make-system-user.run --brand xXBKQdXsFgTcTNWFH6NlFsTz7Epn4kvJ --model mypi3model --username chuckthecoolcat --password heresapassword --key model
You need a passphrase to unlock the secret key for
user: "model"
4096-bit RSA key, ID C375E301, created 2016-01-01

Done. You may copy auto-import.assert to a USB stick and insert it into an unmanaged Core system, after which you can log in using the username and password you provided.
```

The result is `auto-import.assert` in your current directory. This can be used on an qualifying image (described above) that is not already *managed* to make a system user. 

Simply copy `auto-import.assert` to the root directory of a USB, insert it, and the system user is created. 

**Tip**: If you are creating the system on the first boot, it may take some minutes for the assertion to be imported and for the system user to be created. 


# Checking if a system user assertion was created 

If you can log in with the username and password, the system user has been created. 

You can also use the `snap known system-user` command. If there is a system user, the signed assertion is output. 

