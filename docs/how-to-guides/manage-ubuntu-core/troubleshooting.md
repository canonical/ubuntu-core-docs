(how-to-guides-manage-ubuntu-core-troubleshooting)=
# Troubleshooting

Ubuntu Core runs on, and can be built for, a diverse and constantly evolving set of {ref}`platforms and devices <reference-system-requirements>`.

The majority of our users and developers experience very few issues, but any technology this complex and diverse will likely encounter some issues and incompatibilities.

This page attempts to guide users to either an appropriate solution to their issues, or the correct forum/thread where they can get help. 

## Ubuntu Core install error: TPM is in DA Lockout Mode

Installing Ubuntu Core on a device with a TPM (such as an Intel NUC, or QEMU with emulated TPM) can sometimes result in a stalled installation and a **TPM is in DA Lockout Mode** error, as shown in the following example install log:

```bash
ubuntu snapd[15531]: handlers install.go:254:
   make system runnable
ubuntu snapd[115531]: secboot_tpm.go:483: 
   TPM provisioning error: the TPM is in DA lockout mode
ubuntu snapd[115531]: taskrunner.go:271:
   [change 2 "Setup system for run mode" task] failed: 
   cannot make system runnable: cannot seal the encryption keys:
   cannot provision TPM: the TPM is in DA lockout mode
ubuntu snapd[15531]: secboot_tpm.go:483: TPM provisioning error:
   the TPM is in DA lockout mode
ubuntu snapd[15531]: taskrunner.go:271:
   [change 2 "Setup system for run mode" task] failed:
   cannot make system runnable:
   cannot seal the encryption keys:
   cannot provision TPM:
   the TPM is in DA lockout mode 
```

This error typically means the TPM has been locked to protect the system against potential dictionary attacks (DA) and the TPM needs to be cleared before the Ubuntu Core installation will proceed.

To clear the TPM on hardware, boot a classic Ubuntu system (such as a live version of [Ubuntu 20.04 LTS](https://releases.ubuntu.com/20.04/) from USB storage) and run the following command from a terminal:

```bash
echo 5 | sudo tee /sys/class/tpm/tpm0/ppi/request
```

To clear a software TPM, such as the [test-snapd-swtpm](https://snapcraft.io/test-snapd-swtpm) snap, remove it and re-install it again:

```bash
snap remove test-snapd-swtpm --purge; snap install test-snapd-swtpm
```

Now reboot the problematic system and re-attempt the Ubuntu Core installation, which should  continue without error.

## Console-conf shows no-ip

During a {ref}`snap refresh <explanation-refresh-control>`, _console-conf_ may display an `no-ip` message.

Despite the _no-ip_ message, you should still be able to connect to the device using SSH if you actually know the IP.

The [snap changes](https://snapcraft.io/docs/keeping-snaps-up-to-date#heading--changes) command will show that one or more snaps are being updated and the device may need to reboot.

The solution to the _no-ip_ error is to simply wait for any updates to complete.

## Ubuntu Core boot asking for recovery key

When using {ref}`Full Disk Encryption <explanation-full-disk-encryption>`, a device’s Trusted Platform Module (TPM) stores the encryption keys necessary to decrypt and boot the device.

If an encrypted drive is detected, but the TPM does not contain a valid key, the Ubuntu Core boot process will prompt for a recovery key. 

```bash
🔐 Please enter the recovery key for disk /dev/disk/by-partuuid/c7f7971b: (press TAB for no echo)
```

To progress from this point, you will need to enter a  previously retrieved recovery key for the device.

See {ref}`Using recovery keys <how-to-guides-manage-ubuntu-core-use-a-recovery-mode>` for further details.

