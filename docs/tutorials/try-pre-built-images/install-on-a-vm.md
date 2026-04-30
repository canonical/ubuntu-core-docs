---
myst:
  html_meta:
    description: Install Ubuntu Core in a virtual machine with Multipass. Try pre-built images without dedicated hardware requirements.
---

(tutorials-get-started-try-pre-built-images-install-on-a-vm)=
# Install on a VM

You can try Ubuntu Core without any specific hardware from within a virtual machine using [Multipass](https://canonical.com/multipass) on Windows, Mac and Linux. Multipass has integrated support for the latest Ubuntu Core images and can launch and run virtual machines from a single command.

For deployment in the field, you would normally build a custom Ubuntu Core image that includes your required snaps, configuration, permissions and update policy. Pre-built images are useful for exploration, but a product image should be described by your own model assertion and built for your target device.

> If you need to test your own Ubuntu Core images, see {ref}`Test Ubuntu Core with QEMU <how-to-guides-manage-ubuntu-core-test-on-qemu>`. QEMU, is more configurable than Multipass and can boot either a supported image or a custom image, with or without TPM emulation and full disk encryption. 

## Boot Ubuntu Core with Multipass

If you don't yet have Multipass installed, see [Install Multipass](https://canonical.com/multipass/install). If it's installed, the following command will output its current state:

```bash
multipass info
```

### List available images

To list which images Multipass currently has available, type `multipass find`.

The output will include Ubuntu Core images alongside standard Ubuntu images:

```text
Image       Aliases           Version          Description
core26                        20260403         Ubuntu Core 26
core24                        20240603         Ubuntu Core 24
core22                        20230717         Ubuntu Core 22
core20                        20230119         Ubuntu Core 20
24.04        noble, lts       20260321         Ubuntu 24.04 LTS
22.04        ammy,lts         20240126         Ubuntu 22.04 LTS
20.04        ocal             20240129.1       Ubuntu 20.04 LTS
```

### Launch an image

To create a new instance and boot your choice of Ubuntu Core image, type:

```bash
multipass launch <image-name> -n <instance-name>
```

For example, the following command will launch and boot core26 with an instance name of `mycore26`:

```bash
multipass launch core26 -n mycore26
```

The image is downloaded and locally cached when it's launched for the first time.

### Access a running instance

You can connect to a running instance of Ubuntu Core by opening a shell environment on that running instance:

```bash
multipass shell mycore26
```

## Create a local AI inference appliance

You can use Ubuntu Core to create a local AI inference appliance. 

The following example installs the `gemma4` inference snap and allows you to run inference directly on your Ubuntu Core VM. 

### Launch an image

Create a new instance of Ubuntu Core with enough resources to run the model, type:

```bash
multipass launch core26 -n aibox --cpus 4 --memory 10GB --disk 16GB 
```

> **Note:**
> Inference snaps use snap components for runtime and model weights. `gemma4` requires snapd 2.68 or newer.
>
> Check your version with:
>
> ```bash
> snap version
> ```
>
> If needed, update snapd:
>
> ```bash
> sudo snap refresh snapd
> ```
> After refreshing snapd, stop and start the Ubuntu Core instance from your host machine:
>
>```bash
>multipass stop aibox
>multipass start aibox
>multipass shell aibox
>```

From inside the Ubuntu Core instance, install the snaps:

```bash
sudo snap install gemma4
```

Check the Gemma4 endpoint:

```bash
gemma4 status
```

The output includes the active engine and endpoints. For example:

```text
engine: cpu
services:
    server: active
    server-webui: active
endpoints:
    openai: http://localhost:8336/v1
    webui: http://localhost:8337/
```
The `localhost` address here is local to the Ubuntu Core instance.

## Make WebUI available from the host

By default, WebUI may listen only on the Ubuntu Core instance's local loopback address. To open it from a browser on your host machine, configure the WebUI to listen on the instance network interface:

```bash
sudo gemma4 set http.host=0.0.0.0 webui.http.host=0.0.0.0 --assume-yes
```

From a terminal on your host machine, find the instance IP address:

```bash
multipass info aibox
```

The output includes an IPv4 address:

```text
Name:           aibox
State:          Running
Snapshots:      0
IPv4:           10.100.120.150
Release:        Ubuntu Core 26
```

Open the following address in a browser on your host machine, replacing `<instance-ip>` with the IPv4 address from `multipass info`:

```text
http://<instance-ip>:8337
```

You should see the WebUI interface.

## What this demonstrates

This example turns a pre-built Ubuntu Core image into a network-accessible AI inference appliance:

- Gemma4 runs as a managed snap service.
- Open WebUI runs as a managed snap service.
- The browser interface is accessed from the host machine.
- The inference endpoint runs inside the Ubuntu Core instance.
- The application snaps are separate from the Ubuntu Core base system.

> **Note:**
> In a final product, snaps such as `gemma4` would normally be included and configured in your custom Ubuntu Core image, rather than installed manually after first boot. With this approach, the device or VM starts directly into the experience you have configured. End users do not need to see these setup instructions, interact with the Ubuntu Core login message, or log in to the Core instance unless your product design requires it. You control the product experience you choose to deliver.
>
> A custom Ubuntu Core image is described with a [model assertion](https://documentation.ubuntu.com/core/reference/assertions/model/), which defines the snaps that make up the device image, including required or optional application snaps.
>
> Alternatively, snaps can be installed, configured and managed later through a fleet management process. [Landscape](https://documentation.ubuntu.com/landscape/) provides centralised administration for Ubuntu deployments, including IoT devices.

You are now operating within the Ubuntu Core environment. See {ref}`First steps with Ubuntu Core <how-to-guides-using-ubuntu-core>` for suggestions on what to try outside a VM.

