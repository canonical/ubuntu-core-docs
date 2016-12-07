---
table_of_contents: true
---

# Advanced Production Model

Here we provide an overview of the advanced production model:

* You define your own device type and hence have one or more of:
  * A kernel snap of you choice [link to kernel snap creation]
  * A gadget snap that you have created [link to refeence/gadget.md]
  * A factory image that contains snaps that are not publically available
* You curate your own store of snaps, a _Branded Store_
* You want _Update Control_, to decide when updates are published to devices you have created

The provides all the functionality and control required to manage your device ecosystem.

## Steps

The high level steps are few for this production model:

1. Contact your Canonical representative to:
    * Create you a Brand Account
    * Create your Branded Store associated with this account
    * Provide instructions on tools and process needed for manufacturing
1. Create the your gadget snap and publish it in your store
1. Create the extra snaps needed for your device's base functionality
1. Create a _model assertion_ and sign it using a key you have registered with the store
1. Create your device image (including your extra snaps) and your signed model assertion
1. Flash your image your devices (the _factory_ stage)
1. Distribute your devices

Let's take a closer look at some these steps.

## Create your gadget snap

The reference section contains detailed information about the format of a gadget snap: [Gadget Snap Format](../../../gadget.html)

Of particular importance is the prepare-device hook which must contain the details how to contact your Serial Vault.

## Create the extra snaps

Once your snap is working as exected, publish it to the branded store. These apps will only be available to devices whose model assertion specifies your brand and store.

## Create the model assertions

Steps for creating a signed model assertion are provided here <http://docs.ubuntu.com/core/en/guides/build-device/image-building>.

Let's look at a sample model assertion file for a fictional device, the "Device 1", made by the brand "ACME Corp". The host architecture is amrhf. The image will be populuated with the gadget and kernel snaps that support this hardware, the core snap, and two extra snaps required for the device to function correctly, "amce-dashboard" and "acme-control-plane". Note that the authority-id and brand-id match the account-id defined for the ACME Corp account.

    {
      "type": "model",
      "authority-id": "acme",
      "brand-id": "acme",
      "store": "abcdef123456789"
      "series": "16",
      "model": "acme-device-1",
      "architecture": "armhf",
      "gadget": "device-1",
      "kernel": "device-1-kernel",
      "required-snaps": ["acme-dashboard", "acme-control-plane"],
      "timestamp": "2016-12-01T12:00:00+00:00"
    }

As noted in the other docs, you sign this with your registered key, which produces your signed model assertion file, which is used in the next step to build your image.

## Build the image

Steps for creating an image from the signed model assertion are found here <http://docs.ubuntu.com/core/en/guides/build-device/image-building>.

## Factory flash you device

!["Advance Factory Model"](../../../media/factory-model-advanced.png)

## Distribute your devices

When your devices are in the field and operational they will communicate with
your branded store to identify when updates are available or to install snaps
that the user wants.

!["Advanced Production Model"](../../../media/production-model-advance.png)
