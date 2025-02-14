(explanation-system-snaps-network-manager-how-to-guides-configure-wifi-connections)=
# Configure Wi-Fi connections

This section explains how to establish a Wi-Fi connection. It covers creating and modifying connections as well as directly connecting.

## Establish a connection

This section will show how to establish a wifi connection to the wireless network. Note that directly connecting will implicitly create a connection (that can be seen with "nmcli c"). The naming of such will follow "SSID N" pattern, where N is a number.

First, determine the name of the Wi-Fi interface:

```bash
$ nmcli d
DEVICE             TYPE      STATE         CONNECTION
...
wlan0              wifi      disconnected     --
```

Make sure the Wi-Fi radio is on (which is its default state):

```bash
nmcli r wifi on
```

Then, list the available Wi-Fi networks:

```bash
$ nmcli d wifi list
*  SSID           MODE   CHAN  RATE       SIGNAL  BARS  SECURITY
   ...
   my_wifi      Infra  5     54 Mbit/s  89      ▂▄▆█  WPA2
```

As an example, to connect to the access point 'my_wifi', you would use the following command:

```bash
nmcli d wifi connect my_wifi password <password>
```

\<password\> is the password for the connection which needs to have 8-63 characters or 64 hexadecimal characters to specify a full 256-bit key.

## Connect to a hidden network

A hidden network is a normal wireless network that simply does not broadcast it's SSID unless solicited. This means that its name cannot be searched and must be known from some other source.

Issue the following command to create a connection associated with a hidden network <ssid>:

```bash
nmcli c add type wifi con-name <name> ifname wlan0 ssid <ssid>
nmcli c modify <name> wifi-sec.key-mgmt wpa-psk wifi-sec.psk <password>
```

Now you can establish a connection by typing:

```bash
nmcli c up <name>
```

\<name\> is an arbitrary name given to the connection and <password> is the password to the network. It needs to have between 8-63 characters or 64 hexadecimal characters in order to specify a full 256-bit key.

## Further information

You will find further information and more detailed examples on following pages:

- https://developer.gnome.org/NetworkManager/unstable/nmcli.html

