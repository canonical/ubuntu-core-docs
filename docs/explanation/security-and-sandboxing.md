(explanation-security-and-sandboxing)=
# Security and sandboxing

Without custom flags at installation, or subsequent interface connections, snaps are confined to a restrictive security sandbox with no access to system resources outside of the snap.

Snap developers need to be aware of the scope their applications have from within the snap.

Security policies and store policies work together to allow developers to quickly update their applications, and to provide safety to end users, and this document describes the sandbox and how to configure and work with the security policies for snaps you publish.

For more general details on what confinement entails, see [Snap confinement](https://snapcraft.io/docs/snap-confinement), and for help resolving issues that may arise from a snap's security policy, see [Debugging snaps](https://snapcraft.io/docs/debug-snaps).

## Security overview

Application developers should not need to know about, or understand, the low-level implementation details of how a security policy is enforced.

Each command declared with the `apps` [snap metadata](https://snapcraft.io/docs/the-snap-format#heading--snapyaml) is tracked by the system assigning a security label to the command.

This security label takes the form of `snap.<snap>.<app>` where `<snap>` is the name of the snap, and `<app>` is the application name. 

For example, the following is an app declaration from `snap.yaml`:

```yaml
name: foo
version: 1.0
apps:
  bar:
    command: bar
  baz:
    command: baz
    daemon: simple
    plugs: [network]
```

* the security label for  `bar`  is  `snap.foo.bar` . It uses only the default policy.
* the security label for  `baz`  is  `snap.foo.baz` . It uses the  `default`  policy plus the  `network`  interface security policy as provided by the core snap.

This security label is used throughout the system, including during the process confinement phase when running the application.

Under the hood, the application runner does the following:

1. Sets up various environment variables:
    * `HOME`: set to `SNAP_USER_DATA` for all commands
    * `SNAP`: read-only install directory
    * `SNAP_ARCH`: the architecture of device (eg, amd64, arm64, armhf, i386, etc)
    * `SNAP_DATA`: writable area for a particular revision of the snap
    * `SNAP_COMMON`: writable area common across all revisions of the snap
    * `SNAP_LIBRARY_PATH`: additional directories which should be added to `LD_LIBRARY_PATH`
    * `SNAP_NAME`: snap name
    * `SNAP_INSTANCE_NAME`: snap instance name incl. instance key if one is set (snapd 2.36+)
    * `SNAP_INSTANCE_KEY`: instance key if any (snapd 2.36+)
    * `SNAP_REVISION`: store revision of the snap
    * `SNAP_USER_DATA`: per-user writable area for a particular revision of the snap
    * `SNAP_USER_COMMON`: per-user writable area common across all revisions of the snap
    * `SNAP_VERSION`: snap version (from `snap.yaml`)

1. When hardware is assigned to the snap, a device cgroup is set up with default devices (eg, /dev/null, /dev/urandom, etc) and any devices that are assigned to this snap. Hardware is assigned with _interface_ connections.

1. Sets up a private mount namespace shared across all the commands in the snap.

1. Sets up a private `/tmp` directory using a per-snap private mount namespace and mounting a per-snap directory on /tmp.

1. Sets up a new instance of _devpts_ per command.

1. Sets up the seccomp filter for the command.

1. Executes the command under the command-specific AppArmor profile under a default nice value.

## Cryptography

The snap packaging system employs various cryptographic technologies to secure local and remote snap operations.

Locally, these are handled by the snap daemon, *snapd*, while remote connections require mediation between snapd and the [Snap Store](https://snapcraft.io/docs/glossary#heading--snap-store), which supports its own set of cryptographic technologies. Both sets of these are listed below.

### Snapd (snap daemon) cryptography

* **Digital signatures for [assertions](https://ubuntu.com/core/docs/reference/assertions)**
</br>SHA3-384 and SHA512 for hashing, OpenPGP v4 signatures with RSA 4096/8192 keys
* **Hashing of snaps**</br>
SHA3-384
* **HTTPS communication**</br>
Snapd uses the [golang standard library TLS package](https://pkg.go.dev/crypto/tls) as client, always configured to use at least TLS >= 1.2
* **Device session request signing**</br>
Same as digital signatures for assertions; the device key is RSA 4096
* **Macaroons for authorisation and authentication**</br>
Snapd uses them via [gopkg.in/macaroon.v1](https://github.com/go-macaroon/macaroon/tree/v1.0.0), which means SHA256 HMACs and [NaCL secretbox](https://pkg.go.dev/golang.org/x/crypto/nacl/secretbox).

### Snap Store cryptography

* **Digital signatures for [assertions](https://ubuntu.com/core/docs/reference/assertions)**</br>
The key ID of the signing key is encoded with SHA3-384, and the assertion is signed with either 4096-bit RSA or 8192-bit RSA
* **Hashing of artifacts**</br>
The store generates many hashes of an uploaded artefact using SHA3-384, SHA256 and SHA512 to ensure the uniqueness and integrity of the artefact.
* **Macaroons for authorisation and authentication**</br>
HMAC SHA256, NaCl crypto_secretbox
* **Macaroons encryption of 3rd party caveats**</br>
Salsa20 (NaCl crypto_secretbox)
* **Enterprise Store nonce signing**</br> 
Used as additional security for REST API access. RSA4096 is used to sign and verify the nonce.

## AppArmor, Seccomp and device permissions

When a snap is installed, its metadata is examined and is used to derive **AppArmor** profiles, **Seccomp** filters and device **cgroup** rules, alongside **traditional permissions**. This combination provides strong application confinement and isolation:

### AppArmor

   AppArmor profiles are generated for each command. These have the appropriate security label and command-specific AppArmor rules to mediate file access, application execution, Linux capabilities, mount, ptrace, IPC, signals, coarse-grained networking.

   As already mentioned, each command runs under an app-specific default policy that may be extended through declared interfaces which are expressed in the metadata as `plugs` and `slots`. AppArmor policy violations in strict mode snaps will be denied access, and typically have errno set to `EACCES`. The violation will typically be logged.

  See [AppArmor violations](https://snapcraft.io/docs/debug-snaps#heading--apparmor) for help tracking AppArmor problems.

### Seccomp

   A seccomp filter is generated for each command in a snap to run under, enabling allowlist syscall filtering, which can then be extended through declared interfaces expressed in the metadata as `plugs` and `slots`.
   
   Processes with seccomp policy violations will be denied access to the system call with errno set to `EPERM` (snapd releases prior to 2.32 receive `SIGSYS`) and the violation is logged.

  See [Seccomp violations](https://snapcraft.io/docs/debug-snaps#heading--seccomp) for help tracking Seccomp problems.

### Device cgroup

    udev rules are generated for each command to tag devices so they may be added/removed to the command's device cgroup. By default, however, no devices are tagged and the device cgroup is not used, with AppArmor used to mediate access.
    
    As determined by snapd, a device cgroup may be used in addition to AppArmor when a dependent interface is declared, as expressed through `plugs` and `slots` in the metadata.
    
    Processes accessing devices not in the snap-specific device cgroup will be denied access with errno set to `EPERM`. Access violations are not logged.

### Traditional permissions

    Traditional file permissions (owner, group, file ACLs and others) are also enforced with snaps.
    
    Processes trying to access resources which the traditional file permissions do not allow are denied access with errno typically set to `EACCES` (see the man page for the operation for specifics). Access violations are not logged.

Consequently, all snaps run under a default security policy which can be extended through the use of [interfaces](https://snapcraft.io/docs/snapcraft-interfaces). 

## Refresh awareness

By default, a service running from a snap needs to be restarted whenever the snap is refreshed.

Stopping and starting a service is a requirement to support `snap revert`

System data typically includes databases, data files, and configuration files, although all of this is up to the snap developer.

Reverting a snap with `snap revert` restores a snap’s system data to its prior state, and services accessing this data need to be stopped to protect the integrity of the data and also to facilitate changes to security policy that are required when a snap updates its system data location.

To help mitigate any potential issues when a restart is required, _snapd_ will check for running processes associated with the snap before each refresh:

* if **no processes are running**, the refresh is performed.
* if **systemd-initiated processes** are detected, their associated units are first stopped, the snap refreshed, and those units started again.
* if other **snap-initiated processes** are detected, [refresh awareness](https://snapcraft.io/docs/refresh-awareness) is used to mediate the update.

### Refresh security policy

The snap daemon uses AppArmor and Seccomp to create a security policy that is linked to a specific snap revision. This governs what a snap can access on your system. AppArmor profiles and Seccomp filters are created for each command, and while AppArmor profiles can be changed and reloaded while a process is running, Seccomp filters cannot.

Snap security policy permits read and write access for the current revision, and read-only access for other revisions to preserve the capabilities of _snap revert_. More specifically, if `123` is the current revision, AppArmor policy is set to allow `rw` on `SNAP_DATA=/var/snap/foo/123`.

Before _refresh awareness_ became available, if a refresh occurred while a snap was running, its AppArmor policy would be updated to allow `w` (write) on the new version and `r` (read) on the older versions, including the running version. The policy was applied immediately, which meant that write operations would start to fail for running processes.

## Interface security policies

Interfaces are implemented as plugs and slots. A plug in one snap may connect to a slot in another and this provides access to the resources required.

The _snap connections_ command can be used to see available interfaces alongside their slots and plugs.

```bash
$ snap connections
Interface           Plug                                Slot               Notes
home                wormhole:home                       :home              -
log-observe         gnome-logs:log-observe              :log-observe       -
mount-observe       gnome-system-monitor:mount-observe  :mount-observe     -
[...]
```

In the above example output, the  `gnome-logs`  snap is connected to the `log-observe`  interface, which means the security policy from  `log-observe`  has been added to `gnome-logs`.

Interfaces can be declared either per-snap or per-command:
- if declared per-snap, all the commands within the snap have the interface security policy added to each command’s security policy when the interface is connected
- if declared per-command, only the commands within the snap that declare use of the interface have the specified interface security policy added to them

An interface may either auto-connect upon install, or require the user to manually connect them. Interface connections and disconnections are performed via the  `snap connect`  and  `snap disconnect` commands. See [interfaces](/) for details.

