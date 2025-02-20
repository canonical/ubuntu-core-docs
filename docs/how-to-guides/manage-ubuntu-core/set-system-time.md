(how-to-guides-manage-ubuntu-core-set-system-time)=
# Set system time

System time on an Ubuntu Core 20+ device is set and updated over several potential steps, depending on network access and the availability of a real-time clock (RTC).

Regardless of how system time is set, it always moves forward monotonically and is never permitted to move backwards.

## System time update process

The system time value and update process is tightly coupled to the [boots process](/explanation/core-elements/inside-ubuntu-core) and device capabilities. From a fresh boot of the device, the process for setting the time is as follows:

1. **initrd**
   When the device boots, _initrd_ first moves system time forward to match the time _initrd_ was built.
   - **snap-bootstrap**
   _snap-bootstrap_ is the main executable run during the early _initrd_ boot stage. It will itself move time forward to that of the most recent assertion it trusts, signed with Canonical's key.
1. **user-space**
   After the snap environment is re-executed and the boot process moves to user-space, systemd's _timesyncd_ will attempt to update the system time:
   - **on devices with an RTC**
      System time is moved forward to match that of the on-board RTC.
   - **on devices without an RTC**
      System time is taken from the modified file timestamp (mtime) of `/var/lib/systemd/timesync/clock` on the data partition (which may be encrypted). The timestamp for this file is updated periodically after a network connection has been established, and before the system reboots.
  
   When the network becomes available, the device will begin to use NTP to periodically update the system time. See [Network time synchronisation](#heading--ntp) below for more details.

## Current time

The current system time and date can be retrieved with the `timedatectl` command:

```bash
$ timedatectl
               Local time: Mon 2022-03-14 12:23:24 UTC
           Universal time: Mon 2022-03-14 12:23:24 UTC
                 RTC time: Mon 2022-03-14 12:23:25
                Time zone: Etc/UTC (UTC, +0000)
System clock synchronized: yes
              NTP service: active
          RTC in local TZ: no
```

## Real-time clock (RTC) check

If no real-time clock is present or accessible, the output from _timedatectl_ will include **`RTC time: n/a`**:

```bash
$ timedatectl
               Local time: Mon 2022-03-14 12:23:24 UTC
           Universal time: Mon 2022-03-14 12:23:24 UTC
                 RTC time: n/a
                Time zone: Etc/UTC (UTC, +0000)
System clock synchronized: yes
              NTP service: active
          RTC in local TZ: no
```

## Setting a timezone

The timezone can be configured with the [system.timezone](https://snapcraft.io/docs/system-options#heading--timezone) system value:

```
$ snap set system system.timezone="America/Chicago"
$ timedatectl | grep zone
                Time zone: America/Chicago (CDT, -0500)
```

## Network time synchronisation

By default, _timesyncd_ is configured to use the Network Time Protocol (NTP) for network time synchronisation as soon as the network becomes available.

The NTP server and update frequency can be checked with _timedatectl timesync-status_:

```
$ timedatectl timesync-status
       Server: 91.189.89.198 (ntp.ubuntu.com)
Poll interval: 4min 16s (min: 32s; max 34min 8s)
         Leap: normal
      Version: 4
      Stratum: 2
    Reference: 11FD22FB
    Precision: 1us (-23)
Root distance: 30.234ms (max: 5s)
       Offset: +33.938ms
        Delay: 14.975ms
       Jitter: 37.394ms
 Packet count: 4
    Frequency: -14.982ppm
```

