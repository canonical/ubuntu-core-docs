(how-to-guides-manage-ubuntu-core-test-on-qemu)=
# Test on QEMU

You can test Ubuntu Core without specific hardware from within a virtual machine, using either Multipass or QEMU (https://www.qemu.org/).

- Multipass has integrated support for the latest Ubuntu Core images and is quicker to get started with
- QEMU is more configurable and can boot either a supported image or a custom image, with or without TPM emulation and full disk encryption.

Using QEMU is covered below. For details on using Multipass, see {ref}`Test Ubuntu Core with Multipass <tutorials-get-started-try-pre-built-images-install-on-a-vm>`.

## Test QEMU

To test Ubuntu Core with QEMU on Ubuntu, first install the `qemu-kvm` package and test it with `kvm-ok` (a utility that comes with the `cpu-checker` package):

```bash
sudo apt install qemu-kvm
```
```
$ kvm-ok
INFO: /dev/kvm exists
KVM acceleration can be used
```
To ensure compatibility with the required UEFI features in Ubuntu Core, also install the [OVMF](https://wiki.ubuntu.com/UEFI/OVMF) package, which includes the UEFI firmware file, `OVMF_CODE_4M.secboot.fd`: 

```bash
sudo apt install ovmf
```

Download the preferred Ubuntu Core image for your device platform. See {ref}`Testing platforms <reference-testing-platforms>` for links to images.

By default, images are compressed with _xz_ and can be expanded from the Linux command line with the following command:

```bash
xz -d <image-name>.img.xz
```

The above command will remove the original archive leaving only the uncompressed image which will change after being booted. To keep a copy of the original archive, add the `-k` argument.

## Boot an Ubuntu Core image with QEMU

The exact QEMU command to run will depend on your host hardware capabilities and architecture, such as available memory and CPU cores, but the following should work in the majority of cases on x86_64-based hardware.

For UEFI boot to work, first copy both OVMF_CODE_4M.secboot.fd and OVMF_VARS_4M.ms.fd to a user-accessible location. In the following examples, we assume they're in the local directory.

For example, on Ubuntu-based systems, the following commands will copy them to the local directory:

```bash
cp  /usr/share/OVMF/OVMF_CODE_4M.secboot.fd .
cp /usr/share/OVMF/OVMF_VARS_4M.ms.fd .
```

Older versions of Ubuntu, and other Linux distributions, may not use the `_4M` suffix in the OVMF filenames, but they can usually be found in `/usr/share/OVMF`.

### Without TPM emulation

To test Ubuntu Core without TPM emulation, run the following:

```bash
qemu-system-x86_64 \
 -enable-kvm \
 -smp 1 \
 -m 2048 \
 -machine q35 \
 -cpu host \
 -global ICH9-LPC.disable_s3=1 \
 -net nic,model=virtio \
 -net user,hostfwd=tcp::8022-:22 \
 -drive file=OVMF_CODE_4M.secboot.fd,if=pflash,format=raw,unit=0,readonly=on \
 -drive file=OVMF_VARS_4M.ms.fd,if=pflash,format=raw,unit=1 \
 -drive "file=<ubuntu-core-image.img>",if=none,format=raw,id=disk1 \
 -device virtio-blk-pci,drive=disk1,bootindex=1 \
 -serial mon:stdio
```

For specific details on what each argument is doing, see the [QEMU manpage](https://www.qemu.org/docs/master/system/qemu-manpage.html).

### With TPM emulation and full disk encryption

We recommend first installing a test snap that emulates TPM in software with [libtpms](https://github.com/stefanberger/libtpms) (see the [swtpm documentation](https://github.com/stefanberger/swtpm/wiki) for implementation details):

```bash
snap install --edge test-snapd-swtpm
```

The path to the snap's libtpms-based socket (`/var/snap/test-snapd-swtpm/current/swtpm-sock`) is passed to the QEMU command:

```bash
sudo qemu-system-x86_64 \
 -enable-kvm \
 -smp 1 \
 -m 2048 \
 -machine q35 \
 -cpu host \
 -global ICH9-LPC.disable_s3=1 \
 -net nic,model=virtio \
 -net user,hostfwd=tcp::8022-:22,hostfwd=tcp::8090-:80  \
 -drive file=OVMF_CODE_4M.secboot.fd,if=pflash,format=raw,unit=0,readonly=on \
 -drive file=OVMF_VARS_4M.ms.fd,if=pflash,format=raw,unit=1 \
 -chardev socket,id=chrtpm,path="/var/snap/test-snapd-swtpm/current/swtpm-sock" \
 -tpmdev emulator,id=tpm0,chardev=chrtpm \
 -device tpm-tis,tpmdev=tpm0 \
 -drive "file=<ubuntu-core-image.img>",if=none,format=raw,id=disk1 \
 -device virtio-blk-pci,drive=disk1,bootindex=1 \
 -serial mon:stdio
```

### Reset the TPM

If you wish to run a new clean image after previously running QEMU with the emulated TPM, you will need to reset the emulated TPM state. The safest way to do this is to purge remove and reinstall the emulator snap:

```bash
snap remove --purge test-snapd-swtpm
snap install --edge test-snapd-swtpm
```

### Boot an ARM64 Ubuntu Core image

It is possible to boot Ubuntu Core arm64 images with qemu-system for arm64 on x86_64 systems. Additional requirements can be installed by running the following, which includes the ARM UEFI firmware:

```bash
sudo apt install qemu-efi-aarch64 qemu-system-arm
```

To run the [arm64 image](https://cdimage.ubuntu.com/ubuntu-core/22/stable/current/ubuntu-core-22-arm64.img.xz) without TPM, execute:

```bash
qemu-system-aarch64 -machine virt -cpu cortex-a57 -smp 2 -m 4096 \
                        -bios /usr/share/AAVMF/AAVMF_CODE.ms.fd \
                        -netdev user,id=net0,hostfwd=tcp::8022-:22 \
                        -device virtio-net-pci,netdev=net0 \
                        -drive if=virtio,file="ucarm.img",format=raw \
                        -device virtio-gpu-pci \
                        -device virtio-keyboard \
                        -device virtio-mouse \
                        -serial mon:stdio
```

Due to QEMU emulating a different architecture, the full installation can take some time.

It is also possible to run with an emulated TPM by installing the same `test-snapd-swtpm` snap as for x86. For this to work, you need to first copy the UEFI variables from your system to the local directory. This only needs to be done once, before the first boot of a clean image:

```bash
cp /usr/share/AAVMF/AAVMF_VARS.ms.fd .
```

QEMU can now be run:

```bash
sudo qemu-system-aarch64 -machine virt -cpu cortex-a57 -smp 2 -m 4096 \
        -drive file=/usr/share/AAVMF/AAVMF_CODE.md.fd,if=pflash,format=raw,unit=0,readonly=on \
        -drive file=AAVMF_VARS.ms.fd,if=pflash,format=raw,unit=1 \
        -netdev user,id=net0,hostfwd=tcp::8022-:22 \
        -device virtio-net-pci,netdev=net0 \
        -drive "file=uc.img",if=none,format=raw,id=disk1 \
        -device virtio-blk-pci,drive=disk1,bootindex=1 \
        -chardev socket,id=chrtpm,path=/var/snap/test-snapd-swtpm/current/swtpm-sock \
        -tpmdev emulator,id=tpm0,chardev=chrtpm \
        -device tpm-tis-device,tpmdev=tpm0 \
        -object rng-random,filename=/dev/urandom,id=rng0 \
        -device virtio-rng-pci,rng=rng0,id=rng-device0 \
        -device virtio-gpu-pci \
        -device virtio-keyboard \
        -device virtio-mouse \
        -serial mon:stdio
```

As before, due to QEMU emulating a different architecture the full installation can take some time.

## Accessing the VM

In the the above QEMU commands, we forward the virtual SSH port 22 to port 8022 on the host. To access this configuration from your host machine, type the following:

```
ssh -i <path-to-private-key> <sso-username>@localhost -p 8022
```

In addition to SSH access, QEMU will start a VNC-shared console which can be accessed at `vnc://localhost:5900` on the system. Some configurations may also forward port 80 to 8090 for any web server application you wish to install in the VM.

For a brief introduction on how to get started with Ubuntu Core, see {ref}`Using Ubuntu Core <how-to-guides-using-ubuntu-core>`.

