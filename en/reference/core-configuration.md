---
title: Ubuntu Core Configuration
table_of_contents: true
---

# Ubuntu Core Configuration

The core snap offers a few configuration options which allow customization of
how the system works.

A configuration option of the core snap can be set via the *snap set* command
as for any snap, e.g.:

```
 $ snap set core option=value
```

The current value of an option can be retrieved via the *snap get* command,
e.g.:

```
 $ snap get core option
 value
```

The following configuration options are currently supported:

## service.ssh.disable

Available since: 2.22

Disable the SSH service of the system.

**WARNING**: Disabling SSH disables the default way to access an Ubuntu Core
system. If your system does not provide any other way to interact with it
like a management system or a monitor you will lock yourself out of the system
and will be left with a brick. If you really want to disable SSH make sure
you have a user and a password available and another way to interact with the
system.

The configuration option accepts the following values:

 * `false` (default): Enable the SSH service. The SSH service will directly
 available for incoming connections.
 * `true`: Disable the SSH service. Existing SSH connection will remain but
 establishing any further connections will be not possible.

Example:

```
 $ snap set core service.ssh.disable=true
```

## system.power-key-action

Available since: 2.23

Specify the action to take when the power button is pressed.

The configuration option accepts the following values:

* `ignore`: Do nothing.
* `poweroff` (default): Shut down the system.
* `reboot`: Reboot the system.
* `halt`: Halt the system.
* `kexec`: Directly boot a new kernel.
* `suspend`: Suspend the system.
* `hibernate`: Hibernate the system.
* `hybrid-sleep`: Suspend to both disk and RAM.
* `lock`: Screen-lock all running sessions.

Example:

```
 $ snap set core system.power-key-action=reboot
```
