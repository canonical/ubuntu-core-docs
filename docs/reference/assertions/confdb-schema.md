(reference-assertions-confdb-schema)=
# confdb-schema

The confdb-schema assertion acts as a contract that allows us to define granular views onto a custom configuration namespace that can be evolved separately from the persisted configuration data. This decouples the configurations exposed to snaps from the stored data, making it easier to evolve the data's schema without requiring snaps to change with it. The rules also support other useful features for controlling configurations such as fine-grained access control, cross-snap configuration and applying constraints on configuration values.

The assertion is composed of two main elements: a `views` header and a storage schema. The `views` header contains sets of rules that each expose a "view" onto the configuration namespace. In practice, these look like mappings of request paths to storage paths. When a snap accesses a particular confdb path, snapd matches it to a rule's request path and uses the corresponding storage path to access the configuration data in its storage. The storage schema, defined in the body of the assertion, describes the schema that the stored data must conform to to be accepted. This schema is expressed as types and constraints in JSON format.


In a sense, this assertion provides two schemas: the rules in each view act as a schema describing the "public" configuration space that snaps interact with, while the body of the assertion describes the schema of the stored data.

## confdb-schema assertion fields

The format of the confdb-schema assertion is as follows:

```yaml
type:         confdb-schema
account-id:   <authority account-id>
authority-id: <account-id>
name:         <confdb-schema name>
summary:      <description of schema>
views:
  <view name>:
    summary:  <description of view>
    rules:
      -
        request: <dotted request path>      # optional, defaults to storage
        storage: <dotted storage path>
        access:  <read|write|read-write>    # optional, defaults to read-write
        content:                            # optional, shorthand for a new nested rule
            -
              request: <dotted path suffix> 
              storage: <dotted path suffix> 
            ...
        ...
  ...
timestamp:          <UTC datetime>
sign-key-sha3-384:  <key id>                # Encoded key id of signing key

{
  "storage": {
    "schema": {
      ... 
    }
  }
}

<signature>                                 # Encoded signature
```

The `views` header can have any number of views, each with a fine-grained set of rules and access controls tailored to a specific use case. Each view must contain a `rules` list with each rule describing how a particular configuration can be accessed from outside the system and where snapd should store and retrieve it:

- **`storage`** (*required*)
    A dotted path to a stored JSON value. Must not be prohibited by the storage schema declared in the body.
- **`request`** (*optional*)
    A dotted path describing how the snap or admin can access the value. If omitted, defaults to the storage path.
- **`access`** (*optional*)
    Access control for the given rule. Can be read-only, write-only or read-write. If omitted, defaults to read-write.
- **`content`** (*optional*)
    Describes a nested rule that will be created with the parent's rule `request` and `storage` paths as prefixes. Semantically equal to creating a parallel rule with the same prefix. The `access` value is not inherited.
   
An example of this assertion is:

```yaml
type:         confdb-schema
authority-id: acme
account-id:   acme
name:         sensors
summary:      Configuration for a series of temperature sensors
timestamp:    2025-04-02T19:31:32Z
views:
  configure-sensors:
    summary:  Configure sensor parameters
    rules:
      -
        request: {sensor}.min-activation
        storage: min-value.{sensor}
      -
        request: {sensor}.sample-rate
        storage: sample-rate.{sensor}
  read-sensor-1-params:
    summary:  Read sensor-1’s configuration
    rules:
      -
        request: sensor-1.min-activation
        storage: min-value.sensor-1
        access: read
  read-sensor-2-params:
    summary:  Read sensor-2’s configuration
    rules:
       -
        request: sensor-2.sample-rate
        storage: sample-rate.sensor-2
        access: read
body-length: 552
sign-key-sha3-384: 74KHeq1foV...

{
  "storage": {
    "aliases": {
      "sensor-name": {
        "pattern": "^sensor-[a-zA-Z\\d]+$",
        "type": "string"
      }
    },
    "schema": {
      "min-value": {
        "keys": "$sensor-name",
        "values": {
          "max": 5600,
          "min": -273.15,
          "type": "number"
        }
      },
      "sample-rate": {
        "keys": "$sensor-name",
        "values": {
          "choices": [
            100,
            500,
            800
          ],
          "type": "int"
        }
      }
    }
  }
}

AcLBcwQAAQoAHRYhBNZz2pAPEwnvCBlCWDJ7flC3CTN3BQJn0/muAAoJEDJ7flC3CTN3abMQAKde
pq2emmvcElyUfJhfCXw391X5UC8rMGeHm4vUKfFDRGCeplyFFmVaiyIZ4d39NQr38wI5r9yLJB1W
...
```

