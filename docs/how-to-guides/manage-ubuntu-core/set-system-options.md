(how-to-guides-manage-ubuntu-core-set-system-options)=
# Set system options


Ubuntu Core supports a set of system-wide options that allow you to customise your snap and core environment. See [Configuration options](/) for which options are supported.

As with [Configuration in snaps](https://snapcraft.io/docs/configuration-in-snaps), these options are changed with the `snap set` and `snap get` commands, but with a target of *system* instead of a specific snap:

``` bash
snap set system some.option="some value"
snap get system some.option
```

Configuration options can be unset by either passing their names to the unset command or by adding an exclamation mark (!) to the end of an option name: (from *snapd 2.41+*):

``` bash
snap unset system some.option
```
or

```
snap set system some.option!
```

Typing `snap get system` outputs a top-level view of system-wide option categories which can be added as arguments to view their contents:

``` bash
$ snap get system
Key           Value
experimental  {...}
refresh       {...}
seed          {...}
$ snap get system experimental
Key                   Value
experimental.hotplug  true
experimental.layouts  true
```

The entire set of system configuration options can be dumped as JSON by adding the -d option:

```bash
$ snap get -d system
{
        "experimental": {
                "hotplug": true,
                "layouts": true,
                "quota-groups": true
        },
        "refresh": {
                "last": "2017-05-25T09:03:58.664837614+01:00",
                "retain": 2
        },
        "seed": {
                "loaded": true
        },
        "system": {
                "hostname": "neon",
                "network": {},
                "timezone": "UTC"
        }
}
```

```{tip}

See [Gadget snaps](https://snapcraft.io/docs/gadget-snap#heading--gadget) for details on how to create a default set of configuration values for a device.
```

