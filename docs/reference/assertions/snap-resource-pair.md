(reference-assertions-snap-resource-pair)=
# snap-resource-pair

The `snap-resource-pair` assertion is one of two assertions used by [components](https://snapcraft.io/docs/components), the other being {ref}`snap-resource-revision <reference-assertions-snap-resource-revision>`.

This assertion defines the relationship between a [snap revision](https://snapcraft.io/docs/revisions) and a component revision. This assertion states that the given snap revision and component revision may be installed alongside each other.

The primary keys are `snap-id`, `snap-revision`, `resource-name`, `resource-revision`, and `provenance`. Note that `provenance` is only relevant if the snap itself defines a provenance.

## Assertion fields

```yaml
type: snap-resource-pair
authority-id: canonical|<delegated-authority-id>
snap-id: <snap-id>
resource-name: <resource/component-name>
resource-revision: <resource-revision>
snap-revision: <snap-revision>
provenance: <provenance> # optional, like for snap revisions
developer-id: <publisher/uploader-id>
```

