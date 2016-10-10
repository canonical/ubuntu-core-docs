---
title: Snap stores
---

There are multiple ways to distribute snaps as the format is not tied to a specific distribution system.

## The Ubuntu Store

The main way of distributing snaps to snapd systems is through [the Ubuntu Store](https://myapps.developer.ubuntu.com/dev/click-apps/ "Ubuntu store"), where you can customize how your snap is presented, review each new upload, and control publishing over several release channels. Here is the model it follows.

### Developer namespace

You'll choose a unique developer namespace as part of the store account creation process. This namespace will represent you as a publisher in the store and you won't be able to change it afterwards.

### Naming

You can publish a snap under any name you have rights to. Names can be registered by using the `snapcraft register` command, clicking **New Snap** on the developer portal, or by visiting the [Register name](https://myapps.developer.ubuntu.com/dev/click-apps/register-name/ "register name") page. You can also grant other developers permission to publish versions of a snap you own, for example as part of an open source project.

### Uploading

Uploading snaps to the store can be done directly with the [`snapcraft upload`](/docs/build-snaps/publish "snapcraft upload") command or on the [store website](https://myapps.developer.ubuntu.com/dev/click-apps/ "Ubuntu store") itself. Once uploaded you choose the release channel(s) (`stable`, `candidate`, `beta`, `edge`) that the snap will be published to.

It's worth noting that when you upload a snap, the store assigns it a revision number of 1\. The store then automatically increments this revision number each time you upload a new version.

### Publishing

After you've chosen a channel, your application is sent for review. Most apps are reviewed by way of automated checks, but if your app uses sensitive [interfaces](/docs/core/interfaces), it may be manually reviewed -- you can find more details on the review process [here](https://developer.ubuntu.com/en/publish/application-states/).

Once your snap has been reviewed and approved, you can publish it when you're ready, instantly making the snap available to users.

### Release channels

On the store, snaps can be published into different channels at the same time: `stable`, `candidate` (release candidate), `beta`, and `edge`. This enables you to engage with users who are willing to test changes, and it helps users decide how close to the leading edge of development they want to be.

By default, snaps are installed from the `stable` channel. Versions of snaps from other channels need to be explicitly selected:

    $ snap install hello --beta
    $ hello
    Hello, snap padawan!

And a snap can be refreshed from a different channel to the one it was originally installed from:

    $ snap refresh hello --beta
    Name    Version   Rev   Developer   Notes
    hello   2.10.1    29    canonical   -
    hello  (beta) installed

This switches the snap to using this channel for future updates.

## Other stores

Snaps are not tied to a specific type of store and you can host them any way you want.

You can find an example implementation of a custom store [here](https://github.com/noise/snapstore/). You can even deploy it locally by running `$ snap install snapstore-example`. See the README of the project for details.
