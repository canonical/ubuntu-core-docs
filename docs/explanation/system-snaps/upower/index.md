(explanation-system-snaps-upower-index)=
# Upower

UPower is an abstraction for enumerating power devices, listening to device events and querying history and statistics. Any application or service on the system can access the [org.freedesktop.UPower](https://upower.freedesktop.org/docs/ref-dbus.html) service via the system message bus, as long as they connect using the [dbus interface](https://snapcraft.io/docs/dbus-interface) to the upower snap.

UPower is also useful to control the latency of different operations on your computer, which enables you to save significant amounts of power.

## What Upower Offers

The upstream upower project offers a wide range of features and most are available in the snap package.

The upower snap contains the upower cli tool, which enables:

- Inspecting battery information
- Inspecting power parameters for various devices
- Monitoring power events

In addition, the snap carries the upower daemon, which allows other applications and services to connect to, through dbus. To view all the methods supported by the dbus daemon, please refer to the upstream documentation.

## Upstream documentation

Documentation for the upstream project can be found at [https://upower.freedesktop.org/docs/](https://upower.freedesktop.org/docs/).

```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

*
*/index
