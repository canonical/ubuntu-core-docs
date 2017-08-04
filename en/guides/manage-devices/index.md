---
title: Introduction
table_of_contents: true
---

# Introduction

On some systems it is appropriate to have a system user. For example, with a system user, one can ssh to the device and run commands. (A system user is not required.)

By default on first boot, stock core images finally run a program called console-conf. If the user has a keyboard and monitor attached to the device, they can use console-conf to configure the network and add a user account. This user account can then be used to ssh to the device for various management purposes.

Some systems suppress console-conf, and a user is not created by default. In these cases, one may add a system-user if one has the information and authority needed to do so for the particular system. This is done by inserting a USB key with a special file (named `auto-import.assert`) in the root directory. Snapd imports the assertions found in it, and, if the assertions are valid for the given system, the system-user is created. After this, you can log into the device (locally or over ssh) using the username and password defined.

In general, you cannot add a system-user to a system that is already "managed". A system is managed if a user was already created by console-conf, or if a system-user was created through the auto-import mechanism described here.

Whether you can add a system-user to an unmanaged system depends on the model assertion that was used to create the image. It also depends on whether you have an authorized snapcraft key on your local system.

## Model assertions that allow adding a system user

### The simplest case is where you did everything:

* You created a snapcraft key and it is registered to your SSO
* You created a model assertion
* The model assertion has the `authority-id` set to your SSO account ID
* The model assertion has the `brand-id` set to your SSO account ID
* You signed the model assertion using the key mentioned above
* You built the image using that model assertion

The model assertion (original JSON) may look like this:

```
{
  "type": "model",
  "authority-id": "THE-SSO-ACCOUNT-ID",
  "brand-id": "THE-SSO-ACCOUNT-ID",
  "series": "16",
  "model": "mymodel",
  "architecture": "armhf",
  "kernel": "pi2-kernel",
  "gadget": "cm3",
  "timestamp": "2017-07-11T15:55:59+00:00"
}
```

Note that this model assertion does not have a `system-user-authority` key. When a model assertion lacks this key, a system-user assertion can only be signed by a key registered to the SSO account specified by the `brand-id` field. But, in this case, you do have the key needed to sign the system-user assertion, so all is well.

### Specifying other SSO accounts that can sign the system-user assertion

You can use the optional `system-user-authority` field to list a set of SSO account IDs that are authorized to sign system-user assertions for any image built with this model assertion.

```
{
  "type": "model",
  "authority-id": "THE-SSO-ACCOUNT-ID",
  "brand-id": "THE-SSO-ACCOUNT-ID",
  "system-user-authority": [
    "ANOTHER-SSO-ACCOUNT-ID",
    "YET-ANOTHER-SSO-ACCOUNT_ID"
  ],
  "series": "16",
  "model": "mymodel",
  "architecture": "armhf",
  "kernel": "pi2-kernel",
  "gadget": "cm3",
  "timestamp": "2017-07-11T15:55:59+00:00"
}
```

In this case, any one who can log in to either ANOTHER-SSO-ACCOUNT-ID or YET-ANOTHER-SSO-ACCOUNT_ID accounts can sign system-user assertions with keys registered to those accounts. And such system-user assertions are valid for systems built with this model.

### Self-signed system-user assertions

A model can also specify that anyone with a registered key can create a valid system-user assertion. This is done with an asterisk ("*") in the `system-user-authority` field:

```
{
  "type": "model",
  "authority-id": "THE-SSO-ACCOUNT-ID",
  "brand-id": "THE-SSO-ACCOUNT-ID",
  "system-user-authority": "*",
  "series": "16",
  "model": "mymodel",
  "architecture": "armhf",
  "kernel": "pi2-kernel",
  "gadget": "cm3",
  "timestamp": "2017-07-11T15:55:59+00:00"
}
```

## Creating a system-user assertion

We now know that creating a valid system-user assertion is limited by the model assertion. And, there is information in the model assertion that is needed to create the system-user assertion, specifically the `brand-id` and the `model`.


There's a snap that makes this part easy: make-system-user

1. Install it 

        $ snap install make-system-user --classic

1. Check its help:

        $ sudo make-system-user.run --help

    The help specifies that you need the brand, which is the `brand-id` field's value in the model assertion. 

    You also need the value of the `model` field, in this case: `mymodel`

    You need to specify a username and password. 

    And, you need to name the key to sign the assertion. Note that the assertion only works on a given system if the key is within the limitations of the model assertion as described previously.


1. Here is a sample execution matching the above:

```code
$ sudo make-system-user.run --brand THE-SSO-ACCOUNT-ID --model mymodel --username chuckthecoolcat --password heresapassword --key MYVALIDKEY
You need a passphrase to unlock the secret key for
user: "MYVALIDKEY"
4096-bit RSA key, ID C375E301, created 2016-01-01

Done. You may copy auto-import.assert to a USB stick and insert it into an unmanaged Core system, after which you can log in using the username and password you provided.
```

The result is `auto-import.assert` in your current directory. This can be used on an qualifying image (described above) that is not already *managed* to make a system user. 

Simply copy `auto-import.assert` to the root directory of a USB, insert it, and the system user is created. 

**Tip**: If you are creating the system on the first boot, it may take some minutes for the assertion to be imported and for the system user to be created. 


## Checking if a system user assertion was created 

If you can log in with the username and password, the system user has been created. 

You can also use the `snap known system-user` command. If there is a system user, the signed assertion is output. 

