(explanation-system-snaps-network-manager-reference-snap-configuration-debug)=
# Debug the snap

Debug is a feature that controls the amount of logs produced by the network-manager snap. It is useful for collecting information required to either report a bug or investigate a network-manager failure (if happens).

It is disabled by default and has to be explicitly turned on for usage.

Note that the debug logs may contain sensitive information.

## Enable Debug

The network-manager snap provides a single configuration option which can be used to turn the debug feature either on or off:

* **debug.enable**

The option takes a boolean value. The meaning of the possible values are:

* **true:**  Enable logging debug information
* **false (default):**  Disable logging debug information

Changing the  **debug**  configuration option has immediate effect and also affects future executions of the NM daemon.

**Example:**  Enable debug feature
```bash
snap set network-manager debug.enable=true
```
**Example:**  Disable debug feature.
```bash
snap set network-manager debug.enable=false
```
## Viewing logs

The debug information, when enabled, will be available in the journal and can be viewed with:
```bash
journalctl --no-pager -l -u snap.network-manager.networkmanager.service
```

