# NetworkManager and Netplan

Ubuntu Core's default Netplan configuration defers networking to _networkd_.

When [Network Manager](https://help.ubuntu.com/community/NetworkManager) is installed (`snap install network-manager`), a new Netplan configuration replaces networkd with _network-manager_, taking control of all networking devices.

This behaviour can be controlled with the `defaultrenderer` snap option. By default, this is set to `true` to allow network-manger to control networking. If set to `false`, network-manager reverts the default Netplan configuration, giving control of network devices back to networkd.

```bash
snap set network-manager defaultrenderer=false
```

Note that only devices explicitly configured within Netplan configuration files, usually only ethernet or wifi, are given back to networkd.

## YAML backend

From _core20_ onwards, network-manager been modified to use a YAML backend that's based on _libnetplan_ functionality.

The YAML backend replaces the keyfile format used by Network Manager with `/etc/Netplan/*.yaml`.

The default configuration, for example, can be output by running the `cat sudo cat /etc/netplan/00-snapd-config.yaml` to produce show following output:

```yaml
# This is the network config written by 'console-conf'
network:
  ethernets:
    enp0s2:
      dhcp4: true
  version: 2
```

On boot the Netplan.io generator processes all of the YAML files and renders them into the corresponding a Network Manager configuration in `/run/NetworkManager/system-connections`. The usual `Netplan generate/try/apply` can be used to re-generate this configuration after the YAML was modified.

If a connection profile is modified or created from within Network Manager, such as updating a Wi-Fi password with `nmcli`, Network Manager will create an ephemeral keyfile that will be immediately converted to Netplan YAML and stored in `/etc/Netplan`. Network Manager automatically calls `Netplan generate` to re-process the current YAML configuration to render Network Manager connection profiles in `/run/NetworkManager/system-connections`.

The system wide network configuration can be read with `sudo netplan get`:

```yaml
network:
  version: 2
  renderer: NetworkManager
  ethernets:
    enp0s2:
      dhcp4: true
```

System wide network settings can be modified with `netplan set`:

```bash
sudo netplan set ethernets.enp0s2.addresses=[10.0.2.15/24]
```

Configuration options that are not supported by the Network Manager YAML backend are stored in a `networkmanager.passthrough` YAML mapping to ensure they are not lost during the Netplan conversion.

