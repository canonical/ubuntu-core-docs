(reference-assertions-snap-resource-revision)=
# snap-resource-revision

The `snap-resource-revision` assertion is one of two assertions used by [components](https://snapcraft.io/docs/components), the other being {ref}`snap-resource-pair <reference-assertions-snap-resource-pair>`.

This assertion performs a similar function to the {ref}`snap-revision <reference-assertions-snap-revision>` assertion, but for components. It describes a component revision and provides the metadata needed to verify that a component blob is a specific revision.

The primary keys are `snap-id`, `resource-name`, `resource-sha3-384`, and `provenance`. Note that `provenance` is only relevant if the snap itself defines a provenance.


## Assertion fields

 ```yaml
type: snap-resource-revision
authority-id: canonical|<delegated-authority-id>
snap-id: <snap-id>
resource-name: <resource/component-name>
resource-sha3-384: <resource-hash>
provenance: <provenance> # optional, like for snap revisions
resource-revision: <resource-revision>
resource-size: <resource-size>
developer-id: <publisher/uploader-id>
 ```

