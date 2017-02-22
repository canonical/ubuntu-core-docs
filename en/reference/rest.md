---
title: Ubuntu Core REST API
table_of_contents: true
---

# Ubuntu Core REST API

You can interface with snapd on any Ubuntu Core system using its REST API.

## Versioning

 The API evolves, some changes are deemed backwards-compatible (such
as adding methods or verbs, or adding members to the returned JSON
objects) and don't warrant an endpoint change; some changes won't be
backwards compatible, and will be exposed under a new endpoint.

## Connecting

While it is expected to allow clients to connect using HTTPS over a
TCP socket, at this point only a UNIX socket is supported. The socket
is `/run/snapd.socket`.

## Authentication

The API documents three levels of access: *open*, *authenticated* and
*root*.
APIs with open access will succeed without authorization. Authenticated access requires suitable authorization to be provided with each request.
Root requires the requester to be the root user.
The root user also gains authenticated access without having to send authorization.

Authorization is provided by sending a Macaroon with the HTTP Authorization header. For example:
```
Authorization: Macaroon root="serialized-store-macaroon",discharge="discharge-for-macaroon-authentication"
```

## Responses

### Synchronous Response

For a standard synchronous operation, the following JSON object is
returned:

Example:
```javascript
{
    "type": "sync"
    "status-code": 200,
    "status": "OK",
    "result": { "name": "value" }
}
```

#### Fields

* `type`: Always `sync`.
* `status-code`: HTTP status code matching the HTTP status line.
* `status`: HTTP reason phrase matching the HTTP status line.
* `result`: Result from the request. This can be any JSON structure and is commonly either an object or an array.

### Asynchronous Response

When a request takes time to complete an asynchronous response is returned.
The request is assigned a change id, which can be checked by requesting `GET /v2/changes/[id]`.

Example:
```javascript
{
    "type": "async"
    "status-code": 202,
    "status": "Accepted",
    "change": "401"
}
```

#### Fields

* `type`: Always `async`.
* `status-code`: HTTP status code matching the HTTP status line (always 202).
* `status`: HTTP reason phrase matching the HTTP status line (always `Accepted`).
* `change`: Id of the change in progress.

### Error Response

If a request cannot be completed, an error response is returned.

Example:
```javascript
{
    "type": "error"
    "status-code": 401,
    "status": "Unauthorized",
    "result": {
        "message": "access denied",
        "kind": "login-required",
    }
}
```

#### Fields

* `type`: Always `error`.
* `status-code`: HTTP status code matching the HTTP status line.
* `status`: HTTP reason phrase matching the HTTP status line.
* `result`: Error information.

#### Result Fields

* `message`: Description of the error, suitable for displaying to a user.
* `kind`: Unique code for the error, to enable a snapd client to display appropriate behaviour (optional).

#### Error kinds

* `two-factor-required`: the client needs to retry the `login` command including an OTP
* `two-factor-failed`: the OTP provided wasn't recognised
* `login-required`: the requested operation cannot be performed without an authenticated user. This is the kind of any other 401 Unauthorized response.
* `invalid-auth-data`: the authentication data provided failed to validate (e.g. a malformed email address). The `value` of the error is an object with a key per failed field and a list of the failures on each field.
* `terms-not-accepted`: the user has not accepted the store's terms of service.
* `no-payment-methods`: the user does not have a payment method registered to complete a purchase.
* `payment-declined`: the user's payment method was declined by the payment provider.
* `snap-already-installed`: the requested snap is already installed.
* `snap-not-installed`: the requested snap is not installed.
* `snap-no-update-available`: the requested snap does not have an update available.

## `GET /`

Reserved for human-readable content describing the service.

## `GET /v2/system-info`

* Description: Server configuration and environment information
* Access: open
* Operation: sync
* Return: Dict with the operating system's key values.

### Response

Example:
```javascript
{
    "series": "16",
    "version": "2.0.17",
    "os-release": {
        "id": "ubuntu",
        "version-id": "17.04",
    },
    "on-classic": true,
    "managed": false
}
```

#### Fields

