(explanation-system-snaps-udisks2-index)=
# Udisks2

The udisks snap provides a daemon and tools to access and manipulate disks and storage devices.

The tools carried by the snap allows the user to:

- Shows high-level and detailed information about disk drives and block devices.
- Mount and unmounting of block devices.
- Block device lock and unlocking.
- Manipulating loop-devices.
- Power off devices for safe removal.
- SMART functionality.

## What Udisks2 Offers

The upstream udisks2 provides interfaces to enumerate and perform operations on disks and storage devices. Any snap with the `udisks2:dbus` interface plug can access the udisksd daemon via the name [org.freedesktop.UDisks2](https://storaged.org/doc/udisks2-api/latest/ch03.html) on the system message bus.

## Upstream documentation

Documentation for the upstream project can be found at [https://storaged.org/doc/udisks2-api/](https://storaged.org/doc/udisks2-api/).

```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

*
*/index
