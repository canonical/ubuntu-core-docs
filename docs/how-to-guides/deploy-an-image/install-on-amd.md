# Install a pre-built Ubuntu Core image on an AMD Kria

Pre-built images are ideal for the exploration and experimentation of Ubuntu Core, but they are not intended for deployment or use at scale. They include snaps to provide an onboarding and evaluation experience, alongside an SSH connection, and these are unlikely to be required in your own Ubuntu Core deployment.

You can find more information about building Core images in the [Build your first image](/tutorials/build-your-first-image/index) tutorial.

Ubuntu Core runs on a wide range of hardware, and pre-built images are available for the [AMD Kria SOMs](https://www.amd.com/en/products/system-on-modules/kria.html).

AMD Kria installation is accomplished in two stages; with the first stage preparing the board and installing the bootloader, and the second stage installing the Ubuntu Core image.

```{admonition} Early access for AMD Kria
 :class: warning

Ubuntu Core images for AMD Kria devices are currently at an _early access_ stage, and should not be considered appropriate for production deployment.

Work is underway to build Ubuntu Core production images for these boards.
```

## Requirements

In addition to having a basic understanding of Linux, including running commands from the terminal, you will need the following:

On a host machine, in order to write the image:

- [Ubuntu 24.04 LTS](https://releases.ubuntu.com/24.04/) or later installed
- Internet connectivity
- 10GB of free storage space
- A microSD card reader
- 4GB+ microSD card
- USB cable for UART
- An [Ubuntu SSO account with associated SSH keys](/how-to-guides/manage-ubuntu-core/use-ubuntu-one-ssh).

The target device:

- [AMD Kria](https://www.amd.com/en/products/system-on-modules/kria.html)
- Power adapter that comes with it

A pre-built Ubuntu Core image does not use a username and password to login to the system. It instead uses SSH and your public SSH key, which is uploaded to your Ubuntu One account. This is handled by the console-conf snap bundled in pre-built test images. SSH is otherwise not a requirement for Ubuntu Core images. See [Connect to Ubuntu Core with SSH](https://documentation.ubuntu.com/core/how-to-guides/manage-ubuntu-core/use-ubuntu-one-ssh/) for further details.

## Prepare the device

Make sure to have latest [BOOT FW](https://xilinx-wiki.atlassian.net/wiki/spaces/A/pages/3020685316/Kria+SOM+Boot+Firmware+Update#Boot-Firmware-Downloads) installed for your [AMD Kria](https://www.amd.com/en/products/system-on-modules/kria.html) SOM, following the instructions explained.

## Write the Ubuntu Core image to the microSD card

Next, download the latest AMD Kria Ubuntu Core image from [the official webpage](https://ubuntu.com/download/amd).

We're going to use the Raspberry Pi Foundation's _Raspberry Pi Imager_ to write the Ubuntu Core image to the microSD card. Raspberry Pi Imager both downloads and safely installs an image to your microSD card.

Download and install Raspberry Pi Imager from one of the following locations:

- Official download page: [https://www.raspberrypi.org/software](https://www.raspberrypi.org/software/)
- Snap package for Linux users: [https://snapcraft.io/rpi-imager](https://snapcraft.io/rpi-imager)

After it's installed and running, you will see its main window showing buttons for the three step process to download and write the image:

![Raspberry Pi Imager](https://assets.ubuntu.com/v1/617104fd-raspberry-pi-imager.png)

1. Select **Choose Device** and a Raspberry Pi devices list appears. Now select "No filtering" from the list.

2. Select **Choose OS** and a pop-up list appears. Scroll down to the bottom and select **Use custom**. In the file requester that appears, select the `iot-limerick-kria-core*.img.xz` image file you just downloaded. The _xz_ file can be selected without being decompressed first.

3. Select **Choose Storage** and insert your microSD if you haven't already. Now select the device from the list.

4. Finally, select **Next**. A warning will state that all data on your selected device will be erased, so it's worth double checking your selection was correct. Select **Yes** if you're sure. You may then be asked for your password before the download, write and verification processes begin.

When the process has finished, Raspberry Pi Imager will proclaim "Write Successful" and you can remove the card from the reader. It's now ready to be inserted into your device.

If there's any errors during write, check your sd card. Optionally you might unpack the .xz archive and subsequently write the .img file with the Raspberry Pi imager.

## Boot Ubuntu Core for the first time

With the device powered off, insert the microSD card. After that you can power on the board.

From this point, it can take around 30 minutes for the system to instantiate itself. You will see typical Linux output on the screen, periods where there's just a flashing cursor, and messages like _Installing the system, please wait for a reboot_. When this process has finished, you will see the following:

`Press enter to configure.`

Press **Enter** and you will see a prompt that reads:

```text
Ubuntu Core
Configure the network and setup an administrator account on this all-snap
Ubuntu Core system.
```

Press **Enter** again and you will be taken to the network setup page:

![Network connections](https://assets.ubuntu.com/v1/2017b744-8db3caab6834b5307574a8b6d7d6bb1f4a08230f_2_690x434.png)

### Configure a network connection

Network access is a requirement for Ubuntu Core.

If an Ethernet cable is connected to your device, a network connection will attempt to be automatically negotiated and, if this is successful, you will see an IP address for the device after the DHCPv4 entry in the _Network connections_ page. In this case, you don't need to do anything further:

![Choose eth0](https://assets.ubuntu.com/v1/74586cbe-74586cbe2090bb63c3e7017907011293dc950458.png)

To configure an Ethernet connection manually, select the ethernet device and select _Edit IPv4_ from the small menu that appears. By default, the network device will be configured to use _Automatic (DHCP)_, which is why the connection attempts to automatically configure itself. Press **Enter** to reveal two further options, _Manual_ and _Disabled_:

![Select Manual](https://assets.ubuntu.com/v1/01acc192-01acc19205a26a77cbb96021a47e36f0a3f9eff6.png)

Selecting _Manual_ will allow you to configure your Ethernet connection manually by entering values for your subnet mask value (using CIDR `xx.xx.xx.xx/yy` notation), the static IP address of your device, the network gateway, and the name servers you wish to use:

![Edit eth0 IPv4 configuration](https://assets.ubuntu.com/v1/ad78cf8a-ad78cf8a153e449632f6033c2359e69737039415.png)

Select **Save** to apply those changes and for the connection to be attempted. You can now proceed to the next step by pressing **Done**.

### Add Ubuntu SSO details

This is the final step before completing the Ubuntu Core setup and you simply need to enter the email address linked to your Ubuntu SSH account.

![Add Ubuntu SSO email](https://assets.ubuntu.com/v1/b3a33588-b3a3358817541057242e99b2c65452405b4f0fec.png)

As mentioned earlier, your account is used to link its registered SSH keys to the new device deployment and allow you to connect without any further device configuration.

With your username registered across the network, you will see a message similar to the following:

```
This device is registered to <ubuntu-sso-email-address>

Remote access was authenticated with SSO user <username>.
Public SSH keys were added to the device for remote access.

<ubuntu-sso-email-address> can connect remotely to this device via SSH:

ssh <username>@<ip-address>
```

Everything is now configured and you're ready to connect to the device.

## Connect to the device

If a display is connected, the network addresses and associated account username will be shown.

You can now connect to your Ubuntu Core machine with the _ssh_ command and your username followed by the IP address of your device:

`ssh <username>@<device ip address>`

For example:

```text
$ ssh user@10.0.2.15
The authenticity of host '192.168.1.68 (192.168.1.68)' can't be established.
ED25259 key fingerprint is SHA256:VD5KH7hM5RxQ15mM70zyJvgmg.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.1.68' (ED25259) to the list of known hosts.
[...]
This Ubuntu Core machine is a tiny, transactional edition of Ubuntu,
designed for appliances, firmware and fixed-function VMs.
```

As shown above, the first time you connect to a new device you will be asked to accept its authenticity. You can check the _ECDSA_ key fingerprint against the finger print shown on the screen after a first reboot. ECDSA is the second one listed.

Congratulations! You have successfully downloaded, installed, and connected to a pre-built Ubuntu Core image on your AMD Kria.

See [First steps with Ubuntu Core](/how-to-guides/using-ubuntu-core) for an introduction to using your new Ubuntu Core installation or learn how to [build your Ubuntu Core image](/tutorials/build-your-first-image/index).
