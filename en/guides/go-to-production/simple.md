---
table_of_contents: true
---
# Simple Production Model

Here we provide an overview of the simple production model:

* Your device type is one of the supported device types TODO add link to page with list
* Your device image consists only of snaps that are in the Ubuntu Store (not in a branded store subsection) 
* Your image is made from unmodified core, kernel and gadget snaps
* Your device also includes one or more extra snaps that you have published to the store as freely available (these provide the "special sauce" that makes your device unique and awesome)
* Distribute your devices
* Devices are updated in the field from the Ubuntu Store (all snaps are updated as updated become available)
* Customers can also install snaps from the Ubuntu Store

This is a great choice that provides the simplest path to production.

**Note** If you want your device to connect to a branded section in the Ubuntu Store, consider TODO add link to advanced production model,

!["Simple Production Model"](../../../media/production-model-simple.png)

## Steps

The high level steps are few for this production model:

1. Develop your own _extra_ snaps and publish them in the Ubuntu Store as freely available
1. Create a _model assertion_ and sign it using a key you have registered with the store
1. Create your device image (including your extra snaps) and your signed model assertion
1. Flash your image your devices (the _factory_ stage)
1. Distribute your devices.

Let's take a closer look at these steps.

## Develop and publish your extra snaps

There's no better place that <https://snapcraft.io> for learning how to develop snaps.

Once your snap is working as exected, publish it the store as described here <http://snapcraft.io/docs/build-snaps/publish>.

Next, up you need to create your signed model assertion, then build your image.

## Create a signed model assertion

Steps for creating a model assertion are provided here <http://docs.ubuntu.com/core/en/guides/build-device/image-building>.

**Note** Your model assertion also should contain a key `required-snaps:` listing . These are the snaps that make your device special.

Here's a sample model assertion file that defines a model named "my-pi3", is amrhf, uses the stable (unmodified) gadget, kernel and core snaps (the unmodified core snap is assumed and has no key), contains your extra snap ("myawesomesnap"), and is associated with your store account ID (the brand and authority).
 
    {
      "type": "model",
      "authority-id": "<your account id>",
      "brand-id": "<your account id>",
      "series": "16",
      "model": "my-pi3",
      "architecture": "armhf",
      "gadget": "pi3",
      "kernel": "pi2-kernel",
      "required-snaps": ["myawesomesnap", "mysecondawesomenape"], 
      "timestamp": "<timestamp>"
    }

As noted in the other docs, you sign this with your registered key, which produces your signed model assertion file, which is used in the next step to build your image.

## Build the image

Steps for building an image are provided here <http://docs.ubuntu.com/core/en/guides/build-device/image-building>.

**Note** To include your extra snaps in the image, build the image using the --extra-snaps argument followed by the names of your published snaps (they are obtained from the store and installed). This is the the same as the ```required-snaps``` key in the model assertion.

The result is an image file that you can flash onto your devices.

## Factory: flash your devices

Now, flash your devices with the image file you created. One approach is to use the `dd` command to flash the image to unpartitioned and unmounted SD cards that are destined for the devices. Details here may of course vary depending on your "factory".

## Distribute your devices

Obviously, the approach for getting your devices into customers hands in the field is up to you :)

