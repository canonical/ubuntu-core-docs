(explanation-remodelling)=
# Remodelling

The set of snaps that make up a device, and govern its capabilities, are controlled by the [model assertion](/reference/assertions/model), alongside the snap assertions in a given recovery system.

The model assertion contains:

* Identification information, such as brand account id and model name.
* Which essential snaps make up the device system, including the gadget snap, kernel snap and the boot base snap with the root filesystem.
* Other required or optional snaps that implement the device functionality.
* Additional options for the defined device, such as grade, and the store it is connected to.

The snaps declared in the model assertion can be [updated](/explanation/refresh-control) during the device lifecycle. However, when the system must be [upgraded](/how-to-guides/manage-ubuntu-core/upgrade-ubuntu-core.md), or when one or more of the above elements change, a new model assertion can be deployed to the device. The updated model assertion is authenticated and linked through its serial assertion to the store. The image is upgraded based on the delta compared to the previous model. This process is called remodelling.

## Remodelling viability

After a model assertion has been updated, the remodelling process is triggered from either the [snapd's REST API](https://snapcraft.io/docs/snapd-api), or by running the `snap remodel` command.

Remodelling can never downgrade the system's base snap. For example, remodelling from `core22` to `core20` is not supported.

```bash
sudo snap remodel <new-model.assert>
```

Both methods need an updated [model assertion](/reference/assertions/model) as input. Its `revision` field must be incremented, and it must be signed using a key registered to the same brand that signed the original model. If it differs from the key used to sign the original model, an account-key assertion must be registered on the device before proceeding with the remodelling.

```bash
snap known account-key --remote public-key-sha3-384=<digest> > key.assert
snap ack key.assert
```

Remodelling triggers the generation of a new recovery system, which means care needs to be taken to ensure the [ubuntu-seed](/explanation/core-elements/storage-layout.md#the-ubuntu-seed-partition) partition is sized accordingly. The process also ensures the newly created recovery system is valid. Therefore, the previous recovery system can be safely removed after remodelling has completed. An [API call](/how-to-guides/manage-ubuntu-core/create-a-recovery-system-from-the-api.md/#removing-api-usage) is available to perform this removal.

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

To ensure the remodelling process completes successfully when a device's model name changes, a specific configuration is required in the [Serial Vault](https://canonical-serial-vault.readthedocs-hosted.com/serial-vault/register-a-new-device-model-name/), under the `Sub-Store Models` tab, to specify the allowed migration path from the old to new model name.

For details on how changes to the base, kernel, gadget and snapd snaps are managed, see [Remodel essential snaps](remodel-essential-snaps).

### Gadget snap

In the new model definition, the gadget snap can be kept identical to the previous model, or modified with any combination of the following items:

* modification of the gadget snap name and associated ID
* modification of the channel

If the [model base](/reference/assertions/model.md/#model-assertion-fields) changes, the gadget snap must be modified, and its base must match that of the new model.
The gadget's default settings are not applied when remodelling, these are used only when the device is [(re)installed](/explanation/recovery-modes.md/#install-mode). See [gadget snap](/reference/gadget-snap-format.md/#the-gadget-yaml-file) for further information.

Restrictions and limitations specific to the gadget:

* Remodelling will never repartition the disk. Thus, the current partitions' size and starting offsets must fall within the ranges permitted by the new gadget.
* The current bootloader must match the bootloader defined by the new gadget.

### Kernel snap

The kernel snap can also be kept as-is, or modified with any combination of the following items:

* modification of the kernel snap name and associated ID
* modification of the channel

The build-base of the new kernel snap should be aligned with the base defined in the updated [model assertion](/reference/assertions/model).
Ubuntu Core only supports kernel snaps built from LTS releases. Refer to [Release Notes](/reference/release-notes.md/#release-policy-and-schedule) for details on Ubuntu Core versioning.

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
