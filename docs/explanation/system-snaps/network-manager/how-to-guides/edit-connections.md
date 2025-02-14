(explanation-system-snaps-network-manager-how-to-guides-edit-connections)=
# Edit connections

This section shows how to use the network-manager built-in editor to modify connections as well as provide a reference for changing some of the settings.

## Using nmcli Console
Aside from offering the possibility to manage and modify the network connections using the command-line, network-manager offers a built-in, interactive console to achieve the same. In order to use it type:

```bash
nmcli connection edit
```

It will bring up an interactive console. In the first step you will be prompted to enter the connection type. The list of valid connection types will be displayed on the screen. Once you select one you will be taken to the nmcli console where you have the possibility to modify its parameters.

Alternatively, if you know the valid connection types, you could jump straight to the nmcli console by providing the type as a parameter:

```bash
nmcli connection edit type <type>
```

where <type> must be a valid connection type such as 'wifi'.

An attempt to edit the wifi connection type would look like:
```bash
$ nmcli c edit

Valid connection types: generic, 802-3-ethernet (ethernet), pppoe,
802-11-wireless (wifi), wimax, gsm, cdma, infiniband, adsl, bluetooth, vpn,
802-11-olpc-mesh (olpc-mesh), vlan, bond, team, bridge, bond-slave, team-slave,
bridge-slave, no-slave, tun, ip-tunnel, macvlan, vxlan
Enter connection type: wifi

===| nmcli interactive connection editor |===

Adding a new '802-11-wireless' connection

Type 'help' or '?' for available commands.
Type 'describe [<setting>.<prop>]' for detailed property description.

You may edit the following settings: connection, 802-11-wireless (wifi),
802-11-wireless-security (wifi-sec), 802-1x, ipv4, ipv6
nmcli>
```

From now on it is possible to edit the wifi connection settings. The list of settings is provided as in the example above. The nmcli console offers a set of commands that can be used to navigate between settings. To get the list of available commands type 'help' or '?'

```bash
nmcli> ?
```
