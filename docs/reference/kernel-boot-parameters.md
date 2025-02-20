(reference-kernel-boot-parameters)=
# Kernel boot parameters

Kernel boot parameters are used to enable, disable or configure kernel-specific features when the system boots. 

On Ubuntu Core, when using the default GNU GRUB bootloader, kernel boot parameters can be configured either in the [Gadget snap](/reference/gadget-snap-format), or through [system options](https://snapcraft.io/docs/system-options). See [Modifying kernel boot parameters](/how-to-guides/manage-ubuntu-core/modify-kernel-options) for further details on each process. It is still possible to use this kernel parameters if not using GRUB, although the way to modify them will depend then on system.

Alongside parameters supported by the kernel, such as `splash` to display the [Splash screen configuration](/how-to-guides/image-creation/add-a-splash-screen), Ubuntu Core supports the following additional kernel parameters that permit special access to the system.

## snapd.debug

If `snapd.debug` is set to `1`, debug traces for snapd and other commands included in the snapd snap will be produced. They will be accessible from the journal:

```
$ sudo journalctl --no-pager -l -u snapd
Aug 20 16:00:47 host snapd[792]: logger.go:99: DEBUG: will consider standby after: 5s
Aug 20 16:00:47 host snapd[792]: logger.go:99: DEBUG: Setting up sd_notify() watchdog timer every 2m30s
Aug 20 16:00:47 host snapd[792]: logger.go:99: DEBUG: activation done in 321ms
Aug 20 16:00:47 host systemd[1]: Started snapd.service - Snap Daemon.
Aug 20 16:00:47 host snapd[792]: logger.go:99: DEBUG: pid=768;uid=0;socket=/run/snapd.socket; GET /v2/snaps/system/conf?keys=seed.loaded 129.97647ms 200
...
```

## ubuntu_core.bootchart

The [systemd-bootchart](https://manpages.ubuntu.com/manpages/jammy/man1/systemd-bootchart.1.html) performance graphing tool is a standard feature of the Linux Systemd initialisation and service manager.

_Bootchart_ collects metrics on CPU load, memory usage and process resources during a system boot. On Ubuntu Core, the sample collector will run until the system is seeded, stopping when when the `snapd.seeded.service` stops. It then renders these details as text and charts into an SVG-formatted image file.

![Ubuntu Core bootchart graphs](https://assets.ubuntu.com/v1/d39bae51-bootchart-graph.png)
This feature is enabled either as a [Static boot option](/how-to-guides/manage-ubuntu-core/modify-kernel-option.md#static-boot-option-modifications) in the gadget snap, or as a [Dynamic parameter modification](/how-to-guides/manage-ubuntu-core/modify-kernel-option.md#dynamic-kernel-parameter-modifications) with the `snap set` command:

```
snap set system system.kernel.dangerous-cmdline-append="ubuntu_core.bootchart"
sudo reboot
```

Generated bootcharts are stored in the [ubuntu-data](/explanation/full-disk-encryption.md#storage-layouts) partition, under `/var/log/debug/boot<N>/` , where `<N>` is the boot number since _bootcharts_ was enabled. If a chart has also been collected by the initramfs, it's same folder.

 The file names will include the date and time of the boot:

```bash
-rw-r--r-- 1 root root 382502 Jul 11 11:30 bootchart-20230711-1130.svg
-rw-r--r-- 1 root root 133684 Jul 11 11:30 initrd-bootchart-20230711-1130.svg
```

To remove a dynamically set kernel command, use the `snap unset` command:

```bash
snap unset system system.kernel.dangerous-cmdline-append
```

## snapd_system_disk

 Requires _snapd 2.59_.

This kernel boot parameter is used to specify which system storage device is used for booting as a _sysfs_ `/dev` device location:

```yaml
snapd_system_disk=/dev/sda
```

