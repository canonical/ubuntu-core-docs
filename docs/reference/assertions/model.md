(reference-assertions-model)=
# model

The model assertion is a text-based document that contains the fundamental definition of a snap-based device. It describes what the system image includes and is signed by the brand account owning the device definition.

The model assertion contains:

* Identification information, such as brand account id and model name.
* Which essential snaps make up the device system, including the gadget snap, kernel snap and the boot base snap with the root filesystem.
* Other required or optional snaps that implement the device functionality.
* Additional options for the defined device, such as grade for a UC20+ device.

The model assertion is central to both the creation of the device image and the deployed device’s lifecycle, in particular it:

* drives image creation via [ubuntu-image](https://snapcraft.io/ubuntu-image). The resultant system seed includes the set of snaps and assertions specified in the model assertion.
* allows first boot verification of the system seed before its snaps are turned into an installed system.
* conveys model information, through registration from either the factory or in the field, which is used for cross-checking and registration affecting options, such as which account can issue a serial assertion for the device.

For more details on using a model assertion to create an image, see [Custom images](/how-to-guides/image-creation/add-custom-snaps).

Model assertions for supported devices and systems can be found at [https://github.com/snapcore/models/tree/master](https://github.com/snapcore/models/tree/master).

## Model assertion fields

The following fields can be used in a model assertion:

``` text
type:                  model
architecture           <debian architecture name>
authority-id:          <authority account id>
base:                  <string>
brand-id               <account id>
classic                <true|false>   # Optional
components:            <list[dict]>   # Optional, see below for details
display-name           <descriptive string>
grade:                 <string>
model                  <model id>
required-snaps         <string>
revision:              <int>
serial-authority       <list<string>> # Optional
series                 <string>
sign-key-sha3-384:     <key id>       # Encoded key id of signing key
snaps:                 <list[dict]>   # See below for details
store                  <string>       # Optional
storage-safety         <string>       # Optional
system-user-authority  <string>       # Optional
timestamp              <UTC datetime>
validation-sets        <list[dict]>   # Optional, see below for details
```

The index for this assertion is the tuple \<`series`, `brand-id`, `model`\> and the fields are typically used in the following order:

- `series` allows the brand to define which release of the platform the device uses. “rolling” is the name of the development series that bridges stable series, which have names like “16” or “18”.

- `authority-id` and `brand-id` fields define the authority signing the assertion. Reference assertions are signed by Canonical and non-reference assertions are signed by their [brand store](/explanation/stores/store-overview). For a custom model assertion, this needs to be the developer ID.

 - `model` is a string that identifies a set of devices as desired by the brand.

- `architecture` is the Debian architecture name, such as `amd64`.

- `storage-safety` is used to request that Ubuntu Core installs with or without [full disk encryption](/explanation/full-disk-encryption). It can be omitted or one of either:
   * `prefer-unencrypted`: do not encrypt by default, even if the device supports encryption.
   * `prefer-encrypted`: do encrypt if the hardware supports it.
   * `encrypted`: ensure encryption is used and fail if the device does not support it.

- `system-user-authority` is used to list a set of account IDs that are authorised to sign system user assertions for any image built with the assertion. See [Specifying system-user-authority](/how-to-guides/manage-ubuntu-core/add-a-system-user.md#-specifying-system-user-authority) for more details.

- `timestamp` can be generated with the ` date -Iseconds --utc` command.

- `base` provides the run-time environment. See [Base snaps](https://snapcraft.io/docs/base-snaps) for more details.

- `grade` sets the constraints for the device. It can be one of the following:
   * `dangerous`: relax some of the constraints here (mandatory snap id for example), and should allow for the use of unasserted snaps, devmode snaps, or the presence of extra snaps in the recovery system.
Using _dangerous_ does weaken security, and as a result, this grade is meant only for development purposes. For example,  you could define a _my-device-devel_ or _my-device-dangerous_ model for development images in parallel to a _my-device_ model for production.
   * `signed` *(default)*: no unasserted (unsigned) snaps or snaps not mentioned in the model can appear or be used in the recovery system.
   * `secured`: same properties as signed plus it is mandatory for the device to use full disk encryption and secure boot.

- `serial-authority` (optional) list of serial authorities. Use `["generic"]` to request a serial generated by the Snap Store.

- `classic` (optional) is a flag that tells us if this is an all-snap system (false) or not (true). If not set, `architecture`, `gadget`, and `kernel` are mandatory. If set, `kernel` is forbidden and `architecture` and `gadget` are optional. If not present, an all-snap system is assumed.

- `store` (optional) header specifies a particular branded virtual store to be used for this model. The store in question has custom content specific to that model, curated by that brand, and managed by the store owner or the relevant brand. Each model knows which store it needs to speak to in order to get the appropriate content. If left out the device defaults to use the main Ubuntu store.

- `snaps` lists the snap package to include in the image. “pc”, “pc-kernel”, “core<number>” and “snapd” are all required for a functioning device. Optional additional snaps can also be listed. It consists of the following keywords and mappings:
  * `name` *(mandatory)*: name of the snap. Cross-checked at image build time but ignored later.
  * `type` *(mandatory)*: type of the snap, needs to be either: `base|gadget|kernel|app|core`. *app* is the default.
  * `id` *(optional)*: id of the snap if assigned by a store. Must be omitted for local snaps.
  * `modes` *(optional)*: a list with [recovery modes](/how-to-guides/manage-ubuntu-core/use-a-recovery-mode) (verbs, “run”) or mode aliases for which the snap needs to be installed ("ephemeral", for _recover_ and _install_ modes).
Default is *[run]* which should not be used for types `kernel|gadget` and for the snap indicated by the “base” header.
For "recovery" and "install" modes, "ephemeral" can be used. This will install the snaps only while the system is in an ephemeral state (running from tmpfs). They will not be installed on *ubuntu-data* unless explicitly declared, such as with `[run, ephemeral]`, although those snaps will still reside on *ubuntu-seed*.
  * `presence` *(optional)*:  set to mark a snap whose absence will not fail installation or recovery. Can be either _optional_ or _required_ but defaults to _required_. 
    * A _required_ snap cannot be removed from the system.    
    * An _optional_ snap is not added to the [ubuntu-seed](/explanation/core-elements/storage-layout) partition when the image is created with [ubuntu-image](/how-to-guides/image-creation/use-ubuntu-image) unless the `--snap` option is used to add the snap explicitly. Optional snaps can be used to adapt the same base model for different hardware configurations, deployment objectives, and for use with a dynamic modelling agent. 
  * `default-channel` *(optional)*: initial tracking channel for the snap, default is “latest/stable”.

### Components

A [component](/) is part of a snap that has been declared as optional. Models need to specify which snap components should be included in an image as they are not installed by default. 

They're added as a structured list with a single `presence` attribute for whether each component is required or options. If required, the component must be in the image seed.

The modes for which the component must be present can be specified as well. Syntax is as follows:

```yaml
    components:                                 # optional
      <component-name-1>:
        presence: "optional"|"required"
        modes: [<mode-specifier>]               # list of modes, optional 
	                                            # must be a subset of snap one
                                                # defaults to the same modes
                                                # as the snap
      <component-name-2>: "required"|"optional" # presence, shortcut
	                                            # syntax
```

### Validation sets

- `validation-sets` (optional, from _snapd 2.60_ onwards) list specific snaps that are either required to be installed together or are permitted to be installed together on a device or system.
  * `account-id` (optional): if not set, the account-id is taken from the model itself.
  * `sequence` (optional): the sequence number for the validation set.
    - If a sequence _is_ specified, then **only** that sequence is permitted for the lifetime of the device.
    - If the sequence _is not_ specified, the latest sequence will be fetched and applied when building the image. This sequence is then permitted to be switched at any time during the lifetime of the device.
  * `enforce` means that the validation-set will be enforced for the lifetime of the device.
  * `prefer-enforce` initially enforces the validation-set before permitting it to be forgotten.

   The following is a sample _validation-sets_ declaration:
   ```yaml
    "validation-sets": [
        {
           "account-id": <account-id>,
            "name": <name of validation-set>,
            "sequence": <sequence>,
            "mode": <"enforce"|"prefer-enforce" >,
        },
    ],
    ```
    For more information, see [Validation sets](https://snapcraft.io/docs/validation-sets) and [`core-20.json`](https://github.com/snapcore/snapd/blob/master/tests/main/prepare-image-validation-sets/asserts/core-20.json) for a test model assertion defining a validation set.

---

See [Assertion format](/reference/assertions/index.md#assertion-format) for details on fields common to most assertions.

## Example assertion

The following is a JSON input for an example Ubuntu Core model assertion based on `ubuntu-core-22-amd64`:

``` yaml
{
    "type": "model",
    "series": "16",
    "model": "ubuntu-core-22-amd64",
    "architecture": "amd64",
    "authority-id": "bJzr2XzZg6Qv6Z53HIeziXyxtn1XItIq",
    "brand-id": "bJzr2XzZg6Qv6Z53HIeziXyxtn1XItIq",
    "timestamp": "2022-04-04T10:40:41+00:00",
    "base": "core22",
    "grade": "dangerous",
    "snaps": [
        {
            "name": "pc",
            "type": "gadget",
            "default-channel": "22/stable",
            "id": "UqFziVZDHLSyO3TqSWgNBoAdHbLI4dAH"
        },
        {
            "name": "pc-kernel",
            "type": "kernel",
            "default-channel": "22/stable",
            "id": "pYVQrBcKmBa0mZ4CCN7ExT6jH8rY1hza"
        },
        {
            "name": "core22",
            "type": "base",
            "default-channel": "latest/stable",
            "id": "amcUKQILKXHHTlmSa7NMdnXSx02dNeeT"
        },
        {
            "name": "snapd",
            "type": "snapd",
            "default-channel": "latest/stable",
            "id": "PMrrV4ml8uWuEUDBT8dSGnKUYbevVhc4"
        }
    ]
}
```