* `series`: The core series in use.
* `version`: The version of snapd.
* `os-release`: Object containing release information as sourced from `/etc/os-release`. Contains `id` which is a unique ID for each OS and `version-id` which is a string describing the version of this OS.
* `on-classic`: true if not running on fully snap managed system.
* `managed`: true if able to manage user accounts (?).
* `store`: the name of the store being used (optional, omitted if using the standard store).

## `POST /v2/login`

* Description: Log user in the store
* Access: root
* Operation: sync
* Return: Dict with the authenticated user information or error.

### Request

Example:
```javascript
{
     "username": "foo@bar.com",
     "password": "swordfish",
     "otp": "123456"
}
```

#### Fields

* `username`: The username being logged in with. This must be a valid email address.
* `password`: Password for this account.
* `otp`: One time password for this account (optional). This field being wrong will generate the `two-factor-required` or `two-factor-failed` errors.

### Response

Example:
```javascript
{
    "macaroon": "serialized-store-macaroon",
    "discharges": ["discharge-for-macaroon-authentication"]
}
```

#### Fields

* `macaroon`: Serialized macaroon to be passed back in the HTTP `Authorization` header.
* `discharges`: Array of serialized discharges to be passed back in the HTTP `Authorization` header.

## `POST /v2/logout`

* Description: Log user out of the store
* Access: root
* Operation: sync
* Return: 200 OK or an error

## `GET /v2/find`

* Description: Find snaps in the store
* Access: open or authenticated
* Operation: sync
* Return: list of snaps in the store that match the search term and
  that this system can handle.

### Parameters:

#### `q`

Search for snaps that match the given string. This is a weighted broad
search, meant as the main interface to searching for snaps.

#### `name`

Search for snaps whose name matches the given string. Can't be used
together with `q`. This is meant for things like autocompletion. The
match is exact (i.e. find would return 0 or 1 results) unless the
string ends in `*`.

#### `section`

Section in the store to search. Use `GET /v2/sections` to get the names of the sections.

#### `select`

Alter the collection searched:

* `refresh`: search refreshable snaps. Can't be used with `q`, nor `name`.
* `private`: search private snaps (by default, find only searches
  public snaps). Can't be used with `name`, only `q` (for now at
  least).

### Response

Example:
```javascript
[{
      "channel": "stable",
      "confinement": "strict",
      "description": "Moon-buggy is a simple character graphics game, where you drive some kind of car across the moon's surface.  Unfortunately there are dangerous craters there.  Fortunately your car can jump over them!\r\n",
      "developer": "dholbach",
      "download-size": 90112,
      "icon": "",
      "id": "2kkitQurgOkL3foImG4wDwn9CIANuHlt",
      "name": "moon-buggy",
      "private": false,
      "resource": "/v2/snaps/moon-buggy",
      "revision": "11",
      "status": "available",
      "summary": "Drive a car across the moon",
      "type": "app",
      "version": "1.0.51.11"
      "prices": {"EUR": 1.99, "USD": 2.49}
    }, {
      "description": "no description",
      "developer": "chipaca",
      "download-size": 1110016,
      "icon": "https://myapps.developer.ubuntu.com/site_media/appmedia/2015/10/http.png",
      "name": "http",
      "resource": "/v2/snaps/http",
      "revision": 14,
      "screenshots": [{url: "https://myapps.developer.ubuntu.com/site_media/appmedia/2015/10/screenshot.png", width: 800, height: 1280}],
      "status": "available",
      "summary": "HTTPie in a snap",
      "type": "app",
      "version": "4.6692016"
}]
```

#### Fields

* `channel`: the channel this snap is from.
* `confinement`: the confinement requested by the snap itself; one of `strict` or `devmode`.
* `description`: snap description.
* `developer`: developer who created the snap.
* `download-size`: how big the download will be.
* `icon`: a url to the snap icon, possibly relative to this server.
* `id`: unique ID for this snap.
* `name`: the snap name.
* `prices`: JSON object with properties named by ISO 4217 currency code. The values of the properties are numerics representing the cost in each currency. For free snaps, the "prices" property is omitted.
* `private`: true if this snap is only available to its author.
* `resource`: HTTP resource for this snap.
* `revision`: a number representing the revision.
* `screenshots`: JSON array of the screenshots for this snap. Each screenshot has a `url` field for the image and optionally `width` and `height` (in pixels).
* `status`: can be either `available`, or `priced` (i.e. needs to be bought to become available).
* `summary`: one-line summary.
* `type`: the type of snap; one of `app`, `kernel`, `gadget`, or `os`.
* `version`: a string representing the version.

