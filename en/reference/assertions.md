---
title: Assertions types
table_of_contents: true
---

# Assertions types

The following assertions are currently supported:

## account

The account assertion ties a name for an to its identifier and provides the authority's confidence in the name's validity.

## account-key

The account-key assertion holds a public key belonging to the account.

## model

The model assertion is a statement by a brand about the properties of a device model. See [Image building](../guides/build-device/image-building.html) for a real-world example

## serial

The serial assertion is a statement binding a device identity with the device public key.

## snap-declaration

The snap-declaration assertion defines some of the properties of the snap, such as the snap-id, the official name, the publisher, and so on.

## snap-build

The snap-build assertion defines the basic properties of a snap at the time it was built by the developer.

## snap-revision

The snap-revision assertion is a statement by the store acknowledging the receipt of a build of a snap and labeling it with a snap revision.

## system-user

The system-user assertion is a permit by the brand for local system users to be created on its specified devices.

The system-user assertion has the following form:

```
type:           system-user
authority-id:   account-id   // Owner of the key, must be the brand
brand-id:       account-id   // Assertion will only work on models of this brand
email:          string       // Email of user
series:         list         // List of series which should accept this assertion
models:         list         // Models which should accept this assertion
name:           string       // Optional person’s name, for context and for gecos
username:       string       // Local system username for the user
password:       string       // Password for local system user, encoded and salted with
                                an algorithm hard to brute-force ($6$rounds=...$...)
ssh-keys:       list         // SSH keys to authorize for connection
since:          utc-datetime
until:          utc-datetime // Required!
revision:       integer

signature       authority-sig
```

## validation

The validation assertion defines that a combination of (snap-id, approved-snap-id, approved-revision) has been validated for a given series, meaning refreshing to that revision of approved-snap-id has been approved by the owner of the gating snap with snap-id.
