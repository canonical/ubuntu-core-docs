# Remodel with essential snap changes

[Remodeling](remodelling) is the process of swapping from one [model assertion](/reference/assertions/model) to another on an Ubuntu Core system.

The model defines the set of _essential snaps_ that make up the system, including the base snap, the gadget, the kernel, and snapd itself (see [Snaps in Ubuntu Core](/explanation/core-elements/snaps-in-ubuntu-core) for more information).

Remodeling often involves switching to a new base, kernel, and/or gadget snap. This process is outlined below using an example based on the following model assertion:

```yaml
type: model
authority-id: canonical
series: 16
brand-id: canonical
model: ubuntu-core-24-amd64
architecture: amd64
base: core24
grade: signed
snaps:
  -
    default-channel: 24/stable
    id: UqFziVZDHLSyO3TqSWgNBoAdHbLI4dAH
    name: pc
    type: gadget
  -
    default-channel: 24/stable
    id: pYVQrBcKmBa0mZ4CCN7ExT6jH8rY1hza
    name: pc-kernel
    type: kernel
  -
    default-channel: latest/stable
    id: dwTAh7MZZ01zyriOZErqd1JynQLiOGvM
    name: core24
    type: base
  -
    default-channel: latest/stable
    id: PMrrV4ml8uWuEUDBT8dSGnKUYbevVhc4
    name: snapd
    type: snapd
```

## Phase 1: Download

Prior to any local modifications being made, snapd downloads all the snaps and assertions required to perform the remodel. This ensures there's enough storage space on the device for the remodel, and reduces the network dependency on the Snap store.

## Phase 2: Staging and test preparation

Snapd carefully orchestrates the swap to either a new kernel or new base snap in a way that enables either of those snaps to be rolled back if an error is detected.

The process is initiated by partially setting up the new snap. It's only after a successful reboot using the new snap that snapd officially considers the new snap verified and installed.

### modeenv

As a part of this partial setup, snapd writes information to a file referred to as the `modeenv`. Here is an example of what this file could look like:

```
mode=run
current_recovery_systems=20240603
good_recovery_systems=20240603
base=core24_1006.snap
gadget=pc_196.snap
current_kernels=pc-kernel_2488.snap
model=canonical/ubuntu-core-24-amd64
grade=signed
```

This file acts as a bridge between snapd and programs that run early in the boot process.

In addition to defining the set of essential snaps that the system should boot with, the fields `try_base` and `base_status` in the `modeenv` are used to specify whether to perform a test boot with a new base snap:

```
try_base=core20_124.snap
base_status=try
```

A similar set of operations tests the kernel snap. However, rather than using the `modeenv`, the bootloader is directly configured to use the new kernel. When using grub, this results in setting the `kernel_status` field in grub's environment file.

### Gadget snap considerations

The [gadget snap](/reference/gadget-snap-format) is not verified during a remodel. While switching the gadget snap can update boot assets and potentially cause issues, testing it in the same manner as the kernel and base snaps is not feasible due to its inclusion of the bootloader.

## Phase 3: Boot verification

Once the aforementioned data in the `modeenv` file or the bootloader environment is set, a reboot is initiated. On reboot, the bootloader is configured to coordinate with snapd to test the kernel. Similarly, snap-bootstrap, a program that is run early in the boot process, helps orchestrate the testing of the new base snap.

Once started, snapd will confirm that the boot was successful. A successful boot will result in the continuation of the remodel process. A failed boot will result in the cancellation of the remodel. Any changes up to that point will be undone.

During a remodel, snapd performs these reboots to switch essential snaps sequentially.

## Phase 4: Recovery system creation

Ubuntu Core has the concept of a recovery system. This system enables the user to repair a broken Ubuntu Core system by booting into [recovery mode](/how-to-guides/manage-ubuntu-core/use-a-recovery-mode). Generally, this system is created when the image for the Ubuntu Core system is created. This recovery system contains the essential snaps defined in the original model. With a remodel operation, snapd creates a new recovery system that contains the snaps from the incoming model.

In a very similar fashion to the process described above, this new recovery system is verified with a reboot. Information about the recovery system being tested is shared via the modeenv file. Failing to verify the functionality of the new recovery system will result in the remodel being aborted and all changes being undone.

## Phase 5: Finalization

Finally, after testing the recovery system, the new recovery system is verified and promoted so that it may be used. At this point, the remodel has completed.
