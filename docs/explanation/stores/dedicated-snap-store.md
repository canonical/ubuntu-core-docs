(explanation-stores-dedicated-snap-stores)=

```{admonition} Ubuntu 20.04 LTS is moving out of standard support in May 2025.
:class: tip
We recommend migrating to the next LTS or upgrading to Ubuntu Pro. [Learn more about your options](https://ubuntu.com/20-04).
```

(ref-dedicated-snap-store_dedicated-snap-store)=
# Dedicated snap store

A _dedicated snap store_ (formerly known as a _Brand store_) allows vendors running Ubuntu Core and snap-based devices to control exactly what snaps are available and when. 

See our [IoT guide](https://ubuntu.com/core/services/guide) for a comprehensive overview of how dedicated Snap Stores fit within our devices infrastructure. The general details we cover below should be useful for anyone using Ubuntu Core.

## Dedicated Snap Store and Snap Store capabilities

Dedicated Snap Stores have their roles and administration controlled by a _Brand account_ and can inherit selected packages from other snap stores, and host a set of snaps specific to a brand and device models, and be either open to all developers or a specific list.

|                            | Dedicated Snap Store               | Snap Store               |
|----------------------------|---------------------------|--------------------------|
| Access                     | Restricted                | Public                   |
| Snaps published            | Only to dedicated Store users | Seen globally            |
| Content                    | Curated by owner          | Curated by Canonical     |
| Hosting                    | Canonical hosted/managed  | Canonical hosted/managed |
| Security                   | Monitored by Canonical    | Monitored by Canonical   |
| OTA (over-the-air updates) | Yes                       | Yes                      |
| Refresh control            | Yes                       | Yes                      |
| Account delegation         | Yes                       | No                       |
| Proxy snap server support  | Yes                       | No                       |
| Custom dashboard           | Yes                       | No                       |
| Custom API access          | Yes                       | No                       |
| Substores                  | Yes                       | No                       |

## Brand accounts

The Brand account grants roles and privileges to the dedicated Snap Store, and is itself derived from a nominated  {ref}`Ubuntu SSO account <ref-access-ubuntu-one_access-ubuntu-one>`. It's strongly recommended that the Ubuntu SSO account is used only for Brand activities and that its use is strictly limited and controlled.

![Dedicated Snap Store SSU](/images/brand-store-1.png)

There are several activities that must be done under the authority of this Brand SSO account, including:

-   Dedicated Snap Store administration
-   Generating keys used to sign assertions, such as the model and serial assertions
-   Gadget snap publishing (if you are using a non-Canonical gadget snap)
-   Kernel snap publishing (if you are using a non-Canonical kernel snap)

These activities are central to managing a dedicated Snap Store, its images and devices and are therefore considered brand activities.

![image](/images/brand-store-2.png)

While it is *technically* possible to use different Ubuntu SSO accounts to administer dedicated Snap Store actions, a single Brand account simplifies access and security oversight and is the strongly recommended approach.

## Assertions

An assertion is a digitally signed document that either verifies the validity of a process, as attested by the signer, or carries policy information, as formulated by the signer.

Dedicated Snap Stores, Ubuntu Core, Snapcraft, snapd and the Snap Store all use assertions to handle a variety of functions and processes, including authentication, policy setting, identification and validation.

The {ref}`model assertion <reference-assertions-model>`, for example, contains the fundamental definition of a snap-based device, including its core base and the snaps it bundles. It is signed by a key from a Brand account, which means it can be authenticated and its integrity relied upon.

![image](/images/brand-store-3.png)

See {ref}`Add customs snaps <how-to-guides-image-creation-add-custom-snaps>` for instructions on how to use a model assertion to create an Ubuntu Core image.

## Device authentication

When a device boots for the first time, it obtains a signed {ref}`serial assertion <reference-assertions-serial>` from a [Model Service](https://ubuntu.com/internet-of-things/appstore/docs/how-to/configure-model-service/) or [Serial vault](https://canonical-serial-vault.readthedocs-hosted.com/). Each device can then be authenticated with the dedicated Snap Store using the model assertion's _model name_ and an authentication token called a **macaroon**. 

![image](/images/brand-store-4.png)

The macaroon is provided by the Canonical **Authentication Service**, via the Store API, and requires that a device has the following:

1. **Model support in the Model Service or Serial Vault**
  This includes the snap account-id of the Brand account, a model name (which must be used in the model assertion mentioned previously), and a key generated by the Brand SSO account. Setting up the Model Service or Serial Vault configuration currently requires communicating with Canonical.

1. **Gadget snap with prepare-device hook pointing at the Model Service or Serial Vault** 
  The system needs a {ref}`gadget snap <reference-gadget-snap-format>` that has a {ref}`prepare-device hook <ref-gadget-snap-format_prepare-device-hook>` script that points the device to the Model Service or Serial Vault. The hook script sets a few snapd variables, including the Model Service or Serial Vault URL and device’s serial number.

![image](/images/brand-store-5.png)

See [Serial vault overview](https://ubuntu.com/core/services/guide/serial-vault-overview) for further Serial vault details, and our [IoT guide](https://ubuntu.com/core/services/guide) for more details on using devices with a dedicated Snap Store.

