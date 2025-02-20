(explanation-stores-store-scoping)=
# Store scoping

_Store scoping_ is the inclusion of a [dedicated snap store](dedicated-snap-store) _`on-store`_ constraint linked to an [auto-connection](https://snapcraft.io/docs/auto-connection-mechanism) in the [snap-declaration assertion](/reference/assertions/snap-declaration), a file used to describe various snap properties.

Linking an auto-connection grant to a dedicated snap store limits the scope of an interface. This then safeguards against malicious attacks that might otherwise allow auto-connections to be made outside a dedicated snap store when a snap is installed on a generic device.
## Declaration syntax

Old versions of the snap-declaration assertion could only define auto-connections in a way that couldn't link connections to a dedicated snap store:

```yaml
type: snap-declaration
format: 1
authority-id: canonical
revision: 1
series: 16
snap-id: some-snap-id
plugs:
  snapd-control:
    allow-auto-connection: true
    allow-installation: true
publisher-id: some-account-id
snap-name: snap-name
timestamp: 2022-01-26T11:15:49.885580Z
sign-key-sha3-384: some-account-key
```

With the release of [snapd](https://snapcraft.io/docs/glossary#heading--snapd)  version _2.36_ in 2018, the snap-declaration assertion was updated to include a [dedicated snap store](dedicated-snap-store) definition for each granted interface:

```yaml
type: snap-declaration
format: 1
authority-id: canonical
revision: 2
series: 16
snap-id: some-snap-id
plugs:
  snapd-control:
    allow-auto-connection:
      on-store:
        - your-dedicated-snap-store
    allow-installation:
      on-store:
        - your-dedicated-snap-store
publisher-id: some-account-id
snap-name: snap-name
timestamp: 2022-01-26T11:15:49.885580Z
sign-key-sha3-384: some-account-key
```

The following shows the previous snap-declaration assertion updated to use the new dedicated snap store limits with _your-dedicated-snap-store_ as an example:

```yaml
Old version                         New version
                 
plugs:                              plugs:
  snapd-control:                      snapd-control:
    allow-auto-connection: true         allow-auto-connection:
    allow-installation: true              on-store:
                                           - your-dedicated-snap-store
                                        allow-installation:
                                          on-store:
                                           - your-dedicated-snap-store
```

Design limitations mean a snap can't be prevented from being installed, but linking an auto-connection to a dedicated snap store means any auto-connection can be prevented from happening.

The [Snap Store team](https://snapcraft.io/docs/permission-requests) admins can enable this feature with no action needed from the customer: the process includes generating new revisions for each snap-declaration assertion, for each snap, with special interface grants in the customer's dedicated snap store.

## Devices on shelves

The oldest version of snapd that supports snap-declaration store scoping is _2.36_.

If a customer has devices already flashed and sitting on shelves with a snapd version _2.36_ or newer, the addition of store scoping will be transparent to those devices when first booted. 

If a customer has devices on shelves flashed with a version of snapd _older_ than 2.36, they should also update autonomously, with snapd updating first before migrating the assertions to the newer formats. This assumes refreshing is correctly in place.

Lastly, if a customer has **existing** snaps that require **new** auto-connections in newer revisions, they should consider defining the [assumes attribute](https://snapcraft.io/docs/snapcraft-top-level-metadata#heading--assumes) in their snapcraft.yaml file. 

Pre-existing auto-connections in a pre store-scoped snap-declaration should not be affected because of the assertion format handling.

## Rolling back store scoping

In the unlikely event that enabling store scoping causes a customer to experience issues, the constraint can be disabled. It's possible for a snap to have a snap-declaration assertion revision with the `on-store` constraint and next one without, for example, and snapd will use the newer revision.

