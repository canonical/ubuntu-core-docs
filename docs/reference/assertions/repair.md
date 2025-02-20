(reference-assertions-repair)=
# repair

A _repair assertion_ is a unique type of [assertion](/reference/assertions/index) that is designed to be a **last resort feature** to repair unresponsive Ubuntu Core devices. Such devices are connected to a network but are otherwise beyond what can be fixed with a regular snapd refresh.

Repair assertions:
- can only be issued by Canonical
- need to be requested by device manufacturers
- are not directly available to customers and device manufacturers
- are limited to specific models
- require close collaboration and oversight from Canonical
- are logged by devices to maintain a history of applied repair assertions
- are publicly visible, including their payloads, to help prevent harmful operations

A repair assertion will include a payload of _repair code_ to run via the assertion. This code should be as minimal as possible, and be just enough to make the regular snapd refresh update mechanism work again.

Repair code also needs to be idempotent and typically capable of checking for whether an issue exists, or could occur at a later point, such as with a potential future update.

The snap-repair process will retrieve and run repair assertions in sequence, executing one at a time. When running snap-repair after booting for the first time, a device will start from the beginning of the sequence.

See [Repair capability](https://forum.snapcraft.io/t/repair-capability-emergency-fixes/311) on the Snapcraft forum for discussions related to the development of this feature.

## Repair assertion fields

The following fields can be found in a repair assertion:

```yaml
type:              repair
authority-id:      <authority id>
brand-id:          <brand id>
summary:           <required summary of repair>
architectures:     <optional Debian architecture name>
series:            <optional series target>
models:            <one or more model identifier ids>
timestamp:         <UTC datetime>
disables:          <optional boolean to indicate retired or broken repairs>
body-length:       <size of the repair bundled with the assertion> 
repair-id:         <an increasing number starting from `1`>
sign-key-sha3-384: <encoded key id of signing key>
```

The primary key of the assertion is `(brand-id, repair-id)`.

- `repair-id` is initially defined as an increasing number starting from 1. </br> To fetch a repair assertion in the sequence, _snap-repair_ will perform a GET on
an HTTP repair URL that takes the same form as the assertion endpoints and the
current version of the mechanism will consider one sequence with brand-id
canonical, useful to repair any Core device.
- `summary` is mandatory and should concisely document what the repair addresses.
- `timestamp` is only for reference, signifying when the repair assertion was created.

There are no `since` or `until` values because a device's system clock cannot be trusted.

When optional series or architectures are omitted, all respective
devices will be targeted.

## Example assertion

The following is an example repair assertion used by the testing suite at Canonical:

```json	
{
  "headers": {
    "architectures": [
      "amd64"
    ],
    "authority-id": "canonical",
    "body-length": "106",
    "brand-id": "canonical",
    "models": [
      "vxj7EkYOlg15uAHRswTXIUpzWqO2sTBi/test-repairs-model"
    ],
    "repair-id": "1",
    "series": [
      "16"
    ],
    "sign-key-sha3-384": "Jn3lCtSUzgoDedt5PDuPH4HDphA_ULFNmwyIZWVggp2D1jhkv16dnATSMDDrFXzj",
    "summary": "Repair assertion for production test device that just echos",
    "timestamp": "2019-10-02T10:30:00Z",
    "type": "repair"
  }
}
```

