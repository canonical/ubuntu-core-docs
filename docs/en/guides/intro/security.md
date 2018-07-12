---
title: Security and sandboxing
table_of_contents: true
---

# Security and sandboxing

Without providing custom flags at installation, snaps run confined under a restrictive security sandbox. The security policies and store policies work together to allow developers to quickly update their applications and to provide safety to end users.

This document describes the sandbox and how to configure and work with the security policies for snap packages.

## How a security policy is applied

Application authors should not have to know about or understand the low-level
implementation details on how security policy is enforced. Instead, all snaps
run under a default security policy which can be extended through the use of
[interfaces](../../guides/build-device/interfaces.html). Slots, plugs, and the available interfaces available on the device can be seen with:

```bash
snap interfaces
```

The description of these interfaces is found in the [interfaces reference](../../reference/interfaces/index.html).

Each command declared in `apps` snap metadata is tracked by the system
assigning a security label to the command. This security label takes the form
of `snap.<snap>.<app>` where `<snap>` is the name of the snap, and `<app>` is
the application name. For example, if this is `snap.yaml`:

    name: foo
    ...
    apps:
      bar:
        command: ...
        ...

then the security label for the `bar` command is `snap.foo.bar`. This security
label is used throughout the system including during the process confinement phase
when running the application.

Under the hood, the application runner:

* Sets up various environment variables:
    * `HOME`: set to `SNAP_USER_DATA` for all commands
    * `SNAP`: read-only install directory
    * `SNAP_ARCH`: the architecture of device (eg, amd64, arm64, armhf, i386, etc)
    * `SNAP_DATA`: writable area for a particular revision of the snap
    * `SNAP_COMMON`: writable area common across all revisions of the snap
    * `SNAP_LIBRARY_PATH`: additional directories which should be added to `LD_LIBRARY_PATH`
    * `SNAP_NAME`: snap name
    * `SNAP_REVISION`: store revision of the snap
    * `SNAP_USER_DATA`: per-user writable area for a particular revision of the snap
    * `SNAP_USER_COMMON`: per-user writable area common across all revisions of the snap
    * `SNAP_VERSION`: snap version (from `snap.yaml`)
* When hardware is assigned to the snap, sets up a device cgroup with default
  devices (eg, /dev/null, /dev/urandom, etc) and any devices that are assigned
  to this snap. Hardware is assigned via interface connections.
* Sets up a private mount namespace shared across all commands of the snap
* Sets up a private /tmp using a per-snap private mount namespace and
  mounting a per-snap directory on /tmp
* Sets up a per-command devpts new instance
* Sets up the seccomp filter for the command
* Executes the command under the command-specific AppArmor profile under a
  default nice value

This combination of restrictive AppArmor profiles (which mediate file access,
application execution, Linux capabilities(7), mount, ptrace, IPC, signals,
coarse-grained networking), clearly defined application-specific filesystem
areas, whitelist syscall filtering via seccomp, private /tmp, new instance
devpts and device cgroups provides for strong application confinement and
isolation.

### AppArmor
Upon snap install, the snap metadata is examined and AppArmor profiles are
generated for each command to have the appropriate security label and
command-specific AppArmor rules. As mentioned, each command runs under an
app-specific default policy that may be extended through declared interfaces
which are expressed in the metadata as `plugs` and `slots`.

### Seccomp
Similar to AppArmor, upon snap install, the snap metadata is examined and
seccomp filters are generated for each command to run under a default seccomp
filter that may be extended through declared interfaces which are expressed in
the metadata as `plugs` and `slots`.

## Working with security policies

The snap metadata need not specify anything for default confinement and may
optionally specify `plugs` and `slots` to declare additional interfaces to use.
When an interface is connected, the snap's security policy will be updated to
allow access to use the interface. See the [interfaces](../../guides/build-device/interfaces.html)
for details.

The AppArmor policy is deny by default and snaps are restricted to
their app-specific directories, libraries, etc (enforcing ro, rw, etc). The
seccomp filter is also deny by default and the default filter allows enough
safe syscalls so that snaps using the default security policy should work.

For example, consider the following:

    name: foo
    version: 1.0
    apps:
      bar:
        command: bar
      baz:
        command: baz
        daemon: simple
        plugs: [network]

then:

* the security label for `bar` is `snap.foo.bar`. It uses only the default policy
* the security label for `baz` is `snap.foo.baz`. It uses the `default` policy plus the `network` interface security policy as provided by the core snap

Security policies and store policies work together to provide flexibility,
speed and safety. Because of this, use of some interfaces may trigger a manual
review in the official Ubuntu store and/or may need to be connected by the user
or gadget snap developer.

The interfaces available on the system and those used by snaps can be seen with
the `snap interfaces` command:

```bash
snap interfaces
```
...will produce output similar to:
```no-highlight
    Slot                 Plug
    :firewall-control    -
    :home                -
    :locale-control      -
    :log-observe         snappy-debug
    :mount-observe       -
    :network             xkcd-webserver
    :network-bind        xkcd-webserver
    :network-control     -
    :network-observe     -
    :snapd-control       -
    :system-observe      -
    :timeserver-control  -
    :timezone-control    -
```
In the above it can be seen that the `snappy-debug` snap has the `log-observe`
interface connected (and therefore the security policy from `log-observe` is
added to it) and the `xkcd-webserver` has the `network` and `network-bind`
interfaces connected. An interesting quality of interfaces is that they may
be either declared per-command or per-snap. If declared per-snap, all
the commands within the snap have the interface security policy added to the
command's security policy when the interface is connected. If declared
per-command, only the commands within the snap that declare use of the
interface have the interface security policy added to them.

