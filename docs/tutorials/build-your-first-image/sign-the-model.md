---
myst:
  html_meta:
    description: Sign your Ubuntu Core model assertion with GPG keys to create verifiable model files linked to your account.
---

(ref-sign-the-model_sign-the-model)=
#  Sign the model

After a model has been {ref}`created or modified <ref-create-a-model_create-a-model>`,
it must be signed with a GPG key to become a _model assertion_. This ensures
the model cannot be altered without the key and also links the created image
to both the signed version of the model and your {ref}`Ubuntu One account <ref-access-ubuntu-one_access-ubuntu-one>`.

(ref-sign-the-model_signing-key)=
## Check you have a registered key

Signing requires a key registered to your Ubuntu One account. List the keys you have:

```bash
$ snapcraft keys
    Name          SHA3-384 fingerprint
*   my-model-key  <key fingerprint>
```

If no keys are listed, create one and register it before continuing. See
[Signing keys](https://snapcraft.io/docs/explanation/security/signing-keys/) for
details. One key normally covers all of your models, so this is a one-time step.

## Update the timestamp

As mentioned earlier, the timestamp in the model assertion must be set to a time and date _after_ the creation of our key. This means we need to edit `my-model.json` to update the timestamp with the current time.

```json
    "timestamp": "2026-05-07T10:40:41+00:00",
```

This is a UTC-formatted time and date value, used to denote the assertion's creation time. It needs to be replaced with the current time and  date, which can be generated with the following command:

```bash
$ date -Iseconds --utc
2026-05-07T09:29:09+00:00
```

## Sign the model

A model assertion is created by feeding the JSON file into the `snap sign`
command with your key name and capturing the output in the corresponding model
file:

```bash
snap sign -k my-model-key my-model.json > my-model.model
```

The resultant `my-model.model` file contains the signed model assertion and can now be used to build the image.

```{admonition} Signing failed error?
:class: tip
If you encounter a _gpg: signing failed_ error while signing your assertion from a non-desktop session, such as over SSH, run `export GPG_TTY=$(tty)` first.
```

