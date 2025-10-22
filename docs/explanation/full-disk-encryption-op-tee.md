# Full disk encryption with OP-TEE

OP-TEE is an open source Trusted Execution Environment (TEE) for Arm systems. It provides a _secure world_ that runs alongside the normal operating system. Trusted Applications (TAs) run inside that secure world, while normal-world software calls into them through standard TEE APIs. For [Full disk encryption](full-disk-encryption) (FDE), OP-TEE protects disk-unlock keys. All cryptographic operations happen inside the secure world and _plaintext_ keys are never written to disk.

## How Snapd uses OP-TEE

Snapd (the snap daemon) integrates with a Canonical-provided [OP-TEE TA](https://github.com/canonical/optee-uc-fde) that knows how to seal and unseal LUKS keys inside the secure world.

During installation, snapd decides how to seal the LUKS disk keys. It first looks for a kernel [`fde-setup` hook](https://snapcraft.io/docs/uc20-fde-hooks#heading--fde-setup), then for the dedicated OP-TEE TA, and finally falls back to TPM-backed sealing. The selection is automatic and requires no user input.

When OP-TEE is selected, snapd asks the TA to seal the disk key. The TA performs the encryption inside the secure world and hands back the sealed key. The encrypted key is stored on disk so that it can be used to decrypt the LUKS partition later. Note that only the TA can decrypt the sealed key, so storing the sealed key is safe.

During boot snapd loads the sealed key from disk, asks the TA to decrypt the key, and then uses the plaintext key to unlock the LUKS partition. Then, snapd locks the TA for the rest of the boot so no further requests are accepted.

## Prerequisites

A system must meet the following criteria before using snapd's OP-TEE integration:

* The installation target should be either an armhf or arm64 Ubuntu Core system.
* The device firmware must ship OP-TEE with the Canonical FDE TA as an early TA. 
* The Linux kernel must expose the OP-TEE device nodes, typically `/dev/tee0` and `/dev/teepriv0`. These are provided by the `tee` and `optee` kernel modules.

### Bundling the FDE Trusted Application

The FDE TA must be built as an [early TA](https://optee.readthedocs.io/en/latest/architecture/trusted_applications.html#early-ta) so that OP-TEE loads it together with the firmware before the normal world boots. The [sample gadget](https://github.com/canonical/optee-uc-fde/tree/master/snaps/test-qemu-optee-gadget) shows the workflow in practice.

1. Build the TA from the `github.com/canonical/optee-uc-fde` repository.  
1. Build OP-TEE OS with `CFG_EARLY_TA=y` and list the TA in `EARLY_TA_PATHS` alongside any other early TAs. Review the sample gadget's `optee-os` part for an example.  
1. Package the resulting OP-TEE firmware (`tee-header_v2.bin`, `tee-pager_v2.bin`, `tee-pageable_v2.bin`, and `tee.elf`) together with the rest of the boot firmware.

This ensures that snapd can interface with the TA during installation and subsequent boots.

## Migrating from `fde-setup` Hooks

Earlier OP-TEE deployments used kernel `fde-setup` hooks to interface with OP-TEE. The easiest migration path is to [remodel](remodelling) the device onto a kernel snap that omits those hooks and allows snapd to talk to the TA directly.

1. Create a kernel snap that no longer ships the `fde-setup` hook.  
2. Remodel the system to refresh the kernel and reboot. On the first boot after the remodel, snapd detects that no hook is present, reseals the encryption keys through OP-TEE, and stores the new sealed keys.

Note that an existing TA that might have been used with a hooks-based implementation should still be compatible with snapd's integration.  
