(reference-assertions-system-user)=
# system-user

Ubuntu Core has been designed to operate without users, or with the [Ubuntu SSO](https://login.ubuntu.com/) user created by `console-conf`when the device first boots.

Some systems suppress _console-conf_ and its user creation, and on those systems, the `system-user` [assertion](/reference/assertions/index) permits the creation of local system users on specific devices by their associated [Brand store](/explanation/stores/dedicated-snap-stores).

To create a system user on these systems,  the `system-user` [assertion](/reference/assertions/index), described on this page, needs to be embedded within a file called `auto-import.assert` that’s added to the system via the root directory of a removable USB storage device. For more details, see [System user](/how-to-guides/manage-ubuntu-core/add-a-system-user).

See [System user](/how-to-guides/manage-ubuntu-core/add-a-system-user) for further details on creating a system user.

## System-user assertion fields

The following fields can be used in a system-user assertion:

```yaml
type:                   <system-user>
format:                 <2> # sets the format being used for the assertion
authority-id:           <authority account-id>
revision:               <int>
brand-id:               <account-id>
email:                  <user e-mail>
series:                 <list of series which should accept this assertion>
models:                 <models which should accept this assertion>
serials:                <optional list of one or more device serial numbers>
name:                   <optional person’s name>
username:               <system user name>
password:               <encoded password>
force-password-change:  <boolean> # used to force users to change their password after login. Password cannot be empty
ssh-keys:               <list>
user-presence:          <until-expiration> # users are only valid while the assertion is valid>
since:                  <UTC datetime>
until:                  <UTC datetime>
sign-key-sha3-384:      <key id> # Encoded key id of signing key

<signature>             # Encoded signature
```

The index is the tuple \<`brand-id`, `email`\>, with `series` being as specified by the [model assertion](/reference/assertions/model). These assertions must be signed by the brand. The fields are then typically used in the following order:

- `serials` limits the scope of the _system-user_ assertion to devices with matching serials. This field can only be used with a `revision` of 1 or greater, and also limits the `models` field to accepting just a single model assertion. 

- `password` must be encoded and salted, following the format specified by [crypt](http://manpages.ubuntu.com/manpages/bionic/en/man1/crypt.1.html)(3). You could use `mkpasswd`, for example: `mkpasswd -m sha512`

- `since` and `until` define a period between a UTC _from date_ (since) and a UTC _to date_ (until) during which a new [system user](/how-to-guides/manage-ubuntu-core/add-a-system-user) is permitted to be created. An exception to this rule is if `until-expiration` has been set in `user-presence` (see below), in which case a user is removed when the corresponding assertion expires.

   Using `since` and `util` requires a `password` to be embedded within the assertion.

- `force-password-change` (optional) requires that the password is set after login, and the new password cannot be empty.

- `user-presence` (optional) when set to `until-expiration` means users created through the system-user assertion are valid until the expiration of the actual assertion. Requires that `    "format": "2",` is also set.

See [Assertion format](/reference/assertions/index.md#assertion-format) for more details on fields common to most assertions.

The simple addition of such assertions to a device assertion database should not be enough to trigger the user creation. This must be initiated explicitly (via `snap create-user`, or in the context of the auto-import mechanism for assertions from removable devices, which requires physical access to the device).

## Example system-user assertion

The following is a the JSON input for an example system-user assertion:

```json
{
    "type": "system-user",
    "authority-id": "324hfanjkfqASdFQWfnawefhu8Jauhdj",
    "series": [
        "16"
    ],
    "brand-id": "324hfanjkfqASdFQWfnawefhu8Jauhdj",
    "email": "test@localhost",
    "models": [
        "pc"
    ],
    "name": "user1",
    "username": "user1",
    "password": "$6$OCvKy4w/Ppxp7IvC$WPzWiIW.4y18h9htjbOuxLZ.sjQ5M2hoSiEu3FpMU0PMdHQuQdBOqvk8p6DMdS/R/nU/rXidClD23CbSkSgp30",
    "since": "2023-01-16T18:06:04+00:00",
    "until": "2025-05-16T18:06:04+00:00"
}
```

The corresponding signed system-user assertion:

```yaml
type: system-user
authority-id: 324hfanjkfqASdFQWfnawefhu8Jauhdj
brand-id: 324hfanjkfqASdFQWfnawefhu8Jauhdj
email: test@localhost
models:
  - pc
name: user1
password: $6$OCvKy4w/Ppxp7IvC$WPzWiIW.4y18h9htjbOuxLZ.sjQ5M2hoSiEu3FpMU0PMdHQuQdBOqvk8p6DMdS/R/nU/rXidClD23CbSkSgp30
series:
  - 16
since: 2023-01-16T18:06:04+00:00
until: 2025-05-16T18:06:04+00:00
username: test
sign-key-sha3-384: kKd-kgxTJSR-wm5OT5M-gVxo4zv0Y19AAloJE4dq7C0QlbPsdbof0G5g0lCpg0J_

AcLBXAQAAQoABgUCWKrupwAKCRCuieT/1PiUiMbrD/0WcjG5Yw6kPZ4afE6vePpZfySvPLbguna+
kMUtTYulfIVNK+VMR3ZeNQfHhe/WGIlxXUWqfIlp6EZ4ha7LBeeHYgdq6cOOrapa53wboQTOTCDp
EZna2R5lDnlVlm06jKOoPhQZNi0P30GiS9e1xY0CNu/hzxLgwArHYj1hqof0zdu/A68GyfU9AWRe
ne4QGFIwWuQE8vksgbRuCoRiu0zamU6WKdby4pad7Q1SHUdwn8+0i0/zmgRnvDeBloACNWHRYFy3
PGjJ5ylIkXoBaIYGfYusdO+NvSUnLP4Rj6izsUbBIVeHyAqAkMz6y68NUpQupO4vqih3GSi1pqoj
H5+p/e5UzcB7hqB8YOrwTtp5EsTPq/AOD0bu9EZdVS5eIAkGuvR3MJX+uGvTAXCCFMIPIxcNTPwp
6HUiyQ3xMZL6FUg4ucxQH6jRZiZ5SMiuJ2OYl53f7v3MdFMe5lnYSw1nBger9nEXti3pdsS9Czpk
3WdVRWSjvMupJUmlCJUTNeLwPn2gYCiZpFJntIltRq3McKqh6WrhTozsoVsLjTyx7bQEHp00QycJ
1pfdMtVNbQKyF30dswc5TctzZEOY/YazMI8CqB3ZuCGyUpkJ0px2FgJQqVHYdtIDePp33aTy170A
5dHym5SUQZqowwHN/PSc7rTyGn4fJCdRpRsjj72uSQ==
```

