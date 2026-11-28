---
myst:
  html_meta:
    description: Response-message assertion reference. The device's signed response to a request-message, with its status and payload, if any.
---

(reference-assertions-response-message)=
# response-message

For every {ref}`request-message <reference-assertions-request-message>` that snapd processes, there's a corresponding response-message assertion. It reports the outcome of the request, and its body carries the payload, if any. For example, the response to a confdb `get` carries the values that were read.

## Fields

The format of the response-message assertion is as follows:

```yaml
type:        response-message
account-id:  <account-id>
message-id:  <request-message-id>
device:      <serial>.<model>.<brand-id>
status:      success | error | unauthorized | rejected
timestamp:   <timestamp>
body-length: <int>
sign-key-sha3-384: <key id>        # Encoded key id of signing key

<body>                             # Response payload

<signature>                        # Encoded device signature
```

- **`account-id`** (*required*)
    The account ID of the operator that sent the original request-message. Together with `message-id` and `device`, forms the primary key of this assertion.
- **`message-id`** (*required*)
    The `message-id` of the original request-message, including its sequence number if it has one.
- **`device`** (*required*)
    The device that processed the request and signed this response, in the format `<serial>.<model>.<brand-id>`.
- **`status`** (*required*)
    The outcome of processing the message. See {ref}`Status <reference-assertions-response-message-status>` below.
- **`timestamp`** (*required*)
    The time at which the response was signed, in RFC 3339 format.
- **`body`** (*optional*)
    The response payload. The subsystem, or snapd itself, that created the response sets its format.

Like confdb-control, response-message has no `authority-id` header. The device is its own authority: snapd generates each response-message and signs it with the device key.

(reference-assertions-response-message-status)=
## Status

The `status` header gives a broad categorization of the outcome:

- **`success`**
    The message was processed successfully.
- **`error`**
    An error occurred while processing the message.
- **`unauthorized`**
    The action specified in the message isn't allowed for the account. See {ref}`Confdb messages <reference-assertions-request-message-confdb>` in the request-message reference.
- **`rejected`**
    The message failed validation. See {ref}`Validation <reference-assertions-request-message-validation>` in the request-message reference.

## Body

### Confdb messages

The body of a response to a {ref}`get action <reference-assertions-request-message-get>` is a JSON object with the values that were read. If the request specified `keys`, each key in `values` is a path from the request, and its value is the data found there, which can be a nested object:

```text
{
  "values": {
    "<key-1>": <value-1>,
    "<key-2>": <value-2>,
    ...
  }
}
```

If the request specified no `keys`, `values` is instead a single object holding all the data that the view exposes.

The body of a successful response to a {ref}`set action <reference-assertions-request-message-set>` is an empty JSON object:

```json
{}
```

### Errors

When the status is `error`, `unauthorized`, or `rejected`, the body is a JSON object with a `message` and, optionally, an error `kind`:

```text
{
  "kind": "<string>",
  "message": "<string>"
}
```

- **`message`** (*required*)
    A description of the error.
- **`kind`** (*optional*)
    A unique code for the error. Possible values include `assertion-not-found`, `option-not-available`, and `option-not-found`.

(reference-assertions-response-message-example)=
## Example assertion

The following response-message is one device's response to the second request-message in the {ref}`request-message example <reference-assertions-request-message-example>`, which reads back the proxy settings:

```yaml
type: response-message
account-id: alice
message-id: c4e9b7a2-2
device: 8e8af03a-4b32-4e91-b10a-b9e5d1f0c72f.edge-gateway.acme
status: success
timestamp: 2026-11-23T14:02:13Z
body-length: 140
sign-key-sha3-384: t9yuKGLyiezBq_PXMJZsGdkTukmL7MgrgqXAlxxiZF4TYryOjZcy48nnjDmEHQDp

{
  "values": {
    "https": {
      "bypass": [ "localhost", "*.acme.example" ],
      "url": "https://proxy.acme.example:3128"
    }
  }
}

AcLBUgQAAQoABgUCZ/+YqAAAguMQ...
```

Each of the three devices sends its own response. The response to the first message in the sequence, which changed the settings, has status `success` and the body `{}`.

If the settings had never been set, the response to the `get` would instead have status `error` and an error body:

```json
{
  "kind": "option-not-found",
  "message": "cannot get \"https\" through acme/network/proxy-state: no data"
}
```

A message from an operator that isn't delegated the view gets status `unauthorized`. For example, `bob` is only delegated `proxy-state` in the {ref}`confdb-control example <reference-assertions-confdb-control-example>`, so a `set` through `proxy-admin` gets this body:

```json
{
  "message": "cannot perform action: operator \"bob\" is not authorized"
}
```