#### Response meta data:

Example:
```javascript
{
    "suggested-currency": "GBP"
}
```

##### Fields

* `suggested-currency`: the suggested currency to use for presentation,
   derived by Geo IP lookup.

## `GET /v2/snaps`

* Description: List installed snaps
* Access: open
* Operation: sync
* Return: list of snaps installed in this Ubuntu Core system, as for `/v2/find`

### Response

Example:
```javascript
[{
      "apps": [{"name": "moon-buggy"}]
      "channel": "stable"
      "confinement": "strict"
      "description": "Moon-buggy is a simple character graphics game, where you drive some kind of car across the moon's surface.  Unfortunately there are dangerous craters there.  Fortunately your car can jump over them!\r\n",
      "developer": "dholbach",
      "devmode": false,
      "icon": "",
      "id": "2kkitQurgOkL3foImG4wDwn9CIANuHlt",
      "install-date": "2016-05-17T09:36:53+12:00",
      "installed-size": 90112,
      "name": "moon-buggy",
      "private": false,
      "resource": "/v2/snaps/moon-buggy",
      "revision": "11",
      "status": "active",
      "summary": "Drive a car across the moon",
      "trymode": false,
      "type": "app",
      "version": "1.0.51.11"
    }, {
      "summary": "The ubuntu-core OS snap",
      "description": "A secure, minimal transactional OS for devices and containers.",
      "icon": "",                  // core might not have an icon
      "installed-size": 67784704,
      "install-date": "2016-03-08T11:29:21Z",
      "name": "core",
      "developer": "canonical",
      "resource": "/v2/snaps/ubuntu-core",
      "status": "active",
      "type": "core",
      "update-available": 247,
      "version": "241",
      "revision": 99,
      "channel": "stable",
}]
```

#### Fields

In addition to the fields described in `/v2/find`:

* `apps`: JSON array of apps the snap provides. See below for fields.
* `devmode`: true if the snap is currently installed in development mode.
* `installed-size`: how much space the snap itself (not its data) uses.
* `install-date`: the date and time when the snap was installed in RFC3339 UTC format.
* `status`: can be either `installed` or `active` (i.e. is current).
* `tracking-channel`: the channel updates will be installed from.
* `trymode`: true if the app was installed in try mode.

furthermore, `download-size`, `screenshots` and `prices` cannot occur in the output of `/v2/snaps`.

#### App Fields

* `name`: Name of the app, i.e. the name of the executable.
* `aliases`: A list of alias names for this app (optional).
* `daemon`: The type of daemon this app is. One of "simple", "forking", "oneshot", "dbus" or "notify" (optional, only applicable for daemons)

## `POST /v2/snaps`

* Description: Install, refresh, revert, remove, enable, disable snaps
* Access: authenticated
* Operation: async
* Return: background operation or standard error

### Store Request

Example:
```javascript
{
    "action": "refresh",
    "snaps": ["moon-buggy"]
}
```

Fields:
* `action`: Either `install`, `refresh`, `remove`, `revert`, `enable`, or `disable`.
* `channel`: Channel to install from (optional, only applicable with `action` set to `install` or `refresh`).
* `classic` Put snap in classic mode and disable security confinement if `true` (optional, only applicable with `action` set to `install`, `refresh`, `revert`).
* `devmode` Put snap in development mode and disable security confinement if `true` (optional, only applicable with `action` set to `install`, `refresh`, `revert`. Not allowed when more than one snap requested).
* `ignore-validation`: Ignore validation by other snaps blocking the refresh if `true` (optional, only applicable with `action` set to `refresh`).
* `jailmode` Put snap in enforced confinement mode if `true` (optional, only applicable with `action` set to `install`, `refresh`, `revert`. Not allowed when more than one snap requested).
* `revision`: Revision to install (optional, only applicable with `action` set to `install`, `refresh`, `revert`. Not allowed when more than one snap requested).
* `snaps`: Array of snap names to perform action on (optional, interpreted as all snaps if not present for a refresh).

