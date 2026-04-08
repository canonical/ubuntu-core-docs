(explanation-system-snaps-network-manager-reference-snap-configuration-default-renderer)=
# Default renderer


The NetworkManager snap provides a configuration option,  `defaultrenderer` , to adjust if it should be the default network renderer or not. By default, it is set to  `true` . To change it:

```bash
$ snap set network-manager defaultrenderer=false
```

For the core16 snap, there is an option called  `ethernet.enable`  that does basically the same. See the {ref}`NetworkManager and netplan <ref-networkmanager-and-netplan_networkmanager-and-netplan>` section for more details.

