(reference-assertions-snap-declaration)=
# snap-declaration

The _snap-declaration_ [assertion](/reference/assertions/index) defines several important properties of a snap, including its snap-id, the official name, the publisher. However, it's mainly used to control what plugs or slots a snap is allowed to use, and if a snap is allowed to use a plug/slot, what other slots/plugs should connect to that plug/slot on this snap.

This assertion is downloaded with the snap when installing a snap from a store and includes  details on the actions to take when performing the installation.

The `snap-declaration` assertions for all installed snaps can be seen by running `snap known snap-declaration`.

## Snap-declaration assertion fields

The format is as follows:

```yaml
type:               snap-declaration
authority-id:       <authority account id>
revision:           <int>
series:             <series this assertion was created for>
snap-id:            <string>
snap-name:          <string>
publisher-id:       <the owner of this snap-id space>
timestamp:          <UTC datetime>
refresh-control:    <list of snap-ids that have gated updates>
  - [snap-id1]
  - [snap-id2]
  - ...
aliases:       <optional listing of explicit aliases granted to this snap>
  -  name: [alias1]
     target: [target-command1]
  - ...
plugs:              <map from [interface] to plug side rules>
  [interface]:      <optional plug side rules for [interface]>
    allow-installation:     <true|false>
    deny-installation:      <true|false>
    allow-connection:       <true|false>
    deny-connection:        <true|false>
    allow-auto-connection:  <true|false>
    deny-auto-connection:   <true|false>
  ...
slots:              <map from [interface] to slot side rules>
  [interface]:      <optional slot side rules for [interface]>
  ...               <similar options as rule entries for plugs>
sign-key-sha3-384: <key id> # Encoded key id of signing key

<signature>                 # Encoded signature
```

The index is the tuple `< series`, `snap-id >`, and `snap-id` is a key with the same format as the account ids.

This assertion gives control on several aspects of the snap behaviour to the authority:

-   `refresh-control` gives a list of snaps that are gated when the one specified by `snap-id` is installed, so they are not automatically refreshed until they are "validated". Validation is performed by using [validation asserts](/core/docs/reference/assertions/validation), which specify the revision of the gated snap that should be installed if the gating snap has been installed.

-   `aliases` gives a list of the explicit aliases that we want to automatically enable when installing the snap. Aliases provide short names for applications contained in the snap, so we do not need to use the full command name `<snap-name>`.`<target-command>`. 

