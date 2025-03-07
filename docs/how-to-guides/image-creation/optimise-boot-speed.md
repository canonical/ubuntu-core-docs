(how-to-guides-image-creation-optimise-boot-speed)=
# Optimise boot speed

When Ubuntu Core boots for the first time, a _seeding_ process installs an initial set of snaps and runs their respective hooks (see [Snaps in Ubuntu Core](/explanation/core-elements/snaps-in-ubuntu-core) for more details).

Each installed snap needs to be verified and have their respective AppArmor and seccomp security profiles, systemd units, and mount points created. The time this takes is proportional to the number of asserted snaps being seeded, but installing many snaps can impact first boot speed.

_Preseeding_ speeds up the seeding process by performing as many of these administrative tasks as possible in advance when an image is being created.

## Preseeding

During deployment, _snapd_ still performs the _seeding_ process but it automatically skips any parts successfully completed during _pre-seeding_.

### Building a preseeded image

During the process of [Image creation](/how-to-guides/image-creation/index), preseeded images are created with the same `ubuntu-image` tool, or the `snap prepare-image` command, with an additional `--preseed` argument.

Pre-seeding requirements:
* snapd 2.56 or newer, both on the host system (where the image is created) and in the resultant preseeded system.
* Preseeding is supported in Ubuntu Core 20 onwards.
* The same architecture on both the host and pre-seeded system (during pre-seeding, snapd from the target system is executed to perform seeding).
* It's recommended that the kernel on the host should have the same AppArmor features as that of the target system. Differing AppArmor features will nullify the pre-created security profiles which will subsequently need to be recreated on first boot.

Usage:

```bash
snap prepare-image --preseed --preseed-sign-key=<gpg-key-name> --channel=stable --snap=... <model-assertion> <target directory>
```

or with ubuntu-image:

```bash
sudo ubuntu-image snap --preseed --preseed-sign-key=<gpg-key-name> -i 8G --snap [...] <model-assertion>
```

The `--preseed-sign-key` argument is optional and the default GPG key will be used if omitted. This is the brand GPG key.

A custom AppArmor features directory may be specified with `--apparmor-features-dir=...`. The target should be a snapshot of `sys/kernel/security/apparmor/features` from the target system. If not specified, the `sys/kernel/security/apparmor/features` from the host system will be used.

On a new device, snaps are installed from the `ubuntu-seed` volume (see [Core elements](/explanation/core-elements/index)).  On a classic system, this set of snaps to install is defined in `/var/lib/snapd/seed/seed.yaml`.

## Single boot installation

During the installation of an Ubuntu Core system, the target device will undergo a reboot to finalize the installation process. If a system is preseeded, the installation can be completed without necessitating a system reboot. Note that this feature requires snapd version 2.62 and greater.

