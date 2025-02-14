(explanation-system-snaps-network-manager-how-to-guides-message-logging)=
# Message logging

This section shows how to modify the logging levels by NetworkManager.

NetworkManager supports on the fly changing of the logging levels and allows for a fine grained control over what is logged.

First check what is the current logging setup, type:
```bash
nmcli general logging
```
As a result you will be presented with the information about the current configuration:

```
LEVEL  DOMAINS                                                                                                                                                                                                                 
INFO   PLATFORM,RFKILL,ETHER,WIFI,BT,MB,DHCP4,DHCP6,PPP,IP4,IP6,AUTOIP4,DNS,VPN,SHARING,SUPPLICANT,AGENTS,SETTINGS,SUSPEND,CORE,DEVICE,OLPC,INFINIBAND,FIREWALL,ADSL,BOND,VLAN,BRIDGE,TEAM,CONCHECK,DCB,DISPATCH,AUDIT,SYSTEMD 
```
It is possible to change the level either globally or for each domain separately. The command to achieve this is:

```bash
nmcli general logging [level <level> [domain <domain>]]
```

The <level> is the desired log level. You can choose from the following:

- **ERR**: will log only critical errors
- **WARN**: will log warning messages
- **INFO**: will log various informational messages
- **DEBUG**: enables verbose logging for debugging purposes
- \<domain\> is the category of messages that shall be logged with given severity.
   - **Wi-Fi** will include only Wi-Fi related messages
   - **IP4** will include only IPv4 related messages, and so on.

