# Install a pre-build Ubuntu Core image on a MediaTek Genio Device

Pre-built images are ideal for exploration and experimentation of Ubuntu Core, but they are not intended for deployment or use at scale. They include snaps to provide an onboarding and evaluation experience, alongside an SSH connection, and these are unlikely to be required in your own Ubuntu Core deployment.

You can find more information about building Core images in the [Build your first image](/tutorials/build-your-first-image/index) tutorial.

Ubuntu Core runs on a large range of hardware, and pre-built images are available for the [MediaTek Genio](https://www.mediatek.com/products/iot/genio-iot). The following steps will install such an image onto a MediaTek Genio device.

## Requirements

In addition to having a basic understanding of Linux, including running commands from the terminal, you will need the following:

To write an image:
- [Ubuntu 24.04 LTS](https://releases.ubuntu.com/24.04/) or later installed
- Internet connectivity
- 10GB of free storage space
- A microUSB cable for UART
- Another microUSB cable to connect the flash interface
  - You need a USB Type-C cable if your device is MediaTek Genio 1200
- An [Ubuntu SSO account with associated SSH keys](/how-to-guides/manage-ubuntu-core/use-ubuntu-one-ssh).

The target device:
- A [MediaTek Genio](https://www.mediatek.com/products/iot/genio-iot) device
- A 12V AC power adapter (Should be in the EVK package)

A pre-built Ubuntu Core image does not use a username and password to login to the system. It instead uses SSH and your public SSH key, which is uploaded to your Ubuntu One account. This is handled by the console-conf snap bundled in pre-built test images. SSH is otherwise not a requirement for Ubuntu Core images. See Connect to Ubuntu Core with SSH for further details.

## Prepare genio-tools
   
[Genio tools](https://gitlab.com/mediatek/aiot/bsp/genio-tools) are a set of tools to flash, control or configure MediaTek boards, and in particular, Genio evaluation kits. Genio tools can be installed as follows:

Install genio-tool from the snap:

```
sudo snap install genio-tools
```

Enable udev rules:

```
eval "$(snap run genio-tools.udev-script)"
```

```{admonition} New group permissions
You may need to log out and log in as the current user to gain the new group permissions.
```

## Ubuntu Core image

Download the MediaTek Genio Ubuntu Core image from the following location:</br>

[genio-core-22-20250423-201.tar.xz](https://people.canonical.com/~platform/images/mediatek/ubuntu-core-22/genio-core-22-20250423-201.tar.xz)

## Boot firmware

Boot firmware is a series of files used to boot the operating system. Choose your firmware according to your device model:

   |Device Model|Link|
   |---|---|
   |Genio 1200 EVK|[ubuntu-boot-firmware-genio-1200-evk-v24.1-ubuntu1.tar.gz](https://download.mediatek.com/iot/download/ubuntu/boot-firmware/v24.1/ubuntu-boot-firmware-genio-1200-evk-v24.1-ubuntu1.tar.gz)|
   |Genio 700 EVK|[ubuntu-boot-firmware-genio-700-evk-v24.1-ubuntu1.tar.gz](https://download.mediatek.com/iot/download/ubuntu/boot-firmware/v24.1/ubuntu-boot-firmware-genio-700-evk-v24.1-ubuntu1.tar.gz)|
   |Genio 510 EVK|[ubuntu-boot-firmware-genio-510-evk-v24.1-ubuntu1.tar.gz](https://download.mediatek.com/iot/download/ubuntu/boot-firmware/v24.1/ubuntu-boot-firmware-genio-510-evk-v24.1-ubuntu1.tar.gz)|
   |Genio 350 EVK|[ubuntu-boot-firmware-genio-350-evk-v24.1-ubuntu1.tar.gz](https://download.mediatek.com/iot/download/ubuntu/boot-firmware/v24.1/ubuntu-boot-firmware-genio-350-evk-v24.1-ubuntu1.tar.gz)|

Extract all the files from the download archive, replacing the archive name (ubuntu-boot-firmware-genio-1200-evk-v24.1-ubuntu1.tar.gz) with the name of the file you specifically downloaded:

```bash
tar -xf genio-core-22-20250423-201.tar.xz
tar -xf ubuntu-boot-firmware-genio-1200-evk-v24.1-ubuntu1.tar.gz --strip-components=1 -C genio-core-22-20250423-201
```

The archive will include the following files:

```
$ ls -l genio-core-22-20250423-201
total 522696
-rw-rw-r-- 1 ubuntu ubuntu    239360 Apr  8 02:24 bl2.img
-rw-rw-r-- 1 ubuntu ubuntu  33554432 Apr  8 02:24 bootassets.vfat
-rw-rw-r-- 1 ubuntu ubuntu   1929720 Apr  8 02:24 fip.bin
-rw-r--r-- 1 ubuntu ubuntu  33554432 Apr 23 09:55 firmware.vfat
-rw-rw-r-- 1 ubuntu ubuntu    264360 Apr  8 02:24 lk.bin
-rw-rw-r-- 1 ubuntu ubuntu      3261 Apr  8 02:24 snapshot.xml
-rw-rw-r-- 1 ubuntu ubuntu      3358 Apr  8 02:24 u-boot-initial-env
-rw-r--r-- 1 ubuntu ubuntu 465672276 Apr 23 09:56 ubuntu.img
-rw-r--r-- 1 ubuntu ubuntu      1031 Apr 23 09:48 ubuntu.json
```

## Flash the system image

Run the following command to flash the system image:

```bash
genio-tools.genio-flash -e ethaddr="02:00:00:12:34:56"
```

```{attention}
02:00:00:12:34:56 is just an example MAC address. If this is only for testing, you may replace the digits in the '12:34:56' portion with random hexadecimal digits. Please note that devices with identical MAC addresses on the same network will be unable to access the network properly.
 ```

Wait until you see the following output from genio-tools:

```
 Genio Tools: v1.6.2
 Ubuntu Image:
         edition:  Ubuntu classic/core images
         version:  22.04
         codename: jammy
 
 ...
 You can now manually reset the board into DOWNLOAD mode.
 
 INFO:root:Continue flashing...
 ```

Now connect the USB Type-C cable between your host and the USB Type-C port labelled  _Image Download_ port on your device. Refer to the following images to locate the port:

 ````{tabs}

 ```{tab} Genio 1200 EVK

 ![Genio_1200_EVK ports](https://assets.ubuntu.com/v1/f51f8293-hw_evk_g1200-evk_ports.png)
 ```

 ```{tab} Genio 700 EVK

 ![Genio_700_EVK ports](https://assets.ubuntu.com/v1/f708e209-hw_evk_g700-evk_ports.png)
 ```

 ```{tab} Genio 510 EVK

 ![Genio_700_EVK ports](https://assets.ubuntu.com/v1/f708e209-hw_evk_g700-evk_ports.png)
 ```

 ```{tab} Genio 350 EVK

 ![Genio_350_EVK ports](https://assets.ubuntu.com/v1/d227da4c-hw_evk_g350-evk_ports.png)
 ```
 ````

Next, hold the **Download** button on the device and press **Reset**.

Wait until you see the following output from genio-tool before releasing the **Download** button:

      
```text
Looking for MediaTek SoC matching USB device 0e8d:0003
Opening /dev/ttyACM0 using baudrate=115200
Connected to MediaTek SoC: hw_code[0x8195]
Sending bootstrap to address: 0x201000
Jumping to bootstrap at address 0x201000 in AArch64 mode
erasing mmc0
< waiting for any device >
Erasing 'mmc0'
```

The device will now start flashing the Ubuntu Core image. When this completes, genio-tools will output the following and exit:
    
```text
...
Finished. Total time: 2.449s
Rebooting                                          OKAY [  0.002s]
Finished. Total time: 0.252s
```

## Boot Ubuntu Core for the first time

With the image flashed, connect the USB cable to the UART0 port of the device. This will create a new `ttyUSB*` device under the `/dev/` directory on your host system, such as `/dev/ttyUSB0`, which can be used to open a serial connection to your Genio.

The baud rate for the serial connection is 921600, and you can use your preferred serial console client to communicate with the new `ttyUSB*` device. For example, 

```bash
tio -b 921600 /dev/ttyUSB0
```

You might see typical Linux output on the screen, periods where there's just a flashing cursor, and messages like _Installing the system, please wait for a reboot_.  When this process has finished, you will see the following:

`Press enter to configure.`

Press **Enter**.

```{admonition} Missing messages
If after a few seconds you see no message in your serial console, it may be because the system has already finished booting. You can just press Enter.
```

And then you will see a prompt that reads:

```text
Ubuntu Core
Configure the network and setup an administrator account on this all-snap
Ubuntu Core system.
```

Press **Enter** again and you will be taken to the network setup page:

![Network connections](https://assets.ubuntu.com/v1/6946deb8-network-setup.png)

## Configure a network connection

Network access is a requirement for Ubuntu Core, at least initially, and you have a choice about whether to use a wired connection (Ethernet) or Wi-Fi.

### Ethernet

If an Ethernet cable is connected to your device, a network connection will attempt to be automatically negotiated and, if this is successful, you will see an IP address for the device after the DHCPv4 entry in the _Network connections_ page. In this case, you don't need to do anything further:

![Choose eth0](https://assets.ubuntu.com/v1/bfbccb33-network-setup-ethernet.png)

To configure an Ethernet connection manually, select the eth0 device and select _Edit IPv4_ from the small menu that appears. By default, the network device will be configured to use _Automatic (DHCP)_, which is why the connection attempts to automatically configure itself. Press **Enter** to reveal two further options, _Manual_ and _Disabled_:

![Select Manual](https://assets.ubuntu.com/v1/b0dabd89-ethernet-manual.png)

Selecting _Manual_ will allow you to configure your Ethernet connection manually by entering values for your subnet mask value (using CIDR `xx.xx.xx.xx/yy` notation), the static IP address of your device, the network gateway, and the name servers you wish to use:

![Edit eth0 IPv4 configuration](https://assets.ubuntu.com/v1/e2c285bc-network-setup-manual1.png)

Due to the size limitation of the serial console, not all information is shown on this screen. When you have finished entering the Gateway information, you need to press the Down key to continue entering the "Name Servers" and optional "Search domain" information.

![Edit eth0 IPv4 configuration Screen 2](https://assets.ubuntu.com/v1/427880ee-network-setup-manual2.png)

Select **Save** to apply those changes and for the connection to be attempted. You can now proceed to the next step by pressing **Done**.

### Wi-Fi

![Choose wlan0](https://assets.ubuntu.com/v1/3765991b-3765991b629df12859941fe22c7c2fa90a693289.png)

To configure Wi-Fi, press the cursor up key until the wireless device (such as _wlan0_) is selected and press **Enter**. You will see a small menu and you need to select **Edit Wi-Fi**.

![Edit Wi-Fi](https://assets.ubuntu.com/v1/f4889452-f4889452487e4f2eb052ad7410d078a8c0bddd06.png)

After selecting _Edit Wi-Fi_, you will see the network interface configuration panel for Wi-Fi. If you know the name of the Wi-Fi network you wish to connect to, it can be entered directly, or cursor down to _Choose a visible network_ and select a network from a list of those that have been detected.

![Enter password](https://assets.ubuntu.com/v1/04bb9874-bf6ddac76e5fdc34bfdcf353e035c4e1d679d5a4_2_690x385.png)

Finally, enter the Wi-Fi password and select **Save** to complete the configuration. You will be returned to the previous menu and your device will attempt to connect to the network. If successful, you will see its IP address to the right of DHCPv4.

![DHCP](https://assets.ubuntu.com/v1/9a7c81a5-9a7c81a5d6b5202dcb8f222649339a761dd40c45.png)

For advanced network configuration, such as setting a static IP address, select the wireless device again, and choose edit IPv4 from the menu.

When you've finished configuring your network settings, select **Done** and press enter on the _Network connections_ page to move on to the final step.

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

```text
$ ssh user@10.0.2.15
The authenticity of host "192.168.1.68 (192.168.1.68)" can't be established.
ED25259 key fingerprint is SHA256:VD5KH7hM5RxQ15mM70zyJvgmg.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.1.68' (ED25259) to the list of known hosts.
[...]
This Ubuntu Core machine is a tiny, transactional edition of Ubuntu,
designed for appliances, firmware and fixed-function VMs.
```

As shown above, the first time you connect to a new device you will be asked to accept its authenticity. You can check the _ECDSA_ key fingerprint against the finger print shown on the screen after a first reboot. ECDSA is the second one listed.

Congratulations! You have successfully downloaded, installed, and connected to a pre-built Ubuntu Core image on your MediaTek Genio.

See [First steps with Ubuntu Core](/how-to-guides/using-ubuntu-core) for an introduction to using your new Ubuntu Core installation or learn how to [build your Ubuntu Core image](/tutorials/build-your-first-image/index).
