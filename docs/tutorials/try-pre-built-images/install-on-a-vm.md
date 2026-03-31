(tutorials-get-started-try-pre-built-images-install-on-a-vm)=
# Install on a VM

You can try Ubuntu Core without any specific hardware from within a virtual machine using [Multipass](https://multipass.run/) on Windows, Mac and Linux. Multipass has integrated support for the latest Ubuntu Core images and can launch and run virtual machines from a single command.

> If you need to test your own Ubuntu Core images, see {ref}`Test Ubuntu Core with QEMU <how-to-guides-manage-ubuntu-core-test-on-qemu>`. QEMU, is more configurable than Multipass and can boot either a supported image or a custom image, with or without TPM emulation and full disk encryption. 

## Boot Ubuntu Core with Multipass

If you don't yet have Multipass installed, see [Install Multipass](https://multipass.run/docs/install-multipass). If it's installed, the following command will output its current state:

```bash
multipass info
```

### List available images

To list which images Multipass currently has available, type `multipass find`.

The output will include Ubuntu Core images alongside standard Ubuntu images:

```text
Image       Aliases           Version          Description
core20                        20230119         Ubuntu Core 20
core22                        20230717         Ubuntu Core 22
20.04        ocal             20240129.1       Ubuntu 20.04 LTS
22.04        ammy,lts         20240126         Ubuntu 22.04 LTS
daily:24.04  noble,devel      20240129         Ubuntu 24.04 LTS
```

### Launch an image

To create a new instance and boot your choice of Ubuntu Core image, type:

```bash
multipass launch <image-name> -n <instance-name>
```

For example, the following command will launch and boot core22 with an instance name of `mycore22`:

```bash
multipass launch core22 -n mycore22
```

The image is downloaded and locally cached when it's launched for the first time.

### Access a running instance

You can connect to a running instance of Ubuntu Core by opening a shell environment on that running instance:

```bash
multipass shell mycore22
```

You are now operating within the Ubuntu Core environment. See {ref}`First steps with Ubuntu Core <how-to-guides-using-ubuntu-core>` for suggestions on what to try.