### Sideload Request

Snaps can be sideloaded by passing the snap content in a `multipart/form-data` request with one file named "snap".

Example:
```
POST /v2/snaps HTTP/1.1
Host:
Content-Type: multipart/form-data; boundary=foo
Content-Length: 20638

--foo
Content-Disposition: form-data; name="devmode"

true
--foo
Content-Disposition: form-data; name="snap"; filename="hello-world_27.snap"

<20480 bytes of snap file data>
--foo
```

The following fields are supported:
* `action`: The action to perform, either `install` or `try` (optional, defaults to `install`).
* `classic`: Put snap in classic mode and disable security confinement if `true` (optional).
* `dangerous`: Put snap into development mode and disable security confinement if `true` (optional).
* `devmode`: Put snap in development mode and disable security confinement if `true` (optional).
* `jailmode`: Put snap in enforced confinement mode if `true` (optional).
* `snap`: The contents of the snap file. Note that `filename` is required to be set but the value is not used. `Content-Type` is not required, but recommended.  (optional, required if `action` is `install`)
* `snap-path`: Directory to install in try mode (optional, required if `action` is `try`).

## `GET /v2/snaps/[name]`

* Description: Details for an installed snap
* Access: open
* Operation: sync
* Return: snap details (as in `/v2/snaps`)

## `POST /v2/snaps/[name]`

* Description: Install, refresh, remove, revert, enable or disable
* Access: authenticated
* Operation: async
* Return: background operation or standard error

### Request

Example:
```javascript
{
    "action": "install",
    "channel": "beta"
}
```

#### Fields

* `action`: Either `install`, `refresh`, `remove`, `revert`, `enable`, or `disable`.
* `channel`: From which channel to pull the new package (and track henceforth). Channels are a means to discern the maturity of a package or the software it contains, although the exact meaning is left to the application developer. One of `edge`, `beta`, `candidate`, and `stable` which is the default. (optional, only applicable when `action` is `install` or `refresh`).

## `GET /v2/snaps/[name]/conf`

* Description: Configuration details for an installed snap
* Access: root
* Operation: sync
* Return: JSON map of configuration keys and values

### Parameters

#### `keys`

Request the configuration values corresponding to the specific keys
(comma-separated).

## `PUT /v2/snaps/[name]/conf`

* Description: Set the configuration details for an installed snap
* Access: root
* Operation: async
* Return: background operation or standard error

### Request

Example:
```javascript
{
    "conf-key1": "conf-value1",
    "conf-key2": "conf-value2"
}
```

## `GET /v2/icons/[name]/icon`

* Description: Get an icon from a snap installed on the system. The
  response will be the raw contents of the icon file; the content-type
  will be set accordingly and the Content-Disposition header will specify
  the filename.

  This fetches the icon from the snap itself.
* Access: open

This is *not* a standard return type.

## `GET /v2/assertions/[assertionType]`

* Description: Get all the assertions in the system assertion database of the given type
* Access: open
* Operation: sync
* Return: stream of assertions

The response is a stream of assertions separated by double newlines.
The X-Ubuntu-Assertions-Count header is set to the number of
returned assertions, 0 or more.

Assertions can be filtered on header values using parameters, e.g. `GET /v2/assertions/account?username=canonical` will return all account assertions where `type=account` and `username=canonical`.

Example:
```
HTTP/1.1 200 OK
Content-Type: application/x.ubuntu.assertion; bundle=y
X-Ubuntu-Assertions-Count: 2
<http-headers>

type: <type>
<assertion-headers>
body-length: <length>
sign-key-sha3-384: <key>

<body>

<signature>

type: <type>
<assertion-headers>
sign-key-sha3-384: <key>

<signature>
```

Note, to determine the boundary between assertions the headers need to be decoded to check if each assertion contains a body.

## `POST /v2/assertions`

* Description: Tries to add an assertion to the system assertion database.
* Authorization: root
* Operation: sync
* Return: 200 OK or an error

The body of the request provides the assertion to add. The assertion
may also be a newer revision of a pre-existing assertion that it will replace.

To succeed the assertion must be valid, its signature verified with a
known public key and the assertion consistent with and its
prerequisite in the database.

