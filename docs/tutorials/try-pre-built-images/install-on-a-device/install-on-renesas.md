# Install a pre-build Ubuntu Core image on a Renesas RZ/G2L

Pre-built images are ideal for exploration and experimentation of Ubuntu Core, but they are not intended for deployment or use at scale. They include snaps to provide an onboarding and evaluation experience, alongside an SSH connection, and these are unlikely to be required in your own Ubuntu Core deployment.

You can find more information about building Core images in the [Build your first image](/tutorials/build-your-first-image/index) tutorial.

Ubuntu Core runs on a large range of hardware, and pre-built images are available for the [Renesas RZ/G2L](https://www.renesas.com/en/products/microcontrollers-microprocessors/rz-mpus/rzg2l-general-purpose-mpu-dual-core-arm-cortex-a55-cpus-and-single-core-cortex-m33-cpu-3d-graphics-and).

Renesas RZ/G2L installation is accomplished in two stages; with the first stage preparing the board and installing the bootloader, and the second stage installing the Ubuntu Core image.

```{admonition} Early access support for Renesas RZ/G2L
 :class: warning

Support for the Renesas RZ/G2L is currently at an _early access_ stage, and should not be considered appropriate for production deployment.

Work is underway to support building Ubuntu Core production images for these boards.

```
## Requirements

In addition to having a basic understanding of Linux and running commands from the terminal and an [Ubuntu One](tutorials/build-your-first-image/access-ubuntu-one) account, you will need the following:

For the used to write the images:
- [Ubuntu 24.04 LTS](https://releases.ubuntu.com/24.04/) or later installed
- Internet connectivity
- 10GB of free storage space
- A microSD card reader
- 4GB+ microSD card
- microUSB cable for UART
- An [Ubuntu SSO account with associated SSH keys](/how-to-guides/manage-ubuntu-core/use-ubuntu-one-ssh).

The target device:
- [Renesas RZ/G2L](https://www.renesas.com/en/products/microcontrollers-microprocessors/rz-mpus/rzg2l-general-purpose-mpu-dual-core-arm-cortex-a55-cpus-and-single-core-cortex-m33-cpu-3d-graphics-and)
- USB Type-C power supply 5V

A pre-built Ubuntu Core image does not use a username and password to login to the system. It instead uses SSH and your public SSH key, which is uploaded to your Ubuntu One account. This is handled by the console-conf snap bundled in pre-built test images. SSH is otherwise not a requirement for Ubuntu Core images. See Connect to Ubuntu Core with SSH for further details.

You will also need a microHDMI adapter, HDMI screen, and keyboard. These are needed to navigate a few installation prompts, but neither are needed after setup has been completed.

## Prepare the device

Before the bootloader can be installed, the Renesas RZ/G2L BOOT / Power Mode DIP switches need to be configured for `SCIF Download Mode` (top left) as shown:

![RZ DIP switch configuration for Ubuntu Core](https://assets.ubuntu.com/v1/b3dd3513-dip-01.png)

This configuration enables SCIF (Serial Communication Interface with FIFO).

Now connect the microUSB cable between your board and the host PC, for data, and then the USB Type-C cable for power.

## Flash the bootloader

Power on the device and press the red button for 2 seconds, a new serial port will appear on your host PC under `/dev/ttyUSB*` (such as `/dev/ttyUSB0`). Set the baud rate for this port to `115200` with the following command, replacing `/dev/ttyUSB*` with the host serial port for your PC:

```
stty -F /dev/ttyUSB0 115200
```

If you connect with the UART, you will see a welcoming prompt from the board:
```
(C) Renesas Electronics Corp.
-- Load Program to System RAM ---------------
please send !
```

On the host machine, download the following Renesas boot assets (zip) archive:
[Renesas boot assets](https://people.canonical.com/~platform/images/renesas-iot/uc24/bootassets_core_rzg2l.zip)

Unzip the archive and locate the file called `Flash_Writer_SCIF_RZG2L_SMARC_DDR4_2GB.mot`, the Renesas Flash Writer tool. Transfer this file to your device with the following command, replacing `/dev/ttyUSB0` with the host PC serial port connected to your device:

```bash
sudo su
cat Flash_Writer_SCIF_RZG2L_SMARC_DDR4_2GB.mot > /dev/ttyUSB0
```

When the transfer has completed, press Ctrl-C to return to you normal shell.

We now need to open a serial console on the device itself, using a tool like [Minicom](https://help.ubuntu.com/community/Minicom) or `screen`.

While connected to the device, run `SUP` to change the baud rate from 115200 to 921600. You will then need to disconnect and reset the baud rate for the serial port to 921600:

```
stty -F /dev/ttyUSB0 921600
```

Reconnect to the device, and run `XLS2` to initiate the flash transfer. When asked for the address, enter `11E00` and `00000`. Now close the connection.

Type the following to transfer the first part of the bootloader from the zip archive we downloaded (`bl2_bp-smarc-rzg2l_pmic.srec`) to the device:

```
sudo su
cat bl2_bp-smarc-rzg2l_pmic.srec > /dev/ttyUSB0
```

After the prompt has returned to the terminal, reconnect to the device and run `XLS2` again. When asked, this time enter `0000` and `1D200` for the addresses and close the connection.

Type the following to transfer final part of the bootloader from the zip archive we downloaded (`fip-smarc-rzg2l_pmic.srec`) to the device:

```
sudo su
cat fip-smarc-rzg2l_pmic.srec > /dev/ttyUSB0
```

When you regain control of the terminal, set the serial bitrate back to `115200`, power off the device, and change the DIP switches to `QSPI Boot Mode`, top right in the image above. The board is now preconfigured to accept the image.

## Write the Ubuntu Core image to the microSD card

Next, download the Renesas RZ/G2L Ubuntu Core image:
[Renesas Ubuntu Core image](https://people.canonical.com/~platform/images/renesas-iot/uc24/ubuntu-core24-rzg2l.img.xz)

We're going to use the Raspberry Pi Foundation's _Raspberry Pi Imager_ to write the Ubuntu Core image to the microSD card. Raspberry Pi Imager both downloads and safely installs an image to your microSD card.

Download and install Raspberry Pi Imager from one of the following locations:
-  Official download page: [https://www.raspberrypi.org/software](https://www.raspberrypi.org/software/)
-  Snap package for Linux users: [https://snapcraft.io/rpi-imager](https://snapcraft.io/rpi-imager)

After it's installed and running, you will see its main window showing buttons for the three step download and write process:

![Raspberry Pi Imager](https://assets.ubuntu.com/v1/7f4829d7-7f4829d76af46a7e658117b72cba3bc04611c798.jpeg)

1. Select **Choose OS** and a pop-up list appears. Scroll down to the bottom and select **Use custom**.  In the file requester that appears, select the `ubuntu-core24-rzg2l.img.xz` image file you just downloaded. The _xz_ file can be selected without being decompressed first.


2. Select **Choose Storage** and insert your microSD if you haven't already. Now select the device from the list.

3. Finally, select **Write**. A warning will state that all data on your selected device will be erased, so it's worth double checking your selection was correct. Select **Yes** if you're sure. You may then be asked for your password before the download, write and verification processes begin.

When the process has finished, Raspberry Pi Imager will proclaim "Write Successful" and you can remove the card from the reader. It's now ready to be inserted into your device.

If there's any errors during write, check your sd card. Optionally you might unpack the .xz archive and subsequently write the .img file with the Raspberry Pi imager.

## Boot Ubuntu Core for the first time

With the device powered off, insert the microSD card.

Ensure the SW1 DIP switch on the module is _not_ set to boot from the SD card (SW1-1 ON, SW1-2 OFF). It should look like this:

![Renesas DIP switch for SD cards](https://assets.ubuntu.com/v1/502b1636-dip-02.png)

In addition to the above, the BOOT / Power Mode DIP switches must also be set to the QSPI boot mode. You can now power on the board.

![RZ DIP switch configuration for Ubuntu Core](https://assets.ubuntu.com/v1/b3dd3513-dip-01.png)

From this point, it can take around 30 minutes for the system to instantiate itself. You will see typical Linux output on the screen, periods where there's just a flashing cursor, and messages like _Installing the system, please wait for a reboot_.  When this process has finished, you will see the following:

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

Network access is a requirement for Ubuntu Core, at least initially, and you have a choice about whether to use a wired connection (Ethernet) or Wi-Fi.

#### Wi-Fi

```{admonition} Kernel failure messages
:class: caution
There is currently a [Linux kernel bug](https://lore.kernel.org/all/d9c9336a-6314-4de9-aead-8b865bb30f05@gmx.net/) that outputs the above failure messages to the screen. These messages can be safely ignored. The bug causing the errors will be fixed in a future release.
```

This is the most common option. If you have a device with Wi-Fi capabilities, it will appear as a separate network device beneath any Ethernet devices.

![Choose wlan0](https://assets.ubuntu.com/v1/3765991b-3765991b629df12859941fe22c7c2fa90a693289.png)

To configure Wi-Fi, press the cursor up key until the wireless device (such as _wlan0_) is selected and press **Enter**. You will see a small menu and you need to select **Edit Wi-Fi**.

![Edit Wi-Fi](https://assets.ubuntu.com/v1/f4889452-f4889452487e4f2eb052ad7410d078a8c0bddd06.png)

After selecting _Edit Wi-Fi_, you will see the network interface configuration panel for Wi-Fi. If you know the name of the Wi-Fi network you wish to connect to, it can be entered directly, or cursor down to _Choose a visible network_ and select a network from a list of those that have been detected.

![Enter password](https://assets.ubuntu.com/v1/04bb9874-bf6ddac76e5fdc34bfdcf353e035c4e1d679d5a4_2_690x385.png)

Finally, enter the Wi-Fi password and select **Save** to complete the configuration. You will be returned to the previous menu and your device will attempt to connect to the network. If successful, you will see its IP address to the right of DHCPv4.

![DHCP](https://assets.ubuntu.com/v1/9a7c81a5-9a7c81a5d6b5202dcb8f222649339a761dd40c45.png)

For advanced network configuration, such as setting a static IP address, select the wireless device again, and choose edit IPv4 from the menu.

When you've finished configuring your network settings, select **Done** and press enter on the _Network connections_ page to move on to the final step.

#### Ethernet

If an Ethernet cable is connected to your device, a network connection will attempt to be automatically negotiated and, if this is successful, you will see an IP address for the device after the DHCPv4 entry in the _Network connections_ page. In this case, you don't need to do anything further:

![Choose eth0](https://assets.ubuntu.com/v1/74586cbe-74586cbe2090bb63c3e7017907011293dc950458.png)

To configure an Ethernet connection manually, select the eth0 device and select _Edit IPv4_ from the small menu that appears. By default, the network device will be configured to use _Automatic (DHCP)_, which is why the connection attempts to automatically configure itself. Press **Enter** to reveal two further options, _Manual_ and _Disabled_:

![Select Manual](https://assets.ubuntu.com/v1/01acc192-01acc19205a26a77cbb96021a47e36f0a3f9eff6.png)

Selecting _Manual_ will allow you to configure your Ethernet connection manually by entering values for your subnet mask value (using CIDR `xx.xx.xx.xx/yy` notation), the static IP address of your device, the network gateway, and the name servers you wish to use:

![Edit eth0 IPv4 configuration](https://assets.ubuntu.com/v1/ad78cf8a-ad78cf8a153e449632f6033c2359e69737039415.png)

Select **Save** to apply those changes and for the connection to be attempted. You can now proceed to the next step by pressing **Done**.

### Add Ubuntu SSO details

This is the final step before completing the Ubuntu Core setup and you simply need to enter the email address linked to your Ubuntu SSH account.

![Add Ubuntu SSO email](https://assets.ubuntu.com/v1/b3a33588-b3a3358817541057242e99b2c65452405b4f0fec.png)

As mentioned earlier,  your account is used to link its registered SSH keys to the new device deployment and allow you to connect without any further device configuration.

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

```bash
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

Congratulations! You have successfully downloaded, installed, and connected to a pre-built Ubuntu Core image on your Renesas RZ/G2L.

See [First steps with Ubuntu Core](/how-to-guides/using-ubuntu-core) for an introduction to using your new Ubuntu Core installation or learn how to [build your Ubuntu Core image](/tutorials/build-your-first-image/index).
