(explanation-system-snaps-network-manager-how-to-guides-configure-wifi-access-points)=
# Configure Wi-Fi access points

It is possible to create Wi-Fi Access Points with the network-manager snap. This can be done by running
```bash
nmcli d wifi hotspot ifname <wifi_iface> ssid <ssid> password <password>
```
where  `<wifi_iface>`  is the wifi network interface,  `<ssid>`  is the SSID for the AP that we are creating and that will be visible to devices connecting to it, and  `<password>`  is the access password (that needs to have between 8-63 characters or 64 hexadecimal characters). NM will create a connection called ' `Hotspot <N>` ' if the command is successful.

The created AP offers by default a shared connection, so devices connected to it should be able to access the Internet if the device providing the AP has access too.

