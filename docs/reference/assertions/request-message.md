---
myst:
  html_meta:
    description: Request-message assertion reference. Trigger an action on a device, such as reading or changing its confdb configuration.
---

(reference-assertions-request-message)=
# request-message

The request-message assertion is used to trigger an action on snapd. It can be delivered to snapd in a variety of ways, such as through the Snap Store. The first supported use case is remote configuration of a device's {ref}`confdb <reference-assertions-confdb-schema>`, for operators the device has delegated control to through a {ref}`confdb-control assertion <reference-assertions-confdb-control>`.

For every request-message that snapd processes, it generates a corresponding {ref}`response-message assertion <reference-assertions-response-message>`.

## Fields

The format of the request-message assertion is as follows:

```yaml
type:          request-message
account-id:    <account-id>
authority-id:  <account-id>
message-id:    <random-id>[-<N>]   # Optional sequence number N
message-kind:  <subsystem>         # For example, confdb
devices:
  - <serial>.<model>.<brand-id>
  - ...
valid-since:   <timestamp>
valid-until:   <timestamp>
timestamp:     <timestamp>
body-length:   <int>
sign-key-sha3-384: <key id>        # Encoded key id of signing key

<body>                             # Message payload, in a format set by the message kind

<signature>                        # Encoded signature
```

- **`account-id`** (*required*)
    The account ID of the operator that sent the message. Together with `message-id`, forms the primary key of this assertion.
- **`authority-id`** (*required*)
    The account ID of the signer. When the message is signed with the operator's own key, this is the same as `account-id`.
- **`message-id`** (*required*)
    An alphanumeric string of 4 to 16 characters, ideally random so that it's unique among the account's messages, optionally followed by a sequence number in the format `-<N>`. See {ref}`Sequencing <reference-assertions-request-message-sequencing>` below.
- **`message-kind`** (*required*)
    The kind of message, which determines the snapd subsystem that handles it and the format of the body. Currently, only `confdb` is supported.
- **`devices`** (*required*)
    A list of the devices the message is addressed to, each in the format `<serial>.<model>.<brand-id>`. See {ref}`Addressing devices <reference-assertions-request-message-devices>` below.
- **`valid-since`** (*required*)
    The time from which the message can be applied, in RFC 3339 format.
- **`valid-until`** (*required*)
    The time after which the message can no longer be applied, in RFC 3339 format. Must not be before `valid-since`.
- **`timestamp`** (*required*)
    The time at which the message was signed, in RFC 3339 format.
- **`body`** (*required*)
    The message payload, which must not be empty. The subsystem that handles the message sets its format. See {ref}`Confdb messages <reference-assertions-request-message-confdb>` below.

(reference-assertions-request-message-devices)=
## Addressing devices

Request messages are addressed to specific devices to ensure that a message is only applied by its intended recipients. Snapd compares the `devices` header against the device's identity, and messages intended for other devices are rejected.

(reference-assertions-request-message-sequencing)=
## Sequencing

If request messages should only be applied in a certain order, the operator can enforce this by sequencing them. Messages within the same sequence share the same random ID, which is followed by the message's number in the sequence in the `message-id` header, for example `7f3a9c21-1`, `7f3a9c21-2` and `7f3a9c21-3`.

The sequence number is strictly monotonically increasing, starting at 1. A message with sequence number *N* can only be applied if message *N-1* has already been applied successfully.

If a message in a sequence is missing, snapd queues the later messages and waits for the missing message until the sequence is evicted, after which all pending messages in that sequence are discarded.

Different sequences are applied independently, so a sequence that's blocked waiting for a missing message doesn't affect the messages in other sequences.

(reference-assertions-request-message-validation)=
## Validation

Snapd first decodes each request message it receives. A malformed message, one that isn't a well-formed request-message assertion, is dropped: snapd acknowledges it but doesn't process it, and sends no response.

Snapd then validates the decoded message. It checks its signature, whether it's addressed to the device, and whether it's within its validity window, which is the time between `valid-since` and `valid-until`. The subsystem handling the message then validates the payload. A message that fails validation is rejected, and snapd responds with a response-message with status `rejected`.

If the operator isn't authorized to perform the action, snapd responds with status `unauthorized` instead.

