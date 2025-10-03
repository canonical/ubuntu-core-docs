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

The upstream udisks2 provides interfaces to enumerate and perform operations on disks and storage devices. Any snap with the udisks2 interface plug can access the udisksd daemon via the name `org.freedesktop.UDisks2` on the system message bus.

In addition to the D-Bus API, a library, libudisks2 can be used by snaps to help facilitate this communication. This library can be used from C/C++ and any high-level language with GObjectIntrospection support such as Javascript and Python. 

udisks is only indirectly involved in what devices and objects are shown in the user interface.

## Upstream documentation

Documentation for the upstream project can be found at [https://storaged.org/doc/udisks2-api/](https://storaged.org/doc/udisks2-api/).

```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

*
*/index
