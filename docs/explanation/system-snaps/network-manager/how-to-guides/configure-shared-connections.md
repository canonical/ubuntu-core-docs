(explanation-system-snaps-network-manager-how-to-guides-configure-shared-connections)=
# Configure shared connections


NetworkManager makes very easy to share connectivity, using the device as a gateway to which other devices can connect. That requires running commands similar to
```bash
nmcli c add con-name <name> type ethernet ifname <iface> ipv4.method shared ipv6.method ignore
nmcli c up <name>
```
where  `<name>`  is an arbitrary name we give to the connection and  `<iface>`  is the name of the interface where external devices will connect to. In this case we are using an ethernet interface ( `type ethernet` ) and we provide IPv4 addresses, but this extends to other interfaces and to IPv6.

When the connection is up, NM starts a DHCP server listening on  `<iface>`  and changes the networking configuration so we can forward packages and masquerading is enabled for the interface. Of course, for this to work we need an interface different from  `<iface>`  that has to have external connectivity.

