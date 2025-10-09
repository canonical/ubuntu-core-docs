# Including console-conf in a model assertion

[Model
assertions](https://documentation.ubuntu.com/core/reference/assertions/model/)
define the snaps that a system will install on first boot.

Adding console-conf would be a matter of adding a snap to the snaps list in the
json source for the assertion, for instance:

```json
        {
            "name": "console-conf",
            "type": "app",
            "default-channel": "24/stable",
            "id": "ASctKBEHzVt3f1pbZLoekCvcigRjtuqw",
            "presence": "optional"
        }
```

The track for the default channel should match the base (which in the end is
the Ubuntu Core version) of the model assertion. To know the available tracks,
run `snap info console-conf` from the command line.

In this case we have set the snap as optional, so we can decide at image build
time if we want to include it and then create a development image, or do not
include it to create a production image.

We can sign the final assertion with 

```text
$ snap sign model.json > model.assert
```

After this, we can create an image that would include console-conf with

```text
$ ubuntu-image snap --snap=console-conf model.assert
```
