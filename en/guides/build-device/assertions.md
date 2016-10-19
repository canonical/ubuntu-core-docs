---
title: Assertions
---

# Assertions

Assertions are digitally signed documents that express a fact or policy by a particular authority about a particular object in the snap universe. An assertion consists of a set of structured headers, which vary based on the type of assertion, an optional body (variable format, depends on type of assertion) and the signature.

Assertions are intended to be understandable by human inspection, although full validation requires the use of provided tooling.

The typical format of an assertion, with common headers, is as follows:

```
type:          <type>       # For example, “account” or “model”
authority-id:  <account id> # On whose authority this assertion is made
<key field 1>: <value>      # Fields identifying the object of the assertion
...
<key field N>: <value>
<other field>: <value>
...
revision: <int>             # Assertions can be updated with a higher revision
sign-key-sha3-384: <key id> # Encoded key id of signing key

<body>                      # Optional type-dependent body

<signature>                 # Encoded signature
```

Every assertion will have a `type` and `sign-key-sha3-384`, as well as a signature, and most will have an `authority-id`. Values may be scalars (strings, integers, booleans), lists, or maps. Some of the headers play the role of an index, which uniquely specifies the context of this assertion given the type. Most assertions will also have a revision which enables a particular assertion to be updated by issuing another assertion of the same type and index with a higher revision. Given a particular type and index, there is only one “latest” valid assertion that properly determines policy for a system - the one with the highest revision. For a given assertion the index headers must all be defined.

[Supported assertions ans syntax &rsaquo;](../../reference/assertions.html)
