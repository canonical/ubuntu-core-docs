(explanation-recovery-modes)=
# Recovery modes


The following recovery functions are currently available:

* **[Install mode / factory mode](#heading--install)**: initialise the device from an onboard system image
* **[Run mode](#heading--run)**: restarts normally and runs the boot process
* **[Recover mode](#heading--recover)**: reboot into recovery mode for data retrieval
* **[Factory reset](#heading--factory)**: erase system data and initialise the device to its factory state

See [Using recovery modes](/how-to-guides/manage-ubuntu-core/use-a-recovery-mode) for details on how these modes are accessed.

<h2 id='heading--install'>Install mode</h2>

With **install mode**, all existing user and system data on the device will be removed and the device will be initialised from the system version image dated and listed in the reinstall text.

Unlike with a factory reset (see below), install mode will erase the contents of the [ubuntu-save](/t/inside-ubuntu-core/20777#heading--layouts) partition, reverting the device to its manufactured state, potentially removing configuration data essential to its functionality.

After the re-initialisation process has completed, you will need to step through the installation process of network configuration and account credentials again.

See [Installation steps](/t/installing-ubuntu-core-20/20260#heading--general) for further details on how the installation will proceed.

```{warning}

Re-installation can fail if a device's TPM is assigned to a previous installation. To solve this issue, reset or clear the TPM assignment from the device's BIOS before selecting reinstall as a recovery mode.
```

<h2 id='heading--run'>Run mode</h2>

When booting in **run mode**, the device will attempt to boot normally, with no further option to recover or reinstall the system unless the recovery process is reinstantiated.


<h2 id='heading--recover'>Recover mode</h2>

In **recovery mode**, the device operates as it would from a pristine initial installation, including its snaps, via a temporary file system.

Most importantly, however, the running system data is untouched. This allows you to log in to the system using prior credentials to recover your data, either via SSH or locally after setting up a password for the user.

Rebooting from recovery mode will return the system to run mode.

<h2 id='heading--factory'>Factory reset</h2>

The **factory reset** option will erase all system data and reset the device to its original _fresh from the factory_ state. This means that not everything is removed. 

In particular, the contents of the [ubuntu-save](/t/inside-ubuntu-core/20777#heading--layouts) partition remains intact. This partition typically contains configuration data essential for the original functionality of the device, such as network configuration details. To fully initialise such a device, and remove all data, use `install mode`.

This is a dangerous option and should only be performed when you are certain the data on a device data is either backed-up or unwanted.

Additionally, the [install-device hook](/t/installation-process/22737#heading--install-device) may optionally be executed with a factory-reset.