Example:
```
POST /v2/assertions HTTP/1.1
Content-Type: application/x.ubuntu.assertion
<http-headers>

type: <type>
<assertion-headers>
sign-key-sha3-384: <key>

<signature>
```

## `GET /v2/interfaces`

* Description: Get all the plugs, slots and their connections.
* Access: authenticated
* Operation: sync
* Return: an object with two arrays of plugs, slots and their connections.

### Response

Example:
```javascript
{
    "slots": [
        {
            "snap":  "canonical-pi2",
            "slot":  "pin-13",
            "interface":  "bool-file",
            "label": "Pin 13",
            "connections": [
                {"snap": "keyboard-lights", "plug": "capslock-led"}
            ]
        },
        {
            "snap":  "canonical-pi2",
            "slot":  "port-0",
            "interface":  "serial-port",
            "label": "Serial Port 0",
            "attrs": {"path": "/dev/ttyS0"}
        }
    ],
    "plugs": [
        {
            "snap":  "keyboard-lights",
            "plug":  "capslock-led",
            "interface": "bool-file",
            "label": "Capslock indicator LED",
            "connections": [
                {"snap": "canonical-pi2", "slot": "pin-13"}
            ]
        }
    ]
}
```

#### Fields for plugs / slots

* `snap`: The snap this plug / slot is part of.
* `plug` or `slot`: The name of this plug / slot.
* `interface`: The interface this plug / slot uses.
* `attrs`: Dict containing attributes for the interface in use. Attributes values can be of any type, e.g. boolean, strings etc.
* `label`: Human readable description of plug / slot.
* `connections`: List of current slots / plugs that are connected to this. Each connection contains the name of the snap and the connected slot / plug.

## `POST /v2/interfaces`

* Description: Issue an action to the interface system
* Access: authenticated
* Operation: async
* Return: background operation or standard error

Example:
```javascript
{
    "action": "connect",
    "slots": [{"snap": "canonical-pi2",   "slot": "pin-13"}],
    "plugs": [{"snap": "keyboard-lights", "plug": "capslock-led"}]
}
```

#### Fields

* `action`: Action to perform, either `"connect"` or `"disconnect"`
* `plugs`: Array of plugs to connect. Each plug is referred to by the `snap` it is part of and the name of the `plug`.
* `slots`: Array of slots to connect to. Each slot is referred to by the `snap` it is part of and the name of the `slot`.

## `POST /v2/buy`

* Description: Buy the specified snap
* Access: authenticated
* Operation: sync
* Return: Dict with buy state.

### Request

Example:
```javascript
{
    "snap-id": "2kkitQurgOkL3foImG4wDwn9CIANuHlt",
    "price": 2.99,
    "currency": "USD"
}
```

#### Fields

* `snap-id`: id of the snap being purchased
* `price`: Amount to be paid
* `currency`: The currency to be paid with as an ISO 4217 code

### Response

Example:
```javascript
{
    "state": "Complete",
}
```

## `GET /v2/buy/ready`

* Description: Determine if the user's account ready to make purchases.
* Access: authenticated
* Operation: sync
* Return: true, or error.

## `POST /v2/create-user`

* Description: Create a local user
* Access: root
* Operation: sync
* Return: an object with the created username and the ssh keys imported.

### Request

Example:
```javascript
{
    "email": "michael@example.com",
    "sudoer": false
}
```

#### Fields

* email: the email of the user to create
* sudoers: if true adds "sudo" access to the created user
* known: use the local system-user assertions to create the user
         (see assertions.md for details about the system-user assertion)

As a special case: if email is empty and known is set to true, the
command will create users for all system-user assertions that are
valid for this device.

### Response

Example:
```javascript
{
    "username": "mvo",
    "ssh-keys": ["key1","key2"]
    "ssk-key-count": 2,
}
```

#### Fields

* username: the username of the created user
* ssh-keys: a list of strings with the ssh keys that got added
* ssh-key-count: (deprecated) the number of ssh keys that got added

As a special case: if the input email was empty and known set to true,
multiple users can be created, so the return type is a list of the above
objects.

## `GET /v2/changes/[id]`

