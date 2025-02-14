(explanation-system-snaps-network-manager-reference-routing-tables)=
# Manage routing tables

This section describes the way to setup routing table as well as it explains the logic used to prioritize interfaces.

The routing table is stored in the kernel which merely acts upon it. The route itself is set by the user-space tools. There is no preference as any tool created for this reason will do. It can be either a DHCP client, ip command or route command.

It is important to understand that NetworkManager changes the routing table whenever it creates a new connection.

Routing table acts as a junction and is there to show where the different network subnets will be routed to. An example of a routing table is shown below.

```bash
$ ip route \
    default via 10.0.0.1 dev wlp3s0 proto static metric 600 \
    10.0.0.0/24 dev wlp3s0 proto kernel scope link src 10.0.0.73 metric 600 \
    10.0.1.0/24 dev lxcbr0 proto kernel scope link src 10.0.1.1 \
    169.254.0.0/16 dev docker0 scope link metric 1000 linkdown \
    172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1 linkdown \
    192.168.122.0/24 dev virbr0 proto kernel scope link src 192.168.122.1 linkdown
```

The first column is the <Destination> subnet with the "default" being a wildcard for everything else. The "via" fragment points to the \<Gateway\> however when it is missing it indicates that that network is connected directly and instead it describes a source address.

The metric field/column translates to the number of hops required to reach the destination and is used to determine which route shall be preferred when there are more than one route available for a specific destination. Since this value is related to the concept of distance, the lower it's value is the better.

The metric value can be set manually however when NetworkManager creates a connection the following defaults are applied:

* Ethernet is preferred over Wi-Fi
* Wi-Fi is preferred over WWAN

### Editing the routing tables

The routing table can be added or modified using the standard  `ip`  command which is available on Ubuntu Core. You can find more information on its [man page](https://linux.die.net/man/8/ip).

Separately it is possible to modify routing information per single connection using the nmcli tool. The parameters such as: gateway, routes and metrics can be modified.

The following options are responsible:

```
ipv4.gateway:
ipv4.routes: 
ipv4.route-metric:

ipv6.gateway:
ipv6.routes:
ipv6.route-metric:
```

These options can be modified in a following way:

```bash
$ nmcli connection modify <name> +ipv4.routes <destination> ipv4.gateway <gateway>
$ nmcli connection modify <name> ipv4.route-metric <metric>
```

Where `<name>` is the connection name. You can obtain it by listing available connections on the system:

```bash
$ nmcli c show
```

* `<destination>` is the destination network provided as a static IP address, subnet or "default".
* `<gateway>` is the new gateway information. <metric> is the new metric information.

Note that this kind of changes can be made separately for each connection thus it is possible to provide a fine grained control over how the packets directed to different networks are routed.

It is also important to understand that bringing up and down connections with different values set for these options is in fact changing the routing table.

