# Access Ubuntu One

To use Ubuntu Core, to build and sign an image, or publish a snap, you need an [Ubuntu One](https://login.ubuntu.com/) account.

Ubuntu One is a single sign-on service (SSO) for Ubuntu and its affiliated projects, including [snapcraft.io](https://snapcraft.io), the central resource for all snap-related publishing.

See below for details on how to create an account, login, and retrieve your developer account details.

## Create an Ubuntu One account

You will need an [Ubuntu One account](https://snapcraft.io/account) with an uploaded public key of a locally generated SSH key pair. 

See [Use Ubuntu One for SSH](/how-to-guides/manage-ubuntu-core/use-ubuntu-one-ssh) for instructions on how to create an account and register an SSH key.

With your account created, ensure you first [login](https://snapcraft.io/login) and accept the _Terms and Conditions_. With this done, your Ubuntu One account is ready to use.

You will now need to retrieve your developer account identifier. This is part of your Ubuntu One account and is used to link your account to any Ubuntu Core images you create.

The next steps need to be performed in an existing Ubuntu LTS environment.

## Snapcraft credentials

Your developer identifier can be retrieved with the [`snapcraft`](https://snapcraft.io/docs/snapcraft-overview) command, the tool that's also used to build and publish snaps. It can be installed by running:

```bash
sudo snap install snapcraft --classic
```

We now need to use `snapcraft` to export your login authentication credentials, and to place them within an environment variable.

```bash
snapcraft export-login credentials.txt
export SNAPCRAFT_STORE_CREDENTIALS=$(cat credentials.txt)
```

If you have yet to login to your Ubuntu One account with the `snapcraft` command, you will first be prompted for your email address, password, and second-factor authentication (if used).

## Retrieve your developer account ID

With your authentication in place, the `snapcraft whoami` command will now display your developer identifier after the `id` field:

```bash
$ snapcraft whoami
email: <email-address>
username: <username>
id: xSfWKGdLoQBoQx88
permissions: package_access, package_manage, package_metrics, package_push, package_register, package_release, package_update
channels: no restrictions
expires: 2024-04-17T10:25:13.675Z 
```

In the output above, the example **id** is `xSfWKGdLoQBoQx88` -- we'll use this ID for subsequent examples, but you should obviously use your own ID from now on.