* Description: Get the current status of a change
* Access: authenticated
* Operation: sync
* Return: current status of change or standard error

### Response

Example:
```javascript
{
    "id": "123",
    "kind": "make-lamington",
    "summary": "Make a tasty Lamington",
    "status": "Done",
    "tasks": [
        {
            "id": "1353",
            "kind": "cut-cake",
            "summary": "Cut cake into pieces",
            "status": "Done",
            "progress":
            {
                "label": "Cutting piece",
                "done": 16,
                "total": 16
            },
            "spawn-time": "2017-01-23T12:00:44.806931498+13:00",
            "ready-time": "2017-01-23T12:00:45.001581654+13:00"
        },
        {
            "id": "1354",
            "kind": "dip",
            "summary": "Dip cake into chocolate",
            "status": "Done",
            "progress":
            {
                "label": "Dipping piece",
                "done": 16,
                "total": 16
            },
            "spawn-time": "2017-01-23T12:00:44.806945878+13:00",
            "ready-time": "2017-01-23T12:00:45.125187175+13:00"
        },
        {
            "id": "1355",
            "kind": "coat",
            "summary": "Coating cake in desiccated coconut",
            "status": "Done",
            "progress":
            {
                 "label": "Coating piece",
                 "done": 16,
                 "total": 16
            },
            "spawn-time": "2017-01-23T12:00:44.806951938+13:00",
            "ready-time": "2017-01-23T12:00:45.448964018+13:00"
        },
    ],
    "ready": true,
    "spawn-time": "2017-01-23T12:00:44.806971766+13:00",
    "ready-time": "2017-01-23T12:00:45.693234787+13:00"
}
```

#### Fields

* `id`: A unique ID for this change.
* `kind`: A code describing what type of change this is.
* `summary`: Human readable description of the change.
* `status`: Human readable description of the change status.
* `tasks`: array of objects describing tasks in this change (optional, see below).
* `ready`: true if this change has completed.
* `spawn-time`: the time this change started in in RFC3339 UTC format with µs precision.
* `ready-time`: the time this change completed in RFC3339 UTC format with µs precision. (omitted if not completed).
* `data`: result of the change (optional, omitted until completed).

#### Task Fields

* `id`: A unique ID for this task.
* `kind`: A code describing what type of task this is.
* `summary`: Human readable description of the task.
* `status`: Human readable description of the task status.
* `progress`: object containing the current progress of this task. `label` is a human readable description of the progress, `done` and `total` are numbers showing the progress of this task.
* `spawn-time`: the time this task started in RFC3339 UTC format with µs precision.
* `ready-time`: the time this task completed in RFC3339 UTC format with µs precision (omitted if not completed).

## `POST /v2/changes/[id]`

* Description: Abort a change in progress
* Access: authenticated
* Operation: sync
* Return: current status of change or standard error

### Request

Example:
```javascript
{
    "action": "abort"
}
```

### Response

See return from GET.

## `GET /v2/changes`

* Description: Get all the changes in progress
* Access: authenticated
* Operation: sync
* Return: current changes or standard error

Returns an array containing all the changes as that would have been returned from `/v2/changes/[id]`.

## `POST /v2/snapctl`

* Description: Run snapctl command
* Access: authenticated
* Operation: sync
* Return: command output or standard error

### Request

Example:
```javascript
{
    "context-id": "ABCDEF",
    "args": [ "get", "username" ]
}
```

#### Fields

* `context-id`: Context for this call.
* `args`: Arguments to snapctl.

### Response

Example:
```javascript
{
    "stdout": "username",
    "stderr": ""
}
```

#### Fields

* `stdout`: Data written to stdout from snapctl command.
* `stderr`: Data written to stderr from snapctl command.

## `GET /v2/users`

* Description: TBD
* Access: root
* Operation: sync
* Return: array of users

### Response

Example:
```javascript
[
    { "id": 1, "username": "user1@example.com" },
    { "id": 2, "username": "user2@example.com" }
]
```

## `GET /v2/sections`

* Description: Get the store sections
* Access: open
* Operation: sync
* Return: an array containing the store section names

### Response

Example:
```javascript
[ "featured", "database", "ops", "messaging", "media", "internet-of-things" ]
```
