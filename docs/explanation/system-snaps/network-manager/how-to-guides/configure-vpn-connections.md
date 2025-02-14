(explanation-system-snaps-network-manager-how-to-guides-configure-vpn-connections)=
# Configure VPN connections

VPN support requires both the use of `core22` and network-manager from a `22/*` channel. Currently, two types of VPN are supported:

- [OpenVPN](#openvpn)
- [WireGuard](#wireguard)

## OpenVPN

Network Manager supports two methods to create an OpenVPN connection:
- import an OpenVPN credentials file
- set required parameters manually with `nmcli` invocations

In both cases, files used in the definition must be copied to folders where the _network-manager_ snap has access, which is usually in SNAP_DATA or SNAP_COMMON folders.

The first method requires only that the OpenVPN configuration file is copied to one of these locations:

```bash
sudo nmcli c import type openvpn file /var/snap/network-manager/common/myopenvp.ovpn
```

This command needs to be run as root because it creates certificate and key files with data extracted from the configuration file. These need to be accessible by the network-manager snap, which itself runs with root id.

Using the second method requires copying around certificates and keys and creating/modifying the connection as required. For instance:

```bash
nmcli c add connection.id vpntest connection.type vpn \
    vpn.service-type org.freedesktop.NetworkManager.openvpn \
    ipv4.never-default true \
    ipv6.never-default true \
    +vpn.data ca=/var/snap/network-manager/common/creds/server_ca.crt \
    +vpn.data cert=/var/snap/network-manager/common/creds/user.crt \
    +vpn.data cert-pass-flags=0 \
    +vpn.data cipher=AES-128-CBC \
    +vpn.data comp-lzo=adaptive \
    +vpn.data connection-type=tls \
    +vpn.data dev=tun \
    +vpn.data key=/var/snap/network-manager/common/creds/user.key \
    +vpn.data ping=10 \
    +vpn.data ping-restart=60 \
    +vpn.data remote=<server>:<port> \
    +vpn.data remote-cert-tls=server \
    +vpn.data ta=/var/snap/network-manager/common/creds/tls_auth.key \
    +vpn.data ta-dir=1 \
    +vpn.data verify-x509-name=name:access.is
```

## WireGuard

The recommended way to configure a WireGuard connection is to place a configuration file in a folder readable by the network-manager snap, such as SNAP_DATA or SNAP_COMMON folders, and to import the configuration with a command similar to the following:

```bash
nmcli c import type WireGuard file /var/snap/nm-vpn-client/common/wg.conf
```

As with an OpenVPN connection, it is also possible to create a WireGuard connection using only `nmcli` with multiple parameters. Unfortunately, configuring peers in this way is not currently possible (see [WireGuard in NetworkManager](https://blogs.gnome.org/thaller/2019/03/15/WireGuard-in-networkmanager/)).

## Configuring a VPN programmatically

To create a VPN connection programmatically, that is, from another snap, the user snap must define a [content interface](https://snapcraft.io/docs/content-interface). The connection must have a slot that  connects to the `vpn-creds` plug defined in the network-manager snap.

Once connected, any files necessary for the connection can be placed into the directory shared by the content interface. This folder is seen by the Network Manager snap `/var/snap/network-manager/common/creds`, which means that file path configuration also needs also use this prefix. After that, a connection can be created using Network Manager's `dbus` interface where a connected network-manager plug is required.

