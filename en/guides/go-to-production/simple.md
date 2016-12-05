---
table_of_contents: true
---

# Build your device distribution

Here we cover how to build an Ubuntu Core/Snappy distribution for deployement.

That is, we discuss the steps you take to create a Snap image that contains your special snaps, and cover the connection to the store such that all snaps (image snaps and your special snaps) are updated from the store.

There are many ways to accomplish this. For now, let's start a staighforward case:

* Your distribution runs on a standardand supported Snappy device. In this case, let's use Intel Joule. TODO add link to list of standard devices
* You start with an unmodified Ubuntu Snap image. That is, you distribution uses unmodified versions of the ubuntu-core snap, the kernel snap and the gadget snap
* You add your own snaps. That is, the image also includes one or more snaps you have developed and published to the Ubuntu Store
* Your distribution uses the Ubuntu Store (and the snap is not published privately in the store).

!["My Distribution"][id]
[id]: ../../../media/g1b.png

## Other distribution cases

Other distribution cases not yet coverd here include:

* Porting Snappy to an unsupported device
* Using modified core, kernel or gadget snaps
* Using your own snap store
 
## Install Ubuntu Snap on your device

As noted, the intention here is to create a distribution using standard Snap Ubuntu for Snap. 

After Snap Ubuntu is installed you can develop your snaps and test them on the device. 

Now, please install Snap Ubuntu on the device. This typically involves:

* Downloading the Ubuntu image file
* Writing thne image onto an unpartitioned micro SD device with the `dd` command
* Inserting the SD card into the device and booting the device with an HDMI monitor, USB keyboardattached
* Completing the first boot configuration wizard in the terminal session displayed on the HDMI monitor. This includes entering the email address that you registered with the Ubuntu Store.

On completion of the first boot configuration wizard, the `ssh` command needed for you to gain terminal access to the device is displayed. For example: `yourusername@192.168.0.101`. You use ssh to push development snaps to the device for installation and testint during snap development.

Now you are ready to develop the snaps you want in your distribution. 

## Develop your snap for your device architecture

In this case, your snaps are what make this distribution unique. So, you need to develop your snaps, test them, and publish them in the Ubuntu Store.

## Create your device image

Use ubuntu-image with `--extra-snap` to create your factory image. This image contains your snaps and is the base image you can install in your factory onto your devices for shipping.

## Factory (make image with snap) and distribute


## Maintain in field (snaps updated)



