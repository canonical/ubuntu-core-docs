(explanation-remodelling)=
# Remodelling

The set of snaps that make up a device, and govern its capabilities, are controlled by the [model assertion](/reference/assertions/model), alongside the snap assertions in a given recovery system.

The model assertion contains:

* Identification information, such as brand account id and model name.
* Which essential snaps make up the device system, including the gadget snap, kernel snap and the boot base snap with the root filesystem.
* Other required or optional snaps that implement the device functionality.
* Additional options for the defined device, such as grade.

When one or more of the above elements change, the updated model assertion and its associated image are deployed to the device, authenticated and linked through its serial assertion, to the store. This process is called remodelling.

One example of remodelling is [Upgrading Ubuntu Core](/how-to-guides/manage-ubuntu-core/upgrade-ubuntu-core.md).
## Remodelling viability

The remodelling process is triggered by either updating the model assertion, running the `snap remodel` command, or from the [snapd the REST API](https://snapcraft.io/docs/snapd-api) (the last two require _snapd 2.61_ or later). Remodelling triggers the generation of a new recovery system, which means care needs to be taken to ensure the [ubuntu-seed](/explanation/core-elements/storage-layout.md#ubuntu-seed) partition is sized accordingly.

Remodelling is the responsibility of the snap daemon (_snapd_) running on the device. It both mediates the update process and the re-registration of the device after the update (if required). But the complexity and viability of the remodelling process is dependent on several factors outside of snapd’s control.

At its simplest, a device can be successfully remodelled when using the same model name and the same dedicated Snap Store but with a new model revision where the only difference is an added or removed snap, or changed snap track or channel. The device also needs to have a [Serial assertion](/reference/assertions/serial).

But if the dedicated Snap Store needs to change, even under the same brand scope, this requires the acquisition of a new serial assertion, and the success or failure of such a process will depend on the context.

With a dedicated Snap Store, the following types of remodelling contexts are possible:
- **same brand/model -> same dedicated Snap Store**
Works as a simple contextual carrier for the new model.
- **same brand/model -> different dedicated Snap Store**
Keeps access to the device state kept on the remodel change, creates a store that uses that state, and then refers to the new dedicated Snap Store. Requires a new serial in the [Serial Vault](https://ubuntu.com/core/services/guide/serial-vault-overview) and the creation of a new  [Serial assertion](/reference/assertions/serial).

## Compatibility

The below permutations of the remodelling contexts are all valid:

| brand | store | model name | + snaps | - snaps |
| :-- | :-- | :-- | :-- | :-- | 
| same | same | same | yes | yes |
| same | same | different | yes | yes | 
| same | different | same | yes | yes | 
| same | different | different | yes | yes | 

If a [validation set](https://snapcraft.io/docs/validation-sets) has been defined for the old model and the new model, or just the new model, the snaps installed during the remodelling process must follow the validation set rules.

## Snap removal

The remodelling process does not automatically remove snaps which are no longer marked as `required` or `optional` in the new model assertion. Those snaps stay in the system and keep receiving updates, but since they are no longer required by the model, it is possible to remove them.

The general practice is that either the operator who invoked `snap remodel` command, or the management agent which started the remodel process, is responsible for requesting removal of said snaps. If snap data is no longer needed, the remove request should include the `purge` option to remove all data associated with the removed snap.

## Offline remodelling

A network connection is not required if there is local access to:

- **the target [Model assertion](/reference/assertions/model) with a new revision**</br>The `series`, `brand-id`, and `model` fields cannot currently be different from the original model.
- **assertions for any referenced snaps**</br> This includes [snap-declaration](/reference/assertions/snap-declaration) and [snap-revision](/reference/assertions/snap-revision) assertions and the keys necessary for validation of the former.

The `snap remodel` command can then be used to list the required snaps and assertions for the new model:

```bash
snap remodel --snap kernel.snap --assertion kernel.assert \
--snap pc.snap --assertion pc.assert my-new-model
```

This works even when a new base has been installed, such as `core22` on a `core20` system, for instance. 

If a snap or assertion is not available locally, either referenced directly from the command line or cached on the system in `/var/lib/snapd/snaps`, then the remodel procedure will fail unless the `--offline` flag is added to the `snap remodel` command.

### Offline with `--offline`

From snapd 2.61.2 onwards, the `snap remodel` command includes an optional `--offline` flag.

The `--offline` flag forces snapd to perform the requested remodel process without requiring a network connection, regardless of whether the specified snaps are available locally or not.

This impacts models using new channels and updated validation sets:

-  Channel switching

   If an offline remodel with `--offline` requests a snap to switch channels, the channel will be changed without refreshing the snap. The snap will be refreshed to the new channel with either the next manual refresh or the next auto-refresh.

-  Validation sets

   If a model includes a [validation set](https://snapcraft.io/docs/validation-sets) that constrains any snaps in the model to specific revisions, an offline remodel requires that either the correct revision of the snap is provided with the `--snap` flag, or it must already be installed. An offline remodel will fail if the remodelling process cannot find a revision that is required by any of the new model’s validation sets.

