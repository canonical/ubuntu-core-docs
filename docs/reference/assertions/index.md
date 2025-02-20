# Assertions

An assertion is a digitally signed document that either verifies the validity of a process, as attested by the signer, or carries policy information, as formulated by the signer.  

[Snapcraft](https://snapcraft.io/docs/snapcraft), [snapd](https://snapcraft.io/docs/glossary#heading--snapd), the [Snap Store](https://snapcraft.io/store) and [Brand stores](/explanation/stores/dedicated-snap-stores) all use assertions to handle a variety of functions and processes, including authentication, policy setting, identification and validation.

Assertions are text-based and take a context-dependent format that always includes one or more headers, an optional body, and the encoded signature.

## Assertion types

These are the currently used assertion types:

- **[account](/reference/assertions/account)**: links an account name to its identifier and other properties
- **[account-key](/reference/assertions/account-key)**: holds the public part of a key belonging to the account
- **[model](/reference/assertions/model)**: brand-specified properties for the device, used to drive the building of an Ubuntu Core image
- **[repair](/reference/assertions/repair)**: a unique assertion used to restore a device as a last resort feature
- **[serial](/reference/assertions/serial)**: binds the device identity to the device's key by carrying the public part
- **[snap-build](/reference/assertions/snap-build)**: the basic properties of a snap at the time it was built by the developer
- **[snap-declaration](/reference/assertions/snap-declaration)**:  defines various snap properties, such as `snap-id`, its name, and the publisher, plus policy related to accessing privileged interfaces
- **[snap-resource-pair](/reference/assertions/snap-resource-pair)**: links a snap revision to a component revision
- **[snap-resource-revision](/reference/assertions/snap-resource-revision)**: store acknowledgement on receipt of a component build labelled with a revision
- **[snap-revision](/reference/assertions/snap-revision)**: store acknowledgement on receipt of a snap build labelled with a revision
- **[store](/reference/assertions/store)**: defines the configuration needed to connect a device to a store
- **[system-user](/reference/assertions/system-user)**: usually brand authorisation to create local system users on specified devices
- **[validation](/reference/assertions/validation)**: validates a specific snap revision for a given series
- **[validation-set](/reference/assertions/validation-set)**: a group of snaps that are either installed or permitted to be installed together

## Assertion format

The typical format of an assertion, with common headers, is as follows:

```yaml
type:          <type>       # For example, “account” or “model”
authority-id:  <account id> # On whose authority this assertion is made
<key field 1>: <value>      # Fields identifying the object of the assertion
...
<key field N>: <value>
<other field>: <value>
...
revision: <int>             # Assertions can be updated with a higher revision
format: <int>               # Assertion types can have backward incompatible format changes signaled by a higher format
body-length: <int>          # Present if a body is provided with this assertion
sign-key-sha3-384: <key id> # Encoded key id of signing key

<body>                      # Optional type-dependent body of length `body-length` bytes

<signature>                 # Encoded signature
```

- every assertion has `type`, `sign-key-sha3-384` and a signature
- most assertions have `authority-id`
- values are scalars (strings, integers, booleans), lists, or maps
- some headers are used as a unique index to specify the context of an assertion of the given, together they form the so-called primary key of the assertion
- most assertions also have a revision to enable a particular assertion to be updated by issuing another assertion of the same type and index with a higher revision.

Given a particular type and index, there is only one “latest” valid assertion that properly determines policy for a system - the one with the highest revision. For a given assertion, the index headers must all be defined.

## Viewing assertions

The `snap known <type> [<header>=<value>...]` command can be used to view assertions or a specific type:

```bash
$ snap known account account-id=generic
type: account
authority-id: canonical
account-id: generic
display-name: Generic
timestamp: 2017-07-27T00:00:00.0Z
username: generic
validation: certified
sign-key-sha3-384: [...]
```

Similarly, a snap's assertions are downloaded alongside the snap using the `snap download` command:

```bash
$ snap download gnome-calculator
Fetching snap "gnome-calculator"
Fetching assertions for "gnome-calculator"
Install the snap with:
   snap ack gnome-calculator_544.assert
   snap install gnome-calculator_544.snap
$ cat gnome-calculator_544.assert 
type: account-key
authority-id: canonical
revision: 2
[...]
```


```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

*
