---
title: Settings
table_of_contents: true
---

# Settings

You can manage your store settings through the [Store Preferences](https://myapps.developer.ubuntu.com/dev/store/admin/) page.

There are three categories of settings:

* Store preferences
* Automatic review checks
* Available store packages

## Store preferences

* "Can sell apps": you can enable or disable paid apps in your store.

    When enabled, uploaders have the possibility to set a price for their apps and end users can use the `snap buy` command to buy them, allowing their installation on devices logged in with the account that bought them.

* "Unlisted": this makes the store semi-private. The name and store id will not be listed in the main [store list](https://myapps.developer.ubuntu.com/dev/store/list/), but will still be accessible to clients and uploaders who know its id.

## Automatic review checks

* "Manual approval": the first setting of this category enforces manual approval on all snaps, regardless of the results of the automated review.

### Review types

The store allows you to be very granular in which automatic checks you can disable. Each of these is defined in the `click-reviewer-tools` [source code](http://bazaar.launchpad.net/~store-reviewers/click-reviewers-tools/trunk/files) and included test suite.
