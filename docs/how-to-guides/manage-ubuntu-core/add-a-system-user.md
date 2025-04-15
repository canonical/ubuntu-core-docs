(how-to-guides-manage-ubuntu-core-add-a-system-user)=
# Add a system user

By default, Ubuntu Core images run a program called `console-conf` when they're  first instantiated on a device.

![Ubuntu Core profile setup](https://assets.ubuntu.com/v1/5eb7db7c-uc-profile-setup.png) 

As shown above, `console-conf` is a text-based menu system that uses a connected keyboard and display, or a serial connection, to configure a device's network connection and to add a user.  A user is added by entering an [Ubuntu SSO](https://login.ubuntu.com/) registered email address with one or more [registered SSH keys](https://help.ubuntu.com/community/SSH/OpenSSH/Keys). This user can then access the device over SSH to perform various management and configuration functions.

Some systems, however, suppress _console-conf_ and its user creation.

To create a system user on these systems, a [system-user assertion](/reference/assertions/system-user) needs to be embedded within a file called `auto-import.assert` that's added to the system via the root directory of a removable USB storage device. This process is covered below.

```{admonition} Managed and unmanaged systems
:class: caution

A **managed** system already has a user account whereas an **unmanaged** system does not. A system user cannot typically be added to a system that is already _managed_.
```

## Creating users with auto-import.assert

The `auto-import.assert` file contains the following assertions:

- [system-user](/reference/assertions/system-user)
- [account](/reference/assertions/account)
- [account-key](/reference/assertions/account-key)

A `system-user` assertion for the new user needs to be created, as described below, but both `account` and `account-key` assertions are output automatically as part of the `auto-import.assert` creation process.

The following are required by for the `system-user` assertion and by the creation process:
- the `brand-id` and `model` fields taken from a device's model assertion
- access to the key used to sign the new assertion

The snap daemon (_snapd_) can import these assertions through the `auto-import.assert` file on an external USB storage device. If those assertions are valid for the given system, a system user is created. After this, you can log into the device (locally or over SSH) using the username and password defined.

### Inside model assertions

Creating a valid system-user assertion is limited by the [model assertion](/reference/assertions/model) which contains store account ID defined as _brand-id_ and _authority-id,_ alongside the model name, _model_.

If your device is built from an image created from your own [Custom model assertion](/how-to-guides/image-creation/add-custom-snaps), then you should already have access to these values. 

The following is an example a custom model assertion showing `bJzr2XzZg6Qv6Z53dsjhg20975Skjs` as the account ID and `mymodel` as the model name:

```yaml
{
  "type": "model",
  "authority-id": "bJzr2XzZg6Qv6Z53dsjhg20975Skjs",
  "brand-id": "bJzr2XzZg6Qv6Z53dsjhg20975Skjs",
  "series": "16",
  "model": "mymodel",
  "architecture": "armhf",
  "kernel": "pi2-kernel",
  "gadget": "cm3",
  "timestamp": "2021-01-11T15:55:59+00:00"
}
```

Another source of the store account ID is the _Snap account-id_ from [https://dashboard.snapcraft.io](https://dashboard.snapcraft.io/dev/account/):

![Ubuntu Core store account id](https://assets.ubuntu.com/v1/ee17a14e-uc-store-credentials.png)

When a model assertion lacks a `system-user-authority` field, the system-user assertion can only be signed by:
- a key registered to the store account specified by the `brand-id` field (_bJzr2XzZg6Qv6Z53dsjhg20975Skjs_  in our example)
- the key that's part of the [account-key](/reference/assertions/account-key) assertion when the system-user assertion is submitted to the device

#### Specifying system-user-authority

The optional `system-user-authority` field can be added to a model assertion to list a set of account IDs that are authorised to sign system-user assertions for any image built with the assertion:

```yaml
{
  "type": "model",
  "authority-id": "bJzr2XzZg6Qv6Z53dsjhg20975Skjs",
  "brand-id": "bJzr2XzZg6Qv6Z53dsjhg20975Skjs",
  "system-user-authority": [
    "<ANOTHER-ACCOUNT-ID>",
    "<YET-ANOTHER-ACCOUNT_ID>"
  ],
  "series": "16",
  "model": "mymodel",
  "architecture": "armhf",
  "kernel": "pi2-kernel",
  "gadget": "cm3",
  "timestamp": "2021-01-11T15:55:59+00:00"
}
```

Anyone who can log in to either ANOTHER-ACCOUNT-ID or YET-ANOTHER-ACCOUNT_ID accounts can sign system-user assertions with keys registered to those accounts. And such system-user assertions are valid for systems built with this model.

#### Self-signed system-user assertions

A model can also specify that anyone with a registered key can create a valid system-user assertion. This is done with an asterisk ("*") in the `system-user-authority` field:

```yaml
{
  "type": "model",
  "authority-id": "<ACCOUNT-ID>",
  "brand-id": "<ACCOUNT-ID>",
  "system-user-authority": "*",
  "series": "16",
  "model": "mymodel",
  "architecture": "armhf",
  "kernel": "pi2-kernel",
  "gadget": "cm3",
  "timestamp": "2017-07-11T15:55:59+00:00"
}
```

`mymodel` will also need to be the same as the model assertion.

## Creating the system-user assertion

As covered earlier, to create a user assertion you will need access to the following:

- store account ID or `brand-id`/`authority-id`
- model name from the model assertion
- the name of the key used to sign the assertion and its passphrase
- username, email address and password for the account you want to create

These details then need to be added to the following `system-user` template and saved to a new `system-user.json` file:

```json
{
    "type": "system-user",
    "authority-id": "ACCOUNT-ID",
    "series": ["16"],
    "brand-id": "ACCOUNT-ID",
    "email": "<UBUNTU-CORE-NEW-ACCOUNT-EMAIL>",
    "models": ["my-model"],
    "name": "<UBUNTU-CORE-NEW-ACCOUNT-NAME>",
    "username": "<UBUNTU-CORE-NEW-USERNAME>",
    "password": "<UBUNTU-CORE-NEW-USER-HASHED-PASSWORD>",
    "since": "2020-05-16T18:06:04+00:00",
    "until": "2064-05-16T18:06:04+00:00"
}
```

The password hash must be of the form "$integer-id$salt$hash" and can be generated with the following `mkpasswd` command:

```bash
mkpasswd -m sha-512 -S <8CHARSALT> -s
```

You will be asked for the password and the output can be inserted into the `system-user` template.

For further details on system-user fields, including `since` and `until`, see the [System-user assertion](/reference/assertions/system-user) documentation.

## Generating auto-import.assert

First, make sure you're logged in with both `snap` and `snapcraft`:

```bash
snap login
snapcraft login
```

See [Snapcraft overview](https://snapcraft.io/docs/snapcraft-overview) if _snapcraft_ is not installed. To retrieve the name of the key to sign the assertion with, use the `snapcraft keys` command:

```bash
$ snapcraft keys
Name         SHA3-384
my-key-name  E-n0AOKPFjIyy4S_i9JxTT4tkuaZf7rP9D2mBNXjlgTGDjL8euFSlb87U0NPl
```

See [Signing a model assertion](/tutorials/build-your-first-image/sign-the-model) for details on creating and uploading keys.

The contents of the `system-user` template needs to be signed. This is accomplished with the `snap` command, which can also generate the accompanying `account` and `account-key` assertions at the same time:

``` bash
snap sign -k my-key-name system-user.json --chain > auto-import.assert
```

After asking for the passphrase for _my-key-name_, the above command will generate output similar to the following:

The `system-user` data can be alternatively piped directly into the `snap sign` command. The additional `--chain` argument will output the `account` and `account-key` assertions alongside the newly signed `system-user` assertion.

The result is `auto-import.assert` in your current directory. This can be used on any qualifying image (described above) that is not already *managed* to make a system user.

Simply copy `auto-import.assert` to the root directory of a USB drive, insert it, and the system user is created.

**Tip**: If you are creating the system user on the first boot, it may take some minutes for the assertion to be imported and for the system user to be created.

## Checking the system-user assertion

If you can log in with the username and password, the system user has been created.

You can also use the `snap known system-user` command. If there is a system user, the signed assertion is output.

