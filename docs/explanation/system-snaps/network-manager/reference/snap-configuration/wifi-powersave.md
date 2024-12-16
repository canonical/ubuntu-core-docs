(explanation-system-snaps-network-manager-reference-snap-configuration-wifi-powersave)=
# WIFi Powersave


WiFi Powersave is a feature that allows a device to suspend its radio activity after a fixed period of inactivity. The device remains idle for a fixed time, usually about 100ms, and once it is reached it wakes up to check if the infrastructure has any packets queued up for it.

The NetworkManager snap allows to configure this option by either enabling or disabling the powersave feature.

You can read more about the WiFi Powersave feature on the following sites:

* https://wireless.wiki.kernel.org/en/developers/documentation/ieee80211/power-savings

### Enable WiFi Powersave

To allow users to enable or disable WiFi Powersave, the snap provides a single configuration option:

* wifi.powersave

Option can be set via the configuration API snaps provide. See [Managing snap configuration](https://snapcraft.io/docs/configuration-in-snaps) for more details.

#### wifi.powersave

This configuration option accepts the following values:

* **disabled (default):**  WiFi powersaving is disabled
* **enabled:**  WiFi powersaving is enabled