If a message in a sequence doesn't get a `success` response, whether it's rejected, unauthorized, or fails with an error, snapd evicts the sequence and discards the remaining messages. If more messages for the same sequence are received, the same process is repeated.

(reference-assertions-request-message-confdb)=
## Confdb messages

Messages with the `confdb` kind let operators read and change the configuration of a device's confdb. Their body is a JSON object.

Snapd authorizes a confdb message against the device's {ref}`confdb-control assertion <reference-assertions-confdb-control>`. The operator must have been delegated control of the view in the message, and the message must be signed with a method that the delegation allows. Messages signed on an operator's behalf by the Store (the `store` {ref}`authentication method <reference-assertions-confdb-control-authentications>`) aren't yet supported, and snapd responds to them with status `unauthorized`.

(reference-assertions-request-message-get)=
### Get

The `get` action reads configuration from a confdb. The body has the following fields:

```text
{
  "action": "get",
  "account": "<account-id>",
  "view": "<schema>/<view-name>",
  "keys": [ "<key-1>", "<key-2>", ... ],
  "constraints": {
    "<parameter-name>": "<value>",
    ...
  }
}
```

- **`action`** (*required*)
    Must be `get`.
- **`account`** (*required*)
    The account ID.
- **`view`** (*required*)
    The view to read from, in the format `<schema>/<view-name>`.
- **`keys`** (*optional*)
    A list of dotted configuration paths to read from. If no keys are specified, all readable view rules are read.
- **`constraints`** (*optional*)
    A JSON object holding values used to constrain parameters, keyed by the parameter names. Used to filter data according to the placeholders and field filters in the matched requests.

If successful, the response-message has status `success` and a body with the values that were read. See {ref}`response-message <reference-assertions-response-message>`.

(reference-assertions-request-message-set)=
### Set

The `set` action changes configuration in a confdb. The body has the following fields:

```text
{
  "action": "set",
  "account": "<account-id>",
  "view": "<schema>/<view-name>",
  "values": {
    "<key-1>": <value-1>,
    "<key-2>": <value-2>,
    "<key-3>": null
  }
}
```

- **`action`** (*required*)
    Must be `set`.
- **`account`** (*required*)
    The account ID.
- **`view`** (*required*)
    The view to write to, in the format `<schema>/<view-name>`.
- **`values`** (*required*)
    A JSON object mapping dotted configuration paths to the JSON values to set. A value can be `null` to unset the configuration.

If successful, the response-message has status `success` and an empty JSON object as its body.

(reference-assertions-request-message-example)=
## Example assertion

The following request-message changes the proxy settings of three devices. It's sent by `alice`, who is delegated the view in the {ref}`confdb-control example <reference-assertions-confdb-control-example>`. It's valid for a week, so devices that are offline can still apply it:

```yaml
type: request-message
account-id: alice
authority-id: alice
message-id: c4e9b7a2-1
message-kind: confdb
devices:
  - 8e8af03a-4b32-4e91-b10a-b9e5d1f0c72f.edge-gateway.acme
  - 3d6c1f58-9a47-4b0e-8f12-5c7e2a9d4b61.edge-gateway.acme
  - b57e0c94-2d18-4a63-9e7f-1a8c3d5b6e20.edge-gateway.acme
valid-since: 2026-11-23T09:00:00Z
valid-until: 2026-11-30T09:00:00Z
timestamp: 2026-11-23T09:00:00Z
body-length: 198
sign-key-sha3-384: BWDEoaqyr25nF5SNCvEv2v7QnM9QsfCc0PBMYD_i2NGSQ32EF2d4D0hqUel3m8ul

{
  "action": "set",
  "account": "acme",
  "view": "network/proxy-admin",
  "values": {
    "https.url": "https://proxy.acme.example:3128",
    "https.bypass": ["localhost", "*.acme.example"]
  }
}

AcLBUgQAAQoABgUCWCIWcgAAReg...
```

A second message in the same sequence reads the settings back. Its `message-id` is `c4e9b7a2-2`, so snapd only applies it once `c4e9b7a2-1` has been applied successfully. Its body is:

```json
{
  "action": "get",
  "account": "acme",
  "view": "network/proxy-state",
  "keys": [ "https" ]
}
```