As can be seen in the example, the schema is expressed as a set of nested JSON objects with types and constraints. All keys are optional such that a partial or empty configuration is considered valid and values can be any JSON value, except `null`.
There are seven predefined types: `map`, `array`, `string`, `int`, `number`, `bool` and `any`. In addition to those types, user-defined types can also be introduced and later referred to with a ``$`` prefix. We'll describe these types and their constraints in detail below.

Typically, a type will look like:

```
{ 
  "type": "some_type",
  "some-constraint": ...
}
```

If no constraints are required, the type may be a simple string. For instance, `int` is this example:

```
{
  "type": "map",                # "complex" type definition as map
  "schema”: {
    "sequence": "int"           # "simple" type definition as string
  }
}
```

All storage schemas start with a map with a single storage field under which should be a map with one or two special keys: a mandatory `schema` key and an optional `aliases` key. The `schema` defines the expected data format. The `aliases` field is a map of new type definitions built on the existing types and constraints. We’ll expand on user-defined types in the next section. It’s worth noting that these rules are specific to the top level storage map and do not apply to nested maps. Aliases cannot be defined in any other maps and, also unlike the top-level map, nested maps can constrain their keys and values in ways other than a `schema` constraint.

## Schema Types

### Map
Maps can take two forms. The first defines a `schema` constraint, which associates expected keys to the types their values may take. This can be augmented by a `required` constraint to express a set or sets of key combinations that must be present.

```
{
  "type": "map",
  "schema”: {
    "name": "string",
    "revision": "int",
    "version": "string"
  },
  "required": [["name", "revision"]]
}
```

The schema above is correct but can be simplified in two ways. First, the `map` type is the default type when the type key is omitted. Second, in cases where there is only a single required alternative, it can be listed as a non-nested list. So the simpler equivalent schema is:

```
{
  "schema”: {
    "name": "string",
    "revision": "int",
    "version": "string"
  },
  "required": ["name", "revision"]
}
```

Alternatively, maps can also be constrained without a strict schema. It’s possible to simply declare the types that keys and/or values must match, using the constraints `keys` and `values`. The type used in `keys` must be either `string` or an alias reference based on `string`.

```
{
  "keys": "string",
  "values": "int"
}
```

### String

Strings can be constrained using regular expression patterns.

```
{ 
  "type": "string",
  "pattern": "^(\d+\.)?(\d+\.)?(\d+)$"
}
```

Alternatively, we can list accepted values:

```
{ 
  "type": "string",
  "choices": ["2.69", "2.68.3", "3"]
}
```

### Array

The `array` type requires a `values` constraint to define its elements’ type. It also permits setting the `unique` constraint to true, if we want all values to be distinct:

```
{ 
  "type": "array",
  "values": "int",
  "unique": true
}
```

### Number and Int
The `number` and `int` types work in a similar fashion, with the difference that `number` allows floating point numbers and `int` only allows integers. Both types support the optional constraints `min` and `max`:

```
{ 
  "type": "number",
  "min": 1.337,
  "max": 3.14,
}
```

```
{ 
  "type": "int",
  "min": 5,
  "max": 11
}
```

### Boolean
The `bool` type accepts the `true` or `false` values and does not support any constraints.

```
{ 
  "type": "bool"
}
```

### Any
The `any` type accepts any JSON value other than `null`.

```
{ 
  "type": "any"
}
```

### Alternative Types
Type definitions can also take the form of a list of alternative types. When validating data against alternatives, each type is tried in order until one accepts the input data.

```
{ 
  "schema": ["string", "number"]
}
```

### Aliases
`aliases` is a special field in the top level map where user-defined types can be composed from the predefined types and their constraints. This field must be a map associating new type names to their type definitions. Type definitions can then use these aliases by prefixing them with a `$` character.

```
{
  "storage": {
    "aliases": {
      "version_str": { 
        "type": "string",
        "pattern": "^(\d+\.)?(\d+\.)?(\d+)$"
      }
    }
  },
  "schema": {
    "name": "string",
    "version": "$version_str"
  }
}
```
