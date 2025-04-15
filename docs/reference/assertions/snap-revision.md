(reference-assertions-snap-revision)=
# snap-revision

The _snap-revision_ [assertion](/reference/assertions/index) is a statement by the [store](/explanation/stores/store-overview) acknowledging the receipt of a snap build and labelling it with a snap [revision](https://snapcraft.io/docs/glossary#heading--revision). 

Alongside [account](/reference/assertions/account), [snap-declaration](/reference/assertions/snap-declaration) and [account-key-assertion](/reference/assertions/account-key) assertions,  snap-revision_ is bundled within the composite `.assert` file that accompanies a snap downloaded with the `snap download <snap-name>` command.

## Snap-revision assertion fields

The assertion format is as follows:

```yaml
type:              snap-revision
authority-id:      <authority account id>
snap-sha3-384:     <sha3-384 digest as url-safe unpadded base64>
developer-id:      <developer account id>
snap-id:           <snap-id>
snap-revision:     <int>
snap-size:         <int>
timestamp:         <UTC datetime>
sign-key-sha3-384: <key id> # Encoded key id of signing key

<signature>                 # Encoded signature
```

The index is the digest of the snap blob, `snap-sha3-384`. The store returns the `revision` assigned to the uploaded snap along other data.

See [Assertion format](/reference/assertions/index.md#assertion-format) for more details on fields common to most assertions.

## Example assertion

The following is an example `snap-revision` assertion:

```yaml
type: snap-revision
authority-id: canonical
snap-sha3-384: F5gwZqB3EBPQ62fhu2CL65TPNdyLbxCVdsxEReYrnp5sNu2z2BXAjdk_BRfUKJgV
developer-id: canonical
snap-id: RmBXKl6HO6YOC2DE4G2q1JzWImC04EUy
snap-revision: 44
snap-size: 5234688
timestamp: 2016-11-03T10:39:25.624109Z
sign-key-sha3-384: BWDEoaqyr25nF5SNCvEv2v7QnM9QsfCc0PBMYD_i2NGSQ32EF2d4D0hqUel3m8ul

AcLBUgQAAQoABgUCWBsT3QAA/JgQAH+XrRnxFLFzCHVXF5B6yKbj1e5M2YTUXZ3XLHp+eGU93t+h
54UxBwgSKX/Wb1MliOpWG7IuhIw0WsUzM/Ynq5Ixhmf/f8E5p7hP9JJU6+UJaJCnnLtmRLG3x6Y7
YmYIPGEvhn8VuznuTCyqyqRdiiu3U1aKecMyKRdKQvfDdJV4XveTuWlCuHjHplJ/apApyZQDCA/O
Qr6grtz/Ud1bR9ThR0KISTuRhE/2qFOuNCVTHU2lFYGrECF0vJYo42tW2R85ZdsOpdVngAMUAJOZ
REZKML9cgnJqIDwuZ4DNl+684p71+mNeQtbg2608F8fiK2jFJa8mHY5kxhzFGrIPVXEVmPTRlc0Q
dPdViCOeg4jOuCybKQ/DrzE7Vjqhgl6UbKX2JtLbSxwBuB65YijCTVbqZD+u58ek9N9Z6ZKrJz2o
HXq6RZqTpkCagV3FIxRRGhBDWQCePY4tRNEj9+3u31Af9daswRlmrFXwWDf46KPKx+fJ9jPECknO
s+jQ5ij3fpMfWOzceHHLhIDm9Wj7sypD+63v4KDaXzQ+8dM/acMraNAJHRvCOr7bvFz9j7OEqr7y
/6/QMZdkeYO94e1OPB5e+Dya95oCVqJhf05BAIKOn933EjGT3Vnm7HT+EzCvLUbbjMPlJ6ZyNnp/
lE+8N8EQWmdLC+OwJRNHgucjvcaR
```
