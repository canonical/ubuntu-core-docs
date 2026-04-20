---
myst:
  html_meta:
    description: Use recovery modes on Ubuntu Core devices. Access recovery options for device repair, restoration, or reinstallation.
---

(how-to-guides-manage-ubuntu-core-use-a-recovery-mode)=
# Use a recovery mode

Ubuntu Core is inherently robust. But if data corruption issues do occur, even on boot or data partitions, it can still access a recovery mode to help repair, restore or reinstall an impaired device.

These recovery modes can be accessed in three different ways:

- **{ref}`Boot into the system mode selection menu <ref-use-a-recovery-mode_system-mode-selection-menu>`**</br>
Start or reboot the device with the ‘1’ key held on a connected keyboard
- **{ref}`Snap reboot <ref-use-a-recovery-mode_recovery-modes-from-snap-reboot>`**</br>
Run `snap reboot` on the device with either `--recover` or `--install` arguments.
- **[Snapd REST API](https://snapcraft.io/docs/snapd-api#heading--systems-get)**</br>
Use the REST API to call either the `recover`, `install`, `factory-reset` or `reboot` functions.

Recovery modes are available on Ubuntu Core 20 and later.

Device manufacturers may choose to implement alternative methods to access recovery functionality. These will be specific to those devices.

See {ref}`Recovery modes <explanation-recovery-modes>` for more details on each supported recovery mode, what they do, and how they can be used.

(ref-use-a-recovery-mode_system-mode-selection-menu)=
## System mode selection menu

To access the system mode selection menu, start or reboot the device with the ‘1’ key held on a connected keyboard. If the chooser fails to launch, try pressing _1_ repeatedly from boot. It needs to be captured by Ubuntu Core boot process.

After the initial boot process completes, a status screen will appear showing “System mode selection triggered. Proceed to select one of the available systems and actions.”

![uc22-factory-reset|690x249](https://assets.ubuntu.com/v1/e67198a4-use-a-recovery-mode.png) 

The menu system requires that you tab or cursor to highlight your chosen option. Ensure ‘OK’ is highlighted and press Enter to continue, after which you'll be presented first with the recovery chooser and the option to either run normally, enter recovering mode, or reinstall.

Selecting an option followed by ‘Confirm’ will reboot the device into the selected mode (see below).

(ref-use-a-recovery-mode_recovery-modes-from-snap-reboot)=
## Recovery modes from snap reboot

Alongside using `sudo snap reboot` to reboot the system, the following  arguments can be added to select a recovery mode with or without an additional system label for the target system:

- `--run`
- `--install`
- `--recover`
- `--factory-reset`

The _recover_ and _run_ modes are only available for the current system.

When called without a system label, reboot will use the current system to enter the given mode. System labels are listed with the `snap recovery` command:

```bash
$ sudo snap recovery
Label    Brand       Model                Notes
20201117 <user-name> ubuntu-core-20-amd64 current
```

To reboot the above system into recover mode, for example, enter the following:

```bash
$ sudo snap reboot --recover 20201117
Broadcast message from root@ubuntu (Wed 2020-11-25 13:15:51 UTC):

reboot scheduled to update the system
The system is going down for reboot at Wed 2020-11-25 13:25:51 UTC!

Reboot into "20201117" "recover" mode.
```

(ref-use-a-recovery-mode_using-recovery-keys)=
## Using recovery keys

When using {ref}`Full Disk Encryption <explanation-full-disk-encryption>`, a device's Trusted Platform Module (TPM) seals the encryption keys necessary to decrypt and boot the device. 

These keys can be retrieved with the `snap recovery --show-keys` command:

```bash
$ sudo snap recovery --show-keys
recovery:  55055-39320-64491-48436-47667-15525-36879-32875
```

If a TPM becomes reinitialised or reconfigured, the TPM-sealed keys will be inaccessible and Ubuntu Core will not be able to decrypt and boot the device.

During boot, Ubuntu Core will instead ask for the recovery key for specific encrypted partitions. The same keys recovered with `snap recovery --show-keys` can then be entered to restore the device:

```bash
🔐 Please enter the recovery key for disk /dev/disk/by-partuuid/c7f7971b: (press TAB for no echo)
```
After entering a valid key, Ubuntu Core will decrypt the device, proceed with the boot, and restore the TPM from the recovered key. The recovery keys will remain the same and do not need to be retrieved again.

