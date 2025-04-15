(reference-assertions-validation-set)=
# validation-set

A validation set is an assertion that lists specific snaps that are either required to be installed together or are permitted to be installed together on a device or system.

One or more validation sets can be used to ensure only specific snaps are installed, and optionally, only specific snaps at fixed revisions. They can help a set of interdependent snaps maintain their testing and certification integrity, as well as help orchestrate their updates. But they can equally be used to simplify dependency deployment and to help manage devices.

For more information on its usage with snaps, see the [Snapcraft documentation](https://snapcraft.io/docs/validation-sets).

The validation-set assertion format is as follows:

```yaml
type:           validation-set
authority-id:   <authority account id>
series:         <list of series which should accept this assertion>
account-id:     <account id>
name:           <validation set name>
revision:       <int>
sequence:       <int>
snaps:
  - name:       <snap name>
    id:         <snap id>
    presence: [required|optional|invalid]  # Optional, defaults to required.
    revision: <n> # The revision of the snap. Optional.
    
timestamp:          <UTC datetime>
sign-key-sha3-384:  <key id> # Encoded key id of signing key

<signature>                 # Encoded signature
```

The above template validation set assertion needs to be populated with the details of the snaps you wish to include in the set. These are listed beneath the `snaps:` section, and each snap can use the following fields:

- **`name`** (*required*)
   The name of the snap, as you find on the store or in _snap search_. 
- **`id`** (*optional*)
   The unique snap-id of the snap (see _snap info \<snap name\>_ ).
   Defaults to the snap-id of the named snap.
- **`presence`** (*optional*)
   Can be either `required`, `optional` or `invalid`. 
   `required` snaps need to be installed, `optional` snaps are permitted to be installed and `invalid` snaps explicitly must not be installed.
   Defaults to _required_.
- **`revision`** (*optional*)
   Specifies which revision of the snap needs to be installed.
   
An example of this type:

```yaml
type: validation-set
authority-id: example-account
series: 16
account-id: example-account
name: testset1
sequence: 1
snaps:
  -
    id: buPKUD3TKqCOgLEjjHx5kSiCpIs5cMuQ
    name: hello-world
timestamp: 2021-12-14T13:56:22Z
sign-key-sha3-384: b-mO5Wolu7bgpmXmRyICa3b2Vvcpi-uX5AIenSiwTi_6RKhTAOqwe4W3vNtb6O2y

AcLBcwQAAQoAHRYhBFwZ6nBkn0/POY1BgvtdqilNkrIXBQJhuKKGAAoJEPtdqilNkrIXcfwQAKbm
P8XBkYyG9TWDRuh+A9YYndY6m/vjfUbJP7psau3JNheW10Hm6cl8pdhNaktC/neKClFEpXp1rgN5
RtfenH/FsaYH176e+104171bHFL29GfGi1Aewl2Hc50XvzMcNPa4L91uhCDGzXpEBsYNwMxvDnWs
1Ze9zvedGF5JcWX97HOnyY3T4nYRQKkt3OFTyOJpuGfJOXGL+9mhkaunmcKab89g0jgnLt1o6CYE
vbHjbE5ayR6bV4Ily3Z6ffUkjJRvGmR4UinutXe0v5M6oFeYim/GbgVT2ciLrzvJDklRQlvKQfyG
OosR8dSVrIaTl0Xo+qfCGQzdjol3oD6gFVZJ9mhE6KjJsV7MJFCVU9WcAH697Rh4JVzmaQv44AOy
4btDzUmWvaA8fATBhtZmA9kk3zhxB04ZLSojIuZ9zES5b+OwA4QqrGjsPAqBkpQeQ6GhqPC6qEZK
HnSGOxUpeAkYW+L0oB6RA5KtGMSuDNbtWyWrIhwWiOBaZceCuZUFo4Oost1QbxGrKXa97IHZKSLv
fRkUz2cgVhuBVZS8Z6eecCIDqdGnzWOW4z0h35QQvzEmqhMHHrtJFGF43V7RO80puT4B3m55aTkt
1QE72e3BsVUEa3sx/lMfVX7dSNoJkDtSkw0Ft3teqNMkhPbEBkobjrzTzX9xwJ+mFT9NPSPH

```

