
# Uninstall Ubuntu Core from a device

This tutorial guides you throgh a complete removal of Ubuntu Core from the device. 

```{admonition} Warning 
:class: warning
This process removes Ubuntu Core from the device completely including the bootloader and partition structure.
```

If you want reset the device to the factory settings while keeping Ubuntu Core as its operating system, use [Factory reset](/explanation/recovery-modes/).

## Before you start

- **Back up all the critical data** in a secure location, you will not be able to resover the data from your device after the uninstallation.
- A [bootable USB drive](https://ubuntu.com/tutorials/create-a-usb-stick-on-ubuntu#1-overview) with Ubuntu Desktop.  
- A keyboard and a monitor connected to your device.

## Boot your device in live environment 

Power off the device, insert the USB drive, power on the device. It will show the GNU GRUB boot menu. Select **Try or Install Ubuntu** to launch the desktop. 

When the desktop appears, select **Try Ubuntu**. 

You have now loaded the live environment from the USB drive that allows you to configure and manage your device with the tools provided by the Ubuntu Desktop.

## Identify the internal storage device 

Once the live environment loads, open a terminal and run:

```
lsblk
```

Look for the internal storage device that contains Ubuntu Core. Identify it by checking the mount points, and size to verify it contains Ubuntu Core.  

## Erase the Ubuntu Core image

```{admonition} Warning
:class: warning
This step will **destroy all data on the selected device**. Ensure that you are erasing the correct partition.  
```

```
sudo shred -v -n 3 partition
```

## Power off and remove the USB drive

After the process completes, power off your device:

```
sudo poweroff
```

Remove the USB drive from your device. Ubuntu Core has been removed from your device, and it now can be decommissioned or have another OS installed on it.