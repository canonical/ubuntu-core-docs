(reference-assertions-account)=
# account

The _account_  [assertion](/reference/assertions/index) ties the name for an account in the snap universe to its [store](/explanation/stores/store-overview) identifier and provides the authority's confidence in the name's validity. It is generated on user creation by the store where it's maintained while the account exists.

Whenever a snap is installed, the account assertion linked to the owner of each snap is added to the system. To list account assertions present on a system, use the `snap known account` command.

## Account assertion fields

The following fields can be used in an account assertion:

``` text
type:              account
authority-id:      <authority account id>
revision:          <int>
account-id:        <account id>
display-name:      <friendly name for the account>
username:          <store user name or nick>
validation:        <unproven|certified>
timestamp:         <UTC datetime>
sign-key-sha3-384: <key id> # Encoded key id of signing key

<signature>                 # Encoded signature
```

The index for this assertion is the `account-id` and the fields are typically used in the following order:

- `validation` when set to `certified` means that the authority is confident in that the display name accurately describes the owner of the account while `unproven` means that no checks have been performed.
- `display-name` is a human-friendly name for the account-d, while username is an optional username associated with the account.
- `timestamp` contains the UTC formatted date and time that

See [Assertion format](/reference/assertions/index.md#assertion-format) for details on fields common to most assertions.

## Example assertion

The following is a typical account assertion:

``` json
type: account
authority-id: canonical
revision: 11
account-id: yBzXLuswoWh5b2gI8gxjziGARHLm64z
display-name: VideoLAN
timestamp: 2018-07-31T14:05:29.865155Z
username: videolan
validation: verified
sign-key-sha3-384: BWDEoaqyr25nF5SNCvEv2v7Qi2NGSQ32EF2d4D0hqUel3m8ul

AcLBUgQAAQoABgUCW2BsqgAAFCsQALkiVtqy0vwWbYXV+Pa3UrclKMDWjowgwdfvWfrbGkmBO13w
moMQiY0uRsONZB5fovG0EhGgL7wSR6Z9OAOCuv48xJMrRWKFXtRT7/B45hOOXEihgp419BAdVAbl
cUFh3ul/+EIQkSpXoRq9ChlA3QsbL6EszhD8ON4L58xauGotl/WbcwHqEoSGt9lURvSDTWWnW/rz
4IvKQsHF0paJ1YDcx+vNBZksaVBlltBswrquOqrA/lABenUuQdwRNYMckdyBb2rPHUG709luY1HA
jmcRTl2++1yzVmhXV16I0HnOuajZAbr7fUL4PpyylMr1+gl9pulk9rbUkMCyyAYC5fd3QP2A+Aoc
52+mPD8PDkTnDpS91q4m3k9NW0j2
```

