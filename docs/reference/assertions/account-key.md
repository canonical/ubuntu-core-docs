(reference-assertions-account-key)=
# account-key

The *account-key* [assertion](/reference/assertions/index) holds a public key belonging to an [account](/reference/assertions/account).

This assertion is used to transmit key information between the [store](/explanation/stores/store-overview) and _snapd_, enabling the latter to validate assertions signed by the key owner.

Alongside [account](/reference/assertions/account), [snap-declaration](/reference/assertions/snap-declaration) and [snap-revision](/reference/assertions/snap-revision) assertions,  _account-key_ is bundled within the composite `.assert` file that accompanies a snap downloaded with the `snap download <snap-name>` command.

The `make-system-user` snap can is used to create a composite assertion file which includes all of the required assertions needed to trigger automatic creation of a user account via an inserted USB drive containing this file. See [make-system-user](/how-to-guides/manage-ubuntu-core/add-a-system-user) for more details.

## Account-key assertion fields

The following fields can be used in an account-key user assertion:

``` text
type:                account-key
authority-id:        <authority account id>
revision:            <int>
public-key-sha3-384: <key id/sha3-384 digest of the key>
account-id:          <account id>
name:                <human readable key name>
since:               <UTC datetime>
until:               <UTC datetime>
sign-key-sha3-384:   <key id> # Encoded key id of signing key

BODY: base64 encoded version prefixed public key packet

<signature>                 # Encoded signature
```

The index for this assertion is `public-key-sha3-384`. The key is valid in the time interval specified by `since` and `until`, being valid forever if  the optional`until` is undefined.

- `public-key-sha3-384` is the SHA3-384 hash of the (decoded) body content. The body itself is a format version byte (`0x1` for now) followed by the public key packet itself. The version 1 public key packet is a constrained/normalised RFC4880 public key packet (v4, new header format, algorithm fixed to RSA, timestamp fixed as well).

  The digest of the public key (`public-key-sha3-384`) is used for the lookup of keys when verifying signatures: all assertions reference their signing key by providing this digest in a `sign-key-sha3-384` header.
- `since` and `until` are required when a password is embedded within the assertion. They define the *from date* and the *to date* for they key’s validity. They need to be in UTC.

In addition to the signature validation that's performed for all assertions, it's essential for the account-key assertion that the digest of the public key matches the assertion body.

See [Assertion format](/reference/assertions/index.md#assertion-format) for more details on fields common to most assertions.

## Example assertion

The following is Canonical's public key for the store:

``` text
type: account-key
authority-id: canonical
revision: 2
public-key-sha3-384: BWDEoaqyr25nF5SNCvEv2v7QnM9QsfCc0PBMYD_i2NGSQ32EF2d4D0hqUel3m8ul
account-id: canonical
name: store
since: 2016-04-01T00:00:00.0Z
body-length: 717
sign-key-sha3-384: -CvQKAwRQ5h3Ffn10FILJoEZUXOv6km9FwA80-Rcj-f-6jadQ89VRswHNiEB9Lxk

AcbBTQRWhcGAARAA0KKYYQWuHOrsFVi4p4l7ZzSvX7kLgJFFeFgOkzdWKBTHEnsMKjl5mefFe9ji
qe8NlmJdfY7BenP7XeBtwKp700H/t9lLrZbpTNAPHXYxEWFJp5bPqIcJYBZ+29oLVLN1Tc5X482R
[...]
```

