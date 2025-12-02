# Debug install mode

When developing an Ubuntu Core image, it's not always easy to investigate what might cause an installation to fail.

However, it is possible to modify such an image's [gadget snap](/how-to-guides/image-creation/build-a-gadget-snap) to provide an install mode debug shell without affecting the device's overall configuration.  This is useful if you're debugging an actual `install-device` hook, for instance, and you want a real shell to run things in rather than just modifying your hook and re-flashing and waiting. The process is outlined below.

## Gadget snap modifications

Two files in the gadget snap need to be updated or created:

* `install-device`: this hook is used to crudely block the installation from proceeding
* `cmdline.full`: used to modify the kernel command line to enable the shell.
   This file is only used on amd64/Grub devices. If you are on an ARM (or not using Grub, you will need to modify the kernel command line yourself.

### install-device hook

The `install-device` hook should contain something similar to the following:

```bash
#!/bin/sh

sleep infinity
```

The above will block the installation from proceeding, allowing unlimited time to examine the system in its potentially broken installation state.

### cmdline.full

The second part involved editing _systemd's_ kernel command line interface to disable the service that takes over a given TTY and replace it with a debug shell  with root access.

This is only for development and should never be left enabled in production.

The following needs to be placed in `cmdline.full` within your gadget snap:

```
# this is the first serial console, pick a suitable one for your device
console=ttyS0 

# debug things to get more output from snapd
snapd.debug=1

# these will output more device status/logging to our console,
# which is kinda annoying in that it goes to the same place we 
# have our shell, but I think it's more useful to be able to see 
# than have a perfectly pristine console, if you have multiple
# consoles you could of course use a different console for
# systemd output and your debug shell
rd.systemd.journald.forward_to_console=1
systemd.journald.forward_to_console=1

# to disable console-conf from running on ttyS0 so we can setup
# our debug shell there, this is the most key part here, without
# this console-conf will kill/prevent from starting our debug shell
systemd.mask=serial-getty@ttyS0.service

# create our debug shell on ttyS0
systemd.debug-shell=ttyS0

# needed in order to allow the debug-shell to run on UC20
dangerous

# standard Ubuntu Core kernel command line parameters
panic=-1
```

The above should be placed in _cmdline.full_ rather than _cmdline.extra_ because we want to change the default console settings (at least on _amd64_, in the default pc gadget). 

If you're on ARM, or not using Grub, the above arguments need to be transferred to the kernel command line for your boot-loader.

See [Modify kernel options](/how-to-guides/manage-ubuntu-core/modify-kernel-options) for details on how to incorporate the above files into a gadget snap.

## Booting up your device

The final step is to rebuilt the gadget snap, rebuild your image with the new gadget snap, and flash it to the device.

After booting your device, it will stop during installation, either because of the issue you're trying to debug, or because of the infinite wait in the install-device-hook. You now have root shell access to your system and can freely examine its state.
