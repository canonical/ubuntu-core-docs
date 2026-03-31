(reference-system-requirements)=
# System requirements

Ubuntu Core provides a minimalist base that can run on a wide range of hardware, from IoT devices and PC-style platforms to industrial computing. 

Requirements are flexible, but they're generally constrained by the following minimum values.

## Architecture

Ubuntu Core supports various 64-bit architectures and 32-bit Arm.

- amd64 (Intel/AMD 64-bit)
- arm64 (64-bit Arm)
- armhf (32-bit Arm)
- riscv64 (64-bit RISC-V)

For specific platforms, see our list of [Ubuntu certified devices](https://ubuntu.com/certified/iot).

Pre-built testing images are also available for a range of devices. See {ref}`Supported testing platforms <reference-testing-platforms>` for further details.

[Get in touch](https://ubuntu.com/core/contact-us?product=core-overview) to discuss more constrained or specific requirements.

## Memory

**Minimum RAM**: 512MB

It's likely that devices will include much more on-board RAM, which Ubuntu Core can take full advantage of.

## Storage

**Minimum storage**: 1GB

Most storage devices are supported, including eMMC and SSD devices. One exception is NAND flash memory, which is not supported.

We also support custom hardware storage configuration, including hardware rate configuration, as described below.

## Full disk encryption

Full disk encryption support requires both [UEFI Secure Boot](https://wiki.ubuntu.com/UEFI/SecureBoot) and TPM 2.0 (Trusted Platform Module) support. A device will also need an IOMMU to secure data transfers.

External I2C/SPI-based TPM modules are not currently supported.

Otherwise, the full disk encryption implementation in Ubuntu Core is generic and widely compatible to help support a range of hardware. 

For a non-standard (non-UEFI+TPM platform) FDE platform, such as a Raspberry Pi or other ARM devices, implementation is board-specific and will typically involve creating custom gadget and kernel snaps. UC20/UC22, however, do provide a helper mechanism, via a hook interface, to ensure the integrity of any subsequently executed or accessed data. 

See {ref}`Full disk encryption <explanation-full-disk-encryption>` for further details.