Snappy may auto-connect the requested interfaces upon install or may require the
user to manually connect them. Interface connections and disconnections are
performed via the `snap connect` and `snap disconnect` commands. See
[interfaces](../../guides/build-device/interfaces.html) for details.

## Developer mode

Sometimes it is helpful when developing a snap to not have to worry about the
security sandbox in order to focus on developing the snap. To support this,
snappy allows installing the snap in developer mode which puts the security
policy in complain mode (where violations against security policy are logged,
but permitted). For example:

```bash
sudo snap install --devmode <snap>
```

## Jail mode

Even if a developer has specified a package to be only installable in `devmode`, you can force a strict confinement by using the `--jailmode` flag.

```bash
sudo snap install --jailmode <snap>
```

## Debugging

To check if you have any policy violations:

```bash
sudo grep audit /var/log/syslog
```

An AppArmor violation will look something like:

```no-highlight
    audit: type=1400 audit(1431384420.408:319): apparmor="DENIED" operation="mkdir" profile="snap.foo.bar" name="/var/lib/foo" pid=637 comm="bar" requested_mask="c" denied_mask="c" fsuid=0 ouid=0
```
If there are no AppArmor denials, AppArmor shouldn't be blocking the snap.

A seccomp violation will look something like:

```no-highlight
    audit: type=1326 audit(1430766107.122:16): auid=1000 uid=1000 gid=1000 ses=15 pid=1491 comm="env" exe="/bin/bash" sig=31 arch=40000028 syscall=983045 compat=0 ip=0xb6fb0bd6 code=0x0
```

The `syscall=983045` can be resolved by running the `scmp_sys_resolver` command
on a system of the same architecture as the one with the seccomp violation:

```bash
scmp_sys_resolver 983045
```
might output:
```no-highlight
    set_tls
```

If there are no seccomp violations, seccomp isn't blocking the snap. If you notice `compat=1` in the seccomp denial, then specify the correct compatibility architecture to `scmp_sys_resolver` with `-a <arch>`. Eg, if on an amd64 system, use `scmp_sys_resolver -a x86 191` (use `-a arm` on arm64 systems).

The `snappy-debug` snap can be used to help with policy violations. It can be installed:
```bash
sudo snap install snappy-debug
```
And run like this:

```bash
sudo /snap/bin/snappy-debug.security scanlog foo
```

This will:

 * adjust kernel log rate limiting
 * follow /var/log/syslog looking for policy violations for `foo`
 * resolve syscall names (considering `compat`)
 * make recommendations on how to fix violations

See `snappy-debug.security help` for details.

If you believe there is a bug in the security policy or want to request and/or contribute a new
interface, please [file a bug](https://bugs.launchpad.net/snappy/+filebug),
adding the `snapd-interface` tag.

## Interface development and security policy
When participating in snappy development and implementing new interfaces for others to use, you will almost always need to write security policy for both the slots and the plugs side of the interface but keep in mind you are not expected to write perfect security policy on the first try. The review process for snapd includes a security review of the interface security policy and it is expected that the security policy will be iterated on during the review process (in other words, if you are stuck on writing security policy but the interface otherwise works, feel free to submit the interface and ask for help).

### Tips

When fine-tuning AppArmor policy, it is often easiest to install the snap in strict mode then modify the AppArmor policy in place on the target system, then copying it back. Eg, these steps might be:

1. build your snap
2. copy your snap to your target device and install it (or use `snap try`)
3. use the snap (perhaps using `snap run --shell <name>.<command>`), monitoring /var/log/syslog for denials
4. modifying `/var/lib/snapd/apparmor/profiles/snap.<name>.<command>` as needed (eg, adding rules before the final `}`)and running `sudo apparmor_parser -r /var/lib/snapd/apparmor/profiles/snap.<name>.<command>` to load the policy into the kernel
5. use `sudo service snap.<name>.<command> stop/start/etc` as needed for daemons
6. repeat until satisfied

The same process as above holds for seccomp except the seccomp policy is in `/var/lib/snapd/seccomp/profiles/snap.<name>.<command>` and there is no command to load the policy (you simply have to relaunch the command or `snap run --shell`). The seccomp policy language is considerably simpler and is essentially a list of allowed syscalls.

When done, copy any changes you make to `/var/lib/snapd/apparmor/profiles/snap.<name>.<command>` or `/var/lib/snapd/seccomp/profiles/snap.<name>.<command>` to your interface code.

In addition to the above, here are two useful techniques when debugging/developing policy:

 * temporarily specify `@unrestricted` in the seccomp policy and this will allow all syscalls
 * temporarily use a combination of bare apparmor rules to focus on only the parts you want. Eg: `file, capability, network, mount, remount, pivot_root, umount, dbus, signal, ptrace, unix,`
 * look at existing policy in `interfaces/apparmor/template.go`, `interfaces/seccomp/template.go` and `interfaces/builtin/*` for examples of the policy language

Installing in devmode and developing policy can also be done; you will simply focus on getting rid of logged (but otherwise allowed) policy violations.

### References
 * [https://github.com/snapcore/snapd/tree/master/interfaces](https://github.com/snapcore/snapd/tree/master/interfaces) for existing interface code and policy
 * [http://manpages.ubuntu.com/manpages/xenial/man5/apparmor.d.5.html](http://manpages.ubuntu.com/manpages/xenial/man5/apparmor.d.5.html)
 * [http://wiki.apparmor.net/index.php/Profiling_by_hand](http://wiki.apparmor.net/index.php/Profiling_by_hand) (but use the paths listed above and don't use the `aa-genprof` or `aa-logprof` tools because they are not yet snappy-aware)
