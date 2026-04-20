---
myst:
  html_meta:
    description: Hardware-identity assertion reference. Binds devices to unique hardware identity keys for device registration.
---

(reference-assertions-hardware-identity)=
# hardware-identity


The _hardware-identity_ [assertion](/reference/assertions/index) binds a device to its unique hardware identity public key.

Ubuntu Core and SnapD support Secure Device Registration to ensure that only authorised devices can obtain a serial assertion. During manufacturing, each device is provisioned with a unique key pair that remains unchanged throughout its lifecycle, serving as its root identity.

The hardware-identity assertion contains the public portion of this key and is issued with the device. When presented to the Model Service, it allows the service to verify that a serial assertion request genuinely originates from that device.

Unlike the serial assertion, the hardware-identity assertion can be shared with the Model Service before registration and is only used to confirm the device's unique identity. It is not required after registration is complete.

The exact cryptographic implementation for Secure Registration may vary depending on the device's hardware and software capabilities. Details are described in the [gadget snap](/reference/gadget-snap-format) documentation.

## Fields

The following fields can be used in a hardware-identity assertion:

```yaml
type:                     hardware-identity
authority-id:             <authority account id>
issuer-id:                <issuer-id>
manufacturer:             <manufacturer>
hardware-name:            <hardware-name>
hardware-id:              <hardware-id for the device>
hardware-id-key:          <public key and type>
hardware-id-key-sha3-384: <digest of the device key>
timestamp:                <UTC datetime>
sign-key-sha3-384:        <key id> # Encoded key id of signing key

<signature>                 # Encoded signature
```

The index is the tuple \<`issuer-id', `hardware-id-key-sha3-384`\>.

This assertion must be signed by the issuer. See [Assertion format](/reference/assertions/index) for more details on fields common to most assertions.

## Example assertion

This example was extracted from a kvm Ubuntu Core instance with `sudo snap known serial`:

```yaml
type: hardware-id
authority-id: canonical
issuer-id: myhardwaredevices
manufacturer: myhardwaredevices
hardware-name: my-devboard-v3
hardware-id:  my-hw-dev-3-0653
hardware-id-key:
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqGSa+XTdfa0ix0e7HaIAfNbRk7SYEF4o
    +1Xlr6XQQUKPstTchh+/Snv6dfV0O4M2yOpmm9xPu2VH+nePEAWhE/gxSA1dCDlb2BHR4mMw0odT
    7/Y4fnGpThrTYWgMQmM/F99elPvTbQxpBDWWajvmBxAuJHZ6vuEbtn68DBhx41mSKLtPLPSk91nd
    QWzw1M9aooOl0yYrr4p4am+Yh9GuApMmHXRwX+BdDyg3I9dnp2kiCXveDGJ9G86AjG5NRo38uoPl
    D0MNldHyS/cD7bRC4LYpL0R4LuEtXeUWi/VQYiWu1PgIGlj6Zuz6svLRZA03Fei2tl+EnlBbpl8s
    Rb0x7QIDAQAB
hardware-id-key-sha3-384: 3ln0lMND7N2KgUVnNebvABm3YL_SYIqZ4jCcchri97SAsDblrR9Gq7Duk1gG7Fqc
timestamp: 2026-11-08T18:16:12.977431Z
sign-key-sha3-384: BWDEoaqyr25nF5SNCvEv2v7QnM9QsfCc0PBMYD_i2NGSQ32EF2d4D0hqUel3m8ul

AcLBUgQAAQoABgUCWCIWcgAARegQAB4/UsBpzqLOYOpmR/j9BX5XNyEWxOWgFg5QLaY+0bIz/nbU
avFH4EwV7YKQxX5nGmt7vfFoUPsRrWO4E6RtXQ1x5kYr8sSltLIYEkUjHO7sqB6gzomQYkMnS2fI
xOZwJs9ev2sCnqr9pwPC8MDS5KW5iwXYvdBP1CIwNfQO48Ys8SC9MdYH0t3DbnuG/w+EceOIyI3o
ilkB427DiueGwlBpjNRSE4B8cvglXW9rcYW72bnNs1DSnCq8tNHHybBtOYm/Y/jmk7UGXwqYUGQQ
Iwu1W+SgloJdXLLgM80bPzLy+cYiIe1W1FSMzVdOforTkG5mVFHTL/0l4eceWequfcxU3DW9ggcN
YJx8MPW9ab5gPibx8FeVb6cMWEvm8S7wXIRSff/bkHMhpjAagp+A6dyYsuUwPXFxCvHSpT0vUwFS
CCPHkPUwj54GjKAGEkKMx+s0psQ3V+fcZgW5TBxk/+J83S/+6AiQ06W8rkabWCRyl2fX81vMBynQ
nu147uRGWTXfa31Mys9lAGNHMtEcMmA106f2XfATqNK99GlIIjOxqEe5zH3j51JtY+5kyJd9cqvl
Pb0rZnPySeGxnV4Q2403As67AJrIExRrcrK2yXZjEW3G2zTsFNzBSSZr0U8id1UJ/EZLB/em2EHw
D2FXTwfDiwGroHYUFAEu1DkHx7Sy
```

