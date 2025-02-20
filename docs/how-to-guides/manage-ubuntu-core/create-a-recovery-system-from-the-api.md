(how-to-guides-manage-ubuntu-core-create-a-recovery-system-from-the-api)=
# Create a recovery system from the API

An [Ubuntu Core image](/tutorials/build-your-first-image/index) contains a recovery system created from the snaps listed in the model. This recovery system is used by a [Recovery mode](/explanation/recovery-modes) to restore a system  to the state at which the image was created.

One issue with this approach is that there may be snaps included in the recovery system that have since received security updates. This will have been updated automatically in the running system, but not in the image-based recovery system. 

To resolve this, the recovery system [snapd REST API](https://snapcraft.io/docs/snapd-api#heading--systems-gethttps://snapcraft.io/docs/snapd-api#heading--systems-get) enables users to create new recovery systems with snaps that are constrained by a set of [validation-sets assertions](/reference/assertions/validation-set).

This is specifically useful for ensuring that a recovery system is built from a set of snaps with well known revisions.

## Recovery system snaps

Any recovery system created using the API is derived from a device’s current [model](/reference/assertions/model). Each required snap in the model will be a part of any newly created recovery system. Optional snaps in the model will be included if the snap is already installed, or if the snap is required by any validation sets that are provided.

### Validation sets

Snaps within a new recovery system will follow whatever constraints may be defined by any provided [validation sets](https://snapcraft.io/docs/validation-sets). Additionally, because a model can reference validation sets, those validation sets will also be considered.

- Validation sets in the model that are marked `enforce` will be enforced.
- Validation sets in the model marked as `prefer-enforce` will be enforced only if they have not been explicitly forgotten. If any validation sets (either explicitly provided or from the model) are in conflict with each other, then the API will refuse to create a new recovery system.

## Using the API

To create a recovery system, a POST request is made to /v2/systems with the action set to `create`. The new system will be created with the provided label.

### JSON-based

Example POST to `/v2/systems`:


```json
{
  "action": "create",
  "label": "some-label",
  "test-system": false,
  "mark-default": false,
  "validation-sets": ["id1/validation-set1=2", "id2/validation-set2"],
  "offline": false,
}
```

If “test-system” is set to true, then the recovery system will be tested for validity. This involves rebooting the system into the newly created recovery system.

If “mark-default” is set to true, then the recovery system will be marked as the default recovery system. The default recovery system is used as the default system when using the “snap reboot” command with the “--recover”, “--factory-reset”, and “--install” flags. The current default recovery system can be seen by listing the recovery systems with the “snap recovery” command. 

Note the distinction between the most recently seeded system (which is denoted by “current”) and the default system (which is denoted by “default-recovery”).

Validation sets are provided as a list of strings. Each string is in the format of “<account-id>/<validation-set-name>=<sequence-number>”. The sequence number is optional. If the sequence number is not provided, then the latest validation set in the sequence will be used.

The “offline” field is used to force snapd to create a recovery system without reaching out to the store. This means that all snaps and assertions that are needed to create the system must already be installed on the system. To create a recovery system from locally provided snaps/assertions that are not already installed, see _Form-based_ usage below.

### Form-based

Similar to [offline remodelling](/explanation/remodelling.md#offline-remodelling) API, an offline/form-based recovery system API variant enables users to create recovery systems from a set of snaps and assertions that are provided locally.

When using the offline API, snaps and assertions must either be provided via the API, or they must already be installed on the system. The API will not reach out to the store to fetch any missing snaps or assertions.

The offline variant of the API expects “multipart/form-data” as the content type. Here is an example, using curl:

```bash
curl -X POST --unix-socket /run/snapd.socket \
  -F 'action=create' \
  -F 'label=new-system' \
  -F 'test-system=true' \
  -F 'mark-default=true' \
  -F 'validation-sets=account-id/set-name=1' \
  -F 'assertion=<validation-set.assert' \
  -F 'assertion=<pc.assert' \
  -F 'snap=@pc.snap' \
  -F 'assertion=<pc-kernel.assert' \
  -F 'snap=@pc-kernel.snap' \
  http://localhost/v2/systems
```

In this example, “validation-set.assert”, “pc.assert”, “pc-kernel.assert”, “pc.snap”, and “pc-kernel.snap” are all files on the local system. Note that the “assertion” field expects the literal string contents to be the value of the field. The “snap” field is processed as an HTTP form file upload.

## Removing API Usage

Recovery systems can be removed by using the remove API. Note that the “current” system, the default recovery system, and the last recovery system cannot be removed.

Example POST to /v2/system/<label>:

```json
{
  "action": "remove"
}
```

