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

For example, the following command will launch and boot core24 with an instance name of `mycore24`:

```bash
multipass launch core24 -n mycore24
```

The image is downloaded and locally cached when it's launched for the first time.

### Access a running instance

You can connect to a running instance of Ubuntu Core by opening a shell environment on that running instance:

```bash
multipass shell mycore24
```

## Create a local AI inference appliance

You can use the running Ubuntu Core instance to create a dedicated AI inference appliance. This works well in a VM because it does not require a connected display.

The following example installs the `gemma3` inference snap and the `open-webui` snap. Gemma3 provides the local inference endpoint, and Open WebUI provides a browser interface for using it.

> **Note:**
> Inference snaps use snap components for runtime and model weights. `gemma3` requires snapd 2.68 or newer.
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
>multipass stop mycore24
>multipass start mycore24
>multipass shell mycore24
>```

From inside the Ubuntu Core instance, install the snaps:

```bash
sudo snap install gemma3 open-webui
```

Add a note that you need ot update snapd 

Check the Gemma3 endpoint:

```bash
gemma3 status
```

The output includes the active engine and endpoints. For example:

```text
engine: intel-cpu
services:
    server: active
endpoints:
    openai: http://localhost:8328/v3
```
The `localhost` address here is local to the Ubuntu Core instance.

### Check the selected inference engine

Inference snaps detect the available hardware and select a suitable runtime and model configuration for the device. To see which engines are available for `gemma3`, run:

```bash
gemma3 list-engines
```

If `gemma3` is using `cpu-xsmall`, it is running with a very low-footprint engine. You can continue with this tutorial using `cpu-xsmall`, or switch to the `intel-cpu` engine:

```bash
sudo gemma3 set engine=intel-cpu
sudo snap restart gemma3
```

For better performance in a Multipass VM, use at least 2 CPUs and 4 GiB of memory. This tutorial was tested with 2 CPUs, 4 GiB of memory and 15 GiB of disk space.

To change the resources assigned to an existing instance, see [modify an instance](https://documentation.ubuntu.com/multipass/latest/how-to-guides/manage-instances/modify-an-instance/) for more information.

## Make Open WebUI available from the host

By default, Open WebUI may listen only on the Ubuntu Core instance's local loopback address. To open it from a browser on your host machine, configure the Open WebUI snap to listen on the instance network interface:

```bash
sudo snap set open-webui host=0.0.0.0
sudo snap restart open-webui
```

From a terminal on your host machine, find the instance IP address:

```bash
multipass info mycore24
```

The output includes an IPv4 address:

```text
Name:           mycore24
State:          Running
Snapshots:      0
IPv4:           10.100.120.150
Release:        Ubuntu Core 24
```

Open the following address in a browser on your host machine, replacing `<instance-ip>` with the IPv4 address from `multipass info`:

```text
http://<instance-ip>:8080
```

You should see the Open WebUI interface.

## Configure Open WebUI to use Gemma3

> **Note:**
> Open WebUI is used here to provide a simple browser interface for the local inference endpoint. This part of the tutorial is Open WebUI configuration rather than Ubuntu Core configuration.
>
> If you prefer to test the inference snap directly, use the OpenAI-compatible API exposed by `gemma3` instead. See [Use an inference snap via its OpenAI API](https://documentation.ubuntu.com/inference-snaps/how-to/use-openai-api/) for details.

Create an Open WebUI account if prompted, then configure a direct connection to the Gemma3 inference endpoint.

In Open WebUI:

1. Open the user menu.
2. Select **Settings**.
3. Select **Connections**.
4. If you are not using them, disable the default OpenAI and Ollama API connections.
5. Enable **Direct Connections** and save the change.
6. Return to **Settings** > **Connections**.
8. Select the **+** button to add a new connection.
9. In the **URL** field, enter:

   ```text
   http://<instance-ip>:8328/v3
   ```
10. Save the connection.

After the connection is saved, return to the chat page and select the Gemma3 model from the model selector.

For more information about this Open WebUI setup, see [Configure Open WebUI for use with inference snaps](https://documentation.ubuntu.com/inference-snaps/how-to/configure-openwebui/).

## What this demonstrates

This example turns a pre-built Ubuntu Core image into a network-accessible AI inference appliance:

- Gemma3 runs as a managed snap service.
- Open WebUI runs as a managed snap service.
- The browser interface is accessed from the host machine.
- The inference endpoint runs inside the Ubuntu Core instance.
- The application snaps are separate from the Ubuntu Core base system.

> **Note:**
> In a final product, snaps such as `gemma3` and `open-webui` would normally be included and configured in your custom Ubuntu Core image, rather than installed manually after first boot. With this approach, the device or VM starts directly into the experience you have configured. End users do not need to see these setup instructions, interact with the Ubuntu Core login message, or log in to the Core instance unless your product design requires it. You control the product experience you choose to deliver.
>
> A custom Ubuntu Core image is described with a [model assertion](https://documentation.ubuntu.com/core/reference/assertions/model/), which defines the snaps that make up the device image, including required or optional application snaps.
>
> Alternatively, snaps can be installed, configured and managed later through a fleet management process. [Landscape](https://documentation.ubuntu.com/landscape/) provides centralised administration for Ubuntu deployments, including IoT devices.

You are now operating within the Ubuntu Core environment. See {ref}`First steps with Ubuntu Core <how-to-guides-using-ubuntu-core>` for suggestions on what to try outside a VM.

