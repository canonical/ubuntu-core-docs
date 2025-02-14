(explanation-system-snaps-network-manager-reference-snap-configuration-connectivity-check)=
# Connectivity check

Connectivity checking is a NetworkManager functionality that allows periodically testing whether the system can actually access the internet or not. The network-manager snap allows configuring this feature by using the following snap settings:

* **connectivity.interval** : it specifies the number of seconds between checks. If set to 0, it disables connectivity check. Set to 300 by default.
* **connectivity.response** : This is the expected HTTP body response from the server specified by connectivity.uri.
* **connectivity.uri** : The URI where NM is going to periodically access to check connectivity.

More details on how these options work can be found in the connectivity section of the [NetworkManager.conf configuration file documentation](https://developer.gnome.org/NetworkManager/stable/NetworkManager.conf.html).

Some example commands on how to set a check every three minutes using the Ubuntu connectivity check server are
```bash
snap set network-manager connectivity.uri=http://connectivity-check.ubuntu.com/ $ snap set network-manager connectivity.interval=180
```

