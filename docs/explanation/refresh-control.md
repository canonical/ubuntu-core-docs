(explanation-refresh-control)=
# Refresh control

Snaps in Ubuntu Core update automatically, and by default, the *snapd* daemon checks for updates 4 times a day. Each update check is called a *refresh* .

However, some projects can benefit from holding a deployed snap, or a set of snaps, at a tested _revision_ until any new release is separately validated, and this requires refresh control.

A snap’s [revision](https://snapcraft.io/docs/glossary#heading--revision) is an automatic number assigned by the Snap Store to give each snap build a unique identity within its channel. Refresh control allows specific snaps to be kept at a specified revision, even when a new or different revision of a snap is released.

```{admonition} Refresh control with validation sets
:class: tip
Another possible refresh control solution is to use a _validation set_. A validation set can be used to ensure only specific snaps are installed, and optionally, only specific snaps at fixed revisions. See [Validation sets](https://snapcraft.io/docs/validation-sets) for further details.
```

## Gating snaps

Refresh control can be accomplished by using a **gating snap** to control which revisions of one or more **gated snaps**  to install:

* the publisher of the **gating snap** validates which revisions of the one or more *gated snaps* to install. 
* the **gating snap** lists the snaps that are to be controlled. Any system that has the gating snap installed is controlled.
* **gated snaps** are kept at their stated revisions. If any gated snaps are not currently at a validated revision, the next refresh ensures they're moved to one, assuming the validated revision is available on the channel that the system follows.

A gated snap can also require verification from *more than one* gating snaps, but this is discouraged to help avoid confusion.  The best practice is to use a single gating snap for each gated snap.

Gating is especially useful when a device manufacturer needs to mediate  releases of its *base* snap, allowing time for testing and validation of new revisions on their device models and compatibility with their software. This is separate from the ability for device managers to control the schedule of refreshes and revision control via a snap proxy.

## Preliminary setup

The mechanism of defining refresh control behaviour involves:

* setting the list of controlled snaps (by snap ID) in the gating snap. After the Canonical Store team does this initial setup, the gating snap’s snap-declaration assertion contains a refresh-control section that lists the gated snap IDs (see below)
* The gating snap publisher signing and issuing validation assertions that include:
  * the name of the gating snap
  * the name and revision the gated snap is held at
  * This is done by the gating snap Publisher 

Validations can only be issued by the owner/publisher of the *gating* snap because publishing rights are required for an assertion to be issued for the snap.

Establishing the relationship between a gating and gated snap is required only once and can only be performed by a user with permission from the team operating the store controlling the gating snap.

## Setting up the signing key

Gating involves pushing {ref}`validation assertions <reference-assertions-validation>` signed by the publisher, indicating their authorisation to restrict updates of snaps. To do this, several GPG keys must be generated and published to the store. If a store key already exists, it can be used. If not, one must be generated and registered.

1.  `snapcraft create-key` to create a key. (by default it's named "default" but a key name can be given to create a custom one so e.g. each snap is signed with its own key). Do not forget the passphrase used to secure the key or misplace the key files.

        $ snapcraft create-key my-key
        Passphrase:
        Confirm passphrase:
        $ snapcraft list-keys
            Name          SHA3-384 fingerprint
        -   my-key       mfomTtPB1cE3IFs51NtdnFoPlQwJxFgxOMU_q0mPkH7M2gKB-4m28d99XrVjA53B  (not registered)

2.  `snapcraft register-key <the-key-name>` to register it with the assertion server.

        $ snapcraft register-key my-key
        Enter your Ubuntu One e-mail address and password.
        If you do not have an Ubuntu One account, you can create one at https://dashboard.snapcraft.io/openid/login
        Email: roadmr.developer@example.com
        Password:
        Second-factor auth: 111111
        Registering key ...
        Done. The key "my-key" (mfomTtPB1cE3IFs51NtdnFoPlQwJxFgxOMU_q0mPkH7M2gKB-4m28d99XrVjA53B) may be used to sign your assertions.

## Example gating workflows

At this point, the publisher can issue validations asserting which revision of the gated snap is allowed to be installed when the gating snap is installed on a device. For example, specify that if the `roadmr-gating` snap is installed, the `roadmr-gated` snap can only be installed or refreshed to revision 2.

``` text
$ snapcraft validate roadmr-gating roadmr-gated=2 --key-name my-key
Getting details for roadmr-gated
Signing validations assertion for roadmr-gated=2
```

This generates the assertion and pushes it to the assertions service. A copy of the assertion will also be left in the current directory.

``` text
type: validation
authority-id: Q8HSISyvcdrniz52oa8Qjh6HlZwv0wiT
series: 16
snap-id: gs2epiCF5LPioNKnajAOTiBhOogG26RN
approved-snap-id: xZkR9MIMbusYipfJ80DGWf1nPKkD77hk
approved-snap-revision: 2
revoked: false
timestamp: 2018-05-30T21:00:04.092765Z
sign-key-sha3-384: mfomTtPB1cE3IFs51NtdnFoPlQwJxFgxOMU_q0mPkH7M2gKB-4m28d99XrVjA53B
```

To verify this was pushed up to assertions service:

``` text
$ snap known --remote validation series=16 snap-id=gs2epiCF5LPioNKnajAOTiBhOogG26RN approved-snap-id=xZkR9MIMbusYipfJ80DGWf1nPKkD77hk approved-snap-revision=2
type: validation
authority-id: Q8HSISyvcdrniz52oa8Qjh6HlZwv0wiT
series: 16
snap-id: gs2epiCF5LPioNKnajAOTiBhOogG26RN
approved-snap-id: xZkR9MIMbusYipfJ80DGWf1nPKkD77hk
approved-snap-revision: 2
revoked: false
timestamp: 2018-05-30T21:00:04.092765Z
sign-key-sha3-384: mTVMTtPB1cE3IFs51NtdnFoPlQwJxFgxOMU_q0mPkH7M2gKB-4m28d99XrVjA53B
....
```

As described earlier, this means that, if the gating snap is installed on the system, the gated snap can *only be installed or refreshed to the approved revision* (2 in this case).

If the gating snap is not installed on the system, the gated snap is not restricted and will be installable or updatable to whichever revision is available in the requested channel. The revision of the gating snap is not relevant here; what's relevant is the latest validation assertion which tells which revision of `roadmr-gated` is allowed.

* To control the revision of a gated snap, the gating snap Publisher signs and issues a validation assertion that names the gating snap and the gated snap name and revision.
* To sign the validation assertion, the Publisher must name/use a snapcraft key (snapcraft create-key KEYNAME) that has been registered (snapcraft register-key KEYNAME). See below.
* When signing a validation assertion where the gating snap is published in a Brand Store, the `SNAPCRAFT_UBUNTU_STORE` environment variable must be defined to equal the Brand Store’s store ID.

The snapcraft gated command can tell you which snaps are gated by a particular snap:

``` text
$ snapcraft gated roadmr-gating
Name                Revision  Required    Approved
roadmr-gated        2         True        2018-05-30T21:00:04Z
```

Here we can see `roadmr-gating`, if installed, will constrain `roadmr-gated` to revision 2 (or nothing at all, if rev2 is not installable).

At this point one can install the gating snap:

``` text
$ snap install roadmr-gating
roadmr-gating 2018-05-30-01 from 'snapdeveloper' installed
$ snap list roadmr-gating
Name           Version        Rev    Tracking    Developer      Notes
roadmr-gating  2018-05-30-01    1    stable      snapdeveloper  -
```

Note that trying to install the gated snap fails:

``` text
$ snap install roadmr-gated
error: snap "roadmr-gated" not found
```

Even though it is indeed available on stable (but at revision 1, not the validated one, which would be 2):

``` text
$ snap info roadmr-gated
name:      roadmr-gated
publisher: snapdeveloper
snap-id: xZkR9MIMbusYipfJ80DGWf1nPKkD77hk
channels:
  stable:    2018-05-30-02 (1) 4kB -
```

Once revision 2 is published...

``` text
$ snap info roadmr-gated
name:      roadmr-gated
publisher: snapdeveloper
snap-id: xZkR9MIMbusYipfJ80DGWf1nPKkD77hk
channels:
  stable:    2018-05-30-03 (2) 4kB -
```

...installing can proceed.

``` text
$ snap install roadmr-gated
roadmr-gated 2018-05-30-03 from 'snapdeveloper' installed
$ snap list roadmr-gating roadmr-gated
Name            Version         Rev     Tracking    Developer        Notes
roadmr-gated    2018-05-30-03   2       stable      snapdeveloper    -
roadmr-gating   2018-05-30-01   1       stable      snapdeveloper    -
```

If at this point revision 3 of the gated snap is published...

``` text
$ snap info roadmr-gated
name:      roadmr-gated
publisher: snapdeveloper
snap-id:   xZkR9MIMbusYipfJ80DGWf1nPKkD77hk
tracking:  stable
refreshed: 2018-05-30T21:08:53Z
installed:   2018-05-30-03 (2) 4kB -
channels:
  stable:    2018-05-30-04 (3) 4kB -
```

...snap refresh will do nothing because even though v3 is available, it's not validated.

``` text
$ snap refresh
All snaps up to date.
$ snap list roadmr-gating roadmr-gated
Name            Version         Rev Tracking    Developer        Notes
roadmr-gated    2018-05-30-03   2   stable      snapdeveloper    -
roadmr-gating   2018-05-30-01   1   stable      snapdeveloper    -
```

Validation is independent of snap release/publishing. For example, we can validate the existing gated snap v3 with the existing gating snap at revision 1 (meaning no update of gating snap is needed):

``` text
$ snapcraft validate roadmr-gating roadmr-gated=3 --key-name my-key
Getting details for roadmr-gated
Signing validations assertion for roadmr-gated=3
```
If the gated snap is in a brand store, the store ID must be specified within the `SNAPCRAFT_UBUNTU_STORE` environment variable, as follows: `SNAPCRAFT_UBUNTU_STORE=the-store-id snapcraft validate [...]`


At this point a refresh will take gated-1 to rev 3 which was validated.

``` text
$ snap refresh
roadmr-gated 2018-05-30-04 from 'snapdeveloper' refreshed
$ snap list roadmr-gating roadmr-gated
Name            Version       Rev    Tracking   Developer        Notes
roadmr-gated    2018-05-30-04 3      stable     snapdeveloper    -
roadmr-gating   2018-05-30-01 1      stable     snapdeveloper    -
```

**Without a validation assertion, a gated snap will not refresh**

## Gating multiple snaps

A validation can be issued to restrict the revisions of more than one gated snap (assuming the “publisher setup” was done to allow the gating snap to control the indicated gated snaps):

``` text
$ snapcraft validate roadmr-gating roadmr-gated=2 facundo-gated=5
Getting details for roadmr-gated
Getting details for facundo-gated
Signing validations assertion for roadmr-gated=2
Signing validations assertion for facundo-gated=5
```

In this example, if `roadmr-gating` is installed on a device, `roadmr-gated` will only install or refresh to revision 2, and `facundo-gated` will only install or refresh to revision 5.


```{admonition} Installing new snaps after updated validation assertion
:class: caution
If a validation assertions is updated to include additional snaps, the new snaps will not be installed automatically. They will instead need to be installed locally through the _snap_ command or through the [snapd REST API](https://snapcraft.io/docs/snapd-api#heading--snaps-post).
```

## Revoking assertion validity

The `snapcraft validate --revoke` command is used to remove an assertion for a snap, and consequently,  its validity requirements which means a gated snap will no longer refresh:

```bash
snapcraft validate --revoke <gating-snap> <gated-snap>=<revision> --key-name <signing-key>
```

## Limitations

At the moment, validations **by snap name** can only be issued to gate snaps which are **public** and have a release on the stable channel *at the moment of creating the validation*.  This is because `snapcraft validate` uses the details API to get the details from the stable channel only, and it doesn’t allow specifying another channel to get the gated snap’s details.

If you need to issue validations for non public snaps (such as snap in brand stores) or for snap revisions that are not released to the stable channel, you need to fallback to using snap IDs instead of snap names, and the operate as usual.

In the following example, we are validating revision _1234_ of the `core` snap which is not the current stable release:

``` bash
$ snapcraft validate roadmr-gating 99T7MUlRhtI3U0QFgl5mXXESAiSwt776=1234
Getting details for 99T7MUlRhtI3U0QFgl5mXXESAiSwt776
Signing validations assertion for 99T7MUlRhtI3U0QFgl5mXXESAiSwt776=1234
```