-   `plugs` and `slots` define flags per interface. This lets define restrictions on how the snap plugs/slots used by the snap are handled. For instance, we can allow or deny connections with `allow-connection` and `deny-connection`. With `allow-auto-connection` or `deny-auto-connection` we let snapd know if it should automatically connect plugs/slots on snap installation.

    See [Connection management](#connection-management) (below) for more details on  these restrictions, and see [snap-declaration store scoping](/) for more information on how auto-connections can be linked to a brand store.

See [Assertion format](/reference/assertions/index.md#assertion-format) for more details on fields common to most assertions.

## Connection management

The overall structure of the snap-declaration has two top-level keys, plugs and slots, which affect the plugs and slots of the snap respectively. Beneath these keys are the names of interfaces, and for each interface key is an map which has 6 possible keys:

* `allow-installation`
* `deny-installation`
* `allow-connection`
* `deny-connection`
* `allow-auto-connection`
* `deny-auto-connection`

Each of these keys can either have a static value of true/false in the assertion or can be a more complex object/list which then is “evaluated” by snapd on a device to determine the actual value, be it true or false. If there is no such a rule in the snap-declaration for an interface plug/slot that a snap is using, then the base-declaration from inside snapd is used to populate rules, more on that below.

The `deny-*` variant of keys are almost never used in snap-declarations and are instead mainly used in the base-declaration inside snapd to express more complex default behaviours, for example some interfaces should auto-connect only on classic but not on Core or vice versa, and having `deny-*` keys makes this simpler/easier to express, but when granting snap-declarations for brand store users, `allow-*` keys are almost always used so this document only covers allow-* keys below.

### allow-installation

The allow-installation key is the first key that is evaluated when the snap is being installed. If this evaluates to false, the snap cannot be installed if the interface plug or slot for which `allow-installation` evaluated to false exists in the snap.

`allow-installation` is not evaluated for interfaces which do not exist in the snap and thus do not affect installation. An example would be the snapd-control interface, which has in the base-declaration the static `allow-installation: false` rule for plugs:

```yaml
  snapd-control:
    allow-installation: false
    deny-auto-connection: true
```

If a snap does not plug snapd-control then this rule does not apply, but if the snap does declare a snapd-control plug and there are no other rules for this snap about snapd-control then snap installation will fail. To allow installation of such a snap, the snap-declaration must be edited such that allow-installation evaluates to true. 

Snap interfaces which have allow-installation set to false for their plugs in the base-declaration are said to be “super-privileged” meaning they cannot be used at all without a [snap-declaration assertion](/reference/assertions/snap-declaration).

### allow-connection

The `allow-connection` key is the next key to be evaluated, after the snap is allowed to be installed. 

This key will control whether a connection is permitted at all and usually is used to ensure that only “compatible” plugs and slots are connected to each other. A great example is the content interface, where the following (abbreviated) rule from the base-declaration is used to ensure that a candidate plug and slot content interface have matching content attribute values.

```yaml
slots:
  content:
    allow-connection:
      plug-attributes:
        content: $SLOT(content)
```

This can be read as `allow-connection` evaluating to true only when the plug has an attribute “content” and the value of the plug attribute is the same as the slot attribute “content” value. That is to say these plug and slots are compatible because content does not match for the plug and slot:

```yaml
slots:
  foo-content:
    interface: content
    content: specific-files

plugs:
  foo-content:
    interface: content
    content: specific-files
```
While the following plug and slots are not compatible:

```yaml
slots:
  foo-content:
    interface: content
    content: other-files

plugs:
  foo-content:
    interface: content
    content: specific-files
```

### allow-auto-connection

The`allow-auto-connection` key is the final key to consider when snapd is considering automatic connection of interface plugs and slots. 

If this key evaluates to true, then this plug/slot combination is considered a valid candidate for automatic connection. This is the most common key used when granting [snap-declaration assertions](/reference/assertions/snap-declaration) since many interfaces are not super-privileged, so they do not need `allow-installation` set in the assertion and they also do not have any `allow-connection` rules in the base-declaration, so the only thing that needs to be setup is `allow-auto-connection`.

## Example snap-declaration assertion

The following is an example `snap-declaration` assertion from the [modem-manager](https://snapcraft.io/modem-manager) snap:


``` text
type: snap-declaration
format: 1
authority-id: canonical
revision: 9
series: 16
snap-id: KtwxgRlwCAVKFw92BUdt1WloH1Va3QPo
plugs:
  modem-manager:
    allow-auto-connection: true
publisher-id: canonical
slots:
  modem-manager:
    allow-connection: true
snap-name: modem-manager
timestamp: 2016-10-25T15:35:43.646671Z
sign-key-sha3-384: BWDEoaqyr25nF5SNCvEv2v7QnM9QsfCc0PBMYD_i2NGSQ32EF2d4D0hqUel3m8ul

AcLBUgQAAQoABgUCWA970AAABF0QAMw+M28Rrm0m/3Gm5PYesQcQWKhGwmN0j3qfYG2LsSRiM0TU
j7K7hvCPc9v0P4sL6Ewv/CEZAkVxPYd9eUMqiyKYBRMp9QeiL7KW3RWdHok0FUN7ia7ZxcPlpKoM
uwV7qYDKktw/TJWX9bK15W6DnghlKtU464u7IqcHVmH2YzPBbcpJBuIhLHgYC2K5oj3ZvIjHqnV/
ELRDtwW3UTTkonycc2IUTCd10qu590z7DWzORWdts9ZARBJXfc3lohYkSd1v4wDYZHRO9RF/bJix
LBALp3kUR6X3OnLLJQAjVhIEY70B/5kLApuhrOpmi84Uawf+Uh91Ze++Bwatrw6QGw9cwkFgoLaj
9neiV4y6HvQh7gsgXap1XOZeOeWVMISgqaXGER78Lx6nc6/Loz8Yhjp4p9xi2Ia4j7fLpXMkWIU4
aoGudS1hQBsbeiNQvG6I+DraMN7xypMbOkGKwqNJ7prU63D3BmZiFl17ajT3SfffEO1/H6qqRVFS
A8X9HXVGPmI2TGst36cBgjdd9f+jj9ZqISKs8jdHfPKEpOBdH4wo1rodXO1y/GxZeP2Z710qep4t
8ynSRPi0l3boyM15D3IfnXMjLzUoace9vC6gltOHpW8GFPZvheQwknRvtfwRpZM2VsgaSw6cuz3+
7K/m9/Ff04A86/gvRlzduXIjEvKJ
```

