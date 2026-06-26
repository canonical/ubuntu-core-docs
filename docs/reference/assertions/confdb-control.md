---
myst:
  html_meta:
    description: Confdb-control assertion reference. Delegate control of confdb views to operators.
---

(reference-assertions-confdb-control)=
# confdb-control

The confdb-control assertion grants operators control over specific subsets of a device's [confdb views](https://snapcraft.io/docs/explanation/how-snaps-work/confdb-configuration-mechanism/). Operators are accounts, typically in the Snap Store, that the device delegates this control to. The device is the authority over those views: it issues and signs the assertion itself, and holds only one at a time.

The assertion follows the principle of least privilege: each operator receives precisely the access defined by the views it is granted, where the read or write access level comes from the view's own definition in its {ref}`confdb-schema assertion <reference-assertions-confdb-schema>`.

## Fields

The format of the confdb-control assertion is as follows:

```yaml
type:        confdb-control
brand-id:    <brand-id>
model:       <model>
serial:      <serial>
groups:
  - operators:       [ <operator-id>, ... ]
    authentications: [ operator-key | store | ... ]
    views:
      - <account-id>/<confdb-schema>/<view>
      - ...
  - ...
sign-key-sha3-384: <key id>   # Encoded key id of signing key

<signature>                   # Encoded device signature
```

- **`brand-id`** (*required*)
    The account ID of the device's brand, matching the device's {ref}`model assertion <reference-assertions-model>`. Together with `model` and `serial`, forms the primary key of this assertion.
- **`model`** (*required*)
    The device's model name, matching its {ref}`model assertion <reference-assertions-model>`.
- **`serial`** (*required*)
    The unique identifier for the device within its model, matching its {ref}`serial assertion <reference-assertions-serial>`.
- **`groups`** (*required*)
    A list of delegations. Each delegation grants a set of operators control over a set of views through a given set of authentication methods. See {ref}`Groups <reference-assertions-confdb-control-groups>` below.

Unlike most assertion types, confdb-control has no `authority-id` header. That header normally names the account on whose authority an assertion is made, but here the device is its own authority and signs the assertion with its own device key.

(reference-assertions-confdb-control-groups)=
### Groups

Each delegation in `groups` grants one or more operators control over a set of confdb views, limited to a specific set of allowed authentication methods.

### Operators

A list of the account IDs being delegated to.

### Authentications

Operators manage the device by sending it signed confdb request messages, and the `authentications` field limits which keys may sign those messages on an operator's behalf. Two methods are supported:

- **`operator-key`**
    Messages must be signed with the operator's own private key.
- **`store`**
    Messages may be signed on behalf of the operator by the Snap Store.

Multiple methods can be listed, in which case a message signed by any of them is accepted.

### Views

A list of confdb views, each in the form `<account-id>/<confdb-schema>/<view>`. These paths refer to views defined in {ref}`confdb-schema assertions <reference-assertions-confdb-schema>` and can span multiple schemas. The access level available to operators for each view is determined by the view's own `access` definition in the confdb-schema assertion.

## Managing delegations

Any change to the assertion, whether delegating control to a new operator or revoking an existing delegation, is made through the [`POST /v2/confdb`](https://snapcraft.io/docs/reference/development/snapd-rest-api/#/AuthenticationRequired/postConfdbControl) snapd API endpoint rather than by editing the assertion directly. Each change increments the assertion's revision, which snapd re-signs and acknowledges automatically. Modifying the assertion requires root privileges.

The endpoint provides two actions. Delegating grants an operator control over a set of views under a chosen set of authentication methods. Undelegating withdraws an operator's control, either over specific views and authentication methods or, if none are given, entirely.

## Example assertion

A device's confdb-control assertion can be viewed with `sudo snap known confdb-control`. For example:

```yaml
type: confdb-control
brand-id: acme
model: assembly-robot
serial: 8e8af03a-4b32-4e91-b10a-b9e5d1f0c72f
groups:
  - operators: [ acme-robotics ]
    authentications: [ operator-key, store ]
    views:
      - acme/controls/accelerometer-admin
      - acme/controls/accelerometer-state
      - acme/controls/actuator-admin
  - operators: [ acme-monitor ]
    authentications: [ store ]
    views:
      - acme/controls/accelerometer-state
  - operators: [ acme-ops ]
    authentications: [ operator-key ]
    views:
      - system/network/wifi-admin
      - system/network/wifi-state
sign-key-sha3-384: BWDEoaqyr25nF5SNCvEv2v7QnM9QsfCc0PBMYD_i2NGSQ32EF2d4D0hqUel3m8ul

AcLBUgQAAQoABgUCWCIWcgAAReg...
```
