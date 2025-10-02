# console-conf

The console-conf snap is used for the initial configuration of users and
networking on Ubuntu Core. This snap is not meant to be installed in an already
running system, instead it is expected to be included in the model assertion,
making it part of the snaps that are installed on first boot.

Furthermore, console-conf is considered a development tool as initial
configuration of production devices is expected to happen in different ways.

**NOTE:** console-conf used to be part of the base snap in UC22 and older
versions, so this snap is used only in UC24 and more modern versions.


```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

Including in model assertion <model>
Using console-conf <usage>
