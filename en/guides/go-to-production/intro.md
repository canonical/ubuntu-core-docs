---
table_of_contents: true
---
# Go to Production Introduction

Making a smart doorbell from Snap Ubuntu for your family and friends is undeniably awesome! At some point you may want to take your superb creation into production. 


So: how does one take their awesome Snap image into production with updatable snaps from a store? Not surprisingly, there is more than one way. 

Here, we cover two production models. Both models let you take your Snap image into the field with boot security and with snap updates from the store.

The first production model is simple. It's a good choice when you publish your snap for free in the Ubuntu Store. Your device in the field gets updates, including updates of your own snaps that you included in the image.

TODO: add image of model one

The second production model fits when you have protected snaps in the image, for example snaps that are available in the Ubuntu Store (or your own store) for payment but that are installed in your image and you want to be updated for free on your devices.

TODO: add image of model two

Before diving into detail, let's deal with one of the key benefits of Snap Ubuntu: security.

## Security and Assertions

You may have read about _assertions_ here and there. Let's clarify why they matter when going to production, particularly which assertions are relevant in our two production models.

**Note** An assertion is a text file with essential data. A signed assertion is a new text file that is the original text file that is signed. These signed assertions are critical to understanding production models. Let's take an quick overview of where keys fit into this.

For more info, see TODO add link to assertions doc.

### Keys and the Ubuntu Store
 
Core and Snap assertion security is based a public/private keys. 

**Note** Snap also has _confinement_ security, a different topic. See TODO add link.
The private part of the key is used to sign an assertion file. The public part of the key is used to authenticate that the file came from the source you think it did and that is has not changed. The public key is registered in the Ubuntu Store and can be used to authenticate device boot, device update, and device reset.

You can use standard assertions (which support the first production model), or you can create your own key to create signed custom assertions and thereby support the second more richly featured production model.

For info on creating and registering your own key, see TODO add link.

### Model Assertion

A signed _model assertion_ file is required to create an image using `ubuntu-image`. 

For information on creating an image, see TODO add link to build image.

The model assertion file provides essential information about the image build, such as the snaps it is created from, the model name, the brand (if any) and more.

When the device boots, snapd checks its signed model assertion, and, if authentic, the device run time is configued using the model assertion's data. If the model assertion is not authentic, the device does not boot to a normal run time state. Thus the model assertion is the critical first line of defense that guarantees devices boot into a known and authenticated state. This means that _your_ devices in the field cannot be hijacked to a fake identity/configuration.

You can create an image from only standard (unmodified) snaps. In this case you can use a standard pre-signed Canonical model assertion. When the device boots, the snapd process recognizes that the model assertion is signed by the Canonical key (because snapd knows the public part of the Canonical key and uses it to authenticate the standard model assertion used during image creation), the standard model assertion data is verified as authentic and correct, and the device boots to completion configured according to the model assertion. But, production options here are somemwhat limited, as explained below.

If you want additional functionality, you can create your own model assertion file (signed with your own key) and create an image with this. This opens a range of additional possibilities, notably in-field updates of protected snaps (such as those that require payment in the Ubuntu store), and using your own store. You can also use a customized model assertion file that lists any extra snaps that are in your image, so if the device is reset, it starts off with your extra snaps installed too.

Let's take a closer look.

#### Standard model assertion limitations

As noted, when using a standard model assertion, your image can only be made from uncustomized snaps plus your additional snaps. These extra snaps must be in the Ubuntu store and must be available without payment, and they must not be private.

Also, if the device is reset to factory defaults in the field, it boots into a pure state consisting only of the standard snaps listed in the standard model assertion and without knowledge of the extra snaps you installed in the original image. 

This production model may may be appropriate in many cases. Some cases require more. 

#### Custom model assertion

More highly customized images require a customized model assertion. For example, a customized model assertion can also list the extra snaps you installed in the original image so that if the device is reset to factory defaults in the field, on reboot it also contains your special etra snaps and is thus a customized device.
 
Another use for a customized model assertion is to point the device at a custom _serial vault_. A serial vault is a used to sign a customized serial assertion with a custom key. Such custom signed serial assertions provide the device access to protected snaps in the store (or to your own snap store). (Serial assertions are discussed below.)

For information on creating a customized model assertion file and signing it with your own key, see TODO.

### Model assertion wrap up

The signed model assertion is needed for the device to boot to completion. It says what the device image consists of. Standard (unmodified) model assertions are simple but may not provide enough update and reset functionaly for some production models. For these more advanced case, one creates and signs their own model assertion and through this the devices get access to updates for protected snaps, and,in the case of reset, they include any extra snaps you want.

### Serial Assertions

The serial assertion has this name because it uniquely identifies a device to the store by its "serial number". (Just what a serial number is depends on how it is defined in the gadget snap. See TODO link to gadget snap.) Combined with the data in the model assertion, the store now has richly detailed and authenticated information that describes the device, including the snaps it is made of and, for custom serial assertions, provides access to protected updates.

Note that a Snap device _always_ has a serial assertion. In the simple case, it is provided by the Ubuntu Store. The more richly featured case also involves a custom _serial vault_.

#### Simpler production model

When a device image is created from the standard (unmodified) model assertion, it also (by definition) uses a (signed) serial assertion provided by the Ubuntu Store. That is, such generic devices get their signed serial assertion from the Ubuntu Store on boot. The running image in the field cannot update protected (for payment) snaps from the store. And, in the unlikely case that a reset is needed, the device cannot install extra snaps that were added to the base image.

##### Custom Production model

To provide a richer production model, you can use:

* a custom model assertion (this allows a custom serial assertion)
* a custom serial assertion (this requires a custom serial vault)
* a custom "serial vault" (to sign the serial assertion using your key)
* a custom gadget snap (to point to the device to your serial vault and define how the unique serial number is created)

The custom production model opens the door to a superior device update (and reset) experience.











