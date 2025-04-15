(explanation-stores-brand-accounts)=
# Brand accounts

The global [Snap Store](https://snapcraft.io/store) is the default source for all snaps, including those used by Ubuntu Core. It’s where the majority of snaps are published, where public, unlisted and private snaps can be shared with users and collaborators, and where developers can manage their releases across channels and tracks.

But snaps can also be hosted, and published from a dedicated snap store, often called a [Brand store](/explanation/stores/dedicated-snap-stores) or IoT App Store. For a more in-depth look at dedicated snap stores, and how they're used with Ubuntu Core and IoT devices, see the [IoT App Store](https://ubuntu.com/core/services/guide/iot-app-store-intro) documentation.

A store is managed and governed through a brand account and the authority it delegates to other associated accounts. This is outlined below.

## Brand accounts

A brand account is an ordinary Ubuntu SSO account augmented by the store team after a support request. It then defines the scope of authority of a dedicated snap store, and it must be used for certain functions.

Accounts are registered the same as any other account, and it’s recommended a brand account acts as an umbrella account by using the project name or the legal entity responsible for the device.

The brand account can be used to:

* Generate, register, and hold the sign keys for the brand infrastructure.
* Sign Model Assertions used to build images that point at a dedicated snap store.
* Register kernel and gadget snap names.

The kernel and gadget snaps are special snaps that can only be registered by the brand account, which also must also be given a publisher role in the base store. Similarly, kernel and gadget snap names must be registered by the brand account (or by Canonical). See [Snaps in Ubuntu Core](/explanation/core-elements/snaps-in-ubuntu-core) for more details on the snaps used to build Ubuntu Core.

Use of the Brand Account and its credentials should be strictly limited. Canonical recommends that the Brand Account not be assigned any Roles that are not strictly needed. Do not make the Brand Account a store Administrator, a Reviewer or a Viewer.

When the Brand Account generates keys, they are only stored locally in ( ~/.snap/gnupg). These keys must be kept safe.

```{admonition} Enable two-factor authentication
:class: caution
We recommend enabling two-factor authentication on all Ubuntu SSO accounts, but especially the brand and administrator accounts described below. See [SSO two-factor authentication](https://help.ubuntu.com/community/SSO/2FactorAuthentication) for details.
```

## Roles

Roles are a vital part of the device and snap management lifecycle. They enable accounts other than the master brand account to control various aspects of the deployment process, and for those aspects to be safeguarded from the key and registry functions that maintain the integrity of the brand account.

As with the brand account, roles are assigned to a regular Ubuntu SSO account by a project administrator via [ https://snapcraft.io/admin]( https://snapcraft.io/admin):

![Ubuntu Core brand account add new member](https://assets.ubuntu.com/v1/a2ea6a4d-core-store.png)

The following roles can be selected:
- **Admin**
The administrator role in the App Store has the highest level of permissions granted. Administrator permissions include the abilities to:
- **Reviewer**
 Reviewers approve software changes made to snaps before they can be published to the Store, if the administrator has enabled the requirement for reviews in the Store.
- **Viewer**
The viewer role in the App Store has the fewest permissions granted. Viewers can see and download snaps from their IoT App Store. Downloaded snaps can be used to build images or perform testing.
- **Publisher**
The publisher role in the App Store is linked to publishing snaps to the Store, including registering snap names, uploading releases and specific revisions and configuring team collaborators.

See [Setting up account roles](https://ubuntu.com/core/services/guide/setting-up-account-roles) for more details on how roles are created and what they can do, and take a look at our [IoT App Store](https://ubuntu.com/core/services/guide/iot-app-store-intro) documentation for a more comprehensive look at dedicated snap stores.

