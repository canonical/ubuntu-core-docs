# Bluetooth commands

The purpose of the  *bluez*  snap is to provide the BlueZ Bluetooth stack. Apart from this it contains various tools shipped with BlueZ itself. The following table lists the commands that are provided by the  *bluez*  snap:

|COMMAND|SHORT DESCRIPTION|
| --- | --- |
|bluez|The  *bluetoothd*  Bluetooth daemon|
|obex|The  *obexd*  OBEX daemon|
|bluetoothctl|A command-line interface to the BlueZ|
|obexctl|A command-line interface to the BlueZ for file transfers|
|hciconfig|HCI device configuration utility|
|hcidump|Reads raw HCI data and prints it on screen|
|hciattach|Attach a serial UART to the BT stack as a transport interface|
|hcitool|Tool used to configure Bluetooth connections|
|sdptool|A tool to perform SDP queries on Bluetooth devices|
|btattach|The successor to hciattach since bluez 5.37|
|btmgmt|Tool for management of the bluez daemon|
|btmon|Bluetooth event monitoring|
|meshctl|Used to provision mesh devices|

There is a quick way of checking what a snap provides. To do this you can use the snap scheme for exposing commands which is  *snap_name.command* . To see all the commands provided by the  *bluez*  snap type:
```bash
bluez.<TAB><TAB>
```
The double  **TAB**  indicates that you should hit the tab key twice for bash auto-completion to kick in. Immediately you will see a list of available commands:
```bash
bluez.bluetoothctl bluez.btmon bluez.hcidump bluez.obexctl bluez.btattach bluez.hciattach bluez.hcitool bluez.sdptool bluez.btmgmt bluez.hciconfig bluez.meshctl 
```

## Sending and receiving files

This section describes the required steps to be able to send files over Bluetooth using an Ubuntu Core device. It will focus on the [OBEX Object Push](https://www.bluetooth.org/docman/handlers/downloaddoc.ashx?doc_id=309007&amp;vId=346844) profile which is a standard Bluetooth profile for such a use case.

### Prerequisites

Make sure that:

* The bluez snap is installed.
* Service is up and running.
* Both devices are paired.

Refer to the previous sections in order to learn how to do it.

The files will be sent to the server which is a Bluetooth-enabled device with the Object Push profile enabled. If this is not fulfilled then Ubuntu Core will fail to connect.

The minimal set of the Bluetooth profiles that must be available on the server device is:

| Profile | UUID |
|------------------| ------ |
| GAP Service | 0x1800 |
| GATT Server | 0x1801 |
| OBEX Object Push | 0x1105 |

If you are unsure about which profiles are enabled, then check this using the

*sdptool* utility:

```
% sdptool browse 00:1A:7D:DA:71:0F
Browsing 00:1A:7D:DA:71:0F ...
Service Name: GAP Service
Service RecHandle: 0x10001
Service Class ID List:
 "Generic Access" (0x1800)
Protocol Descriptor List:
 "L2CAP" (0x0100)
   PSM: 31
 "ATT" (0x0007)
   uint16: 0x0001
   uint16: 0x0007
Language Base Attr List:
 code_ISO639: 0x656e
 encoding:    0x6a
 base_offset: 0x100
Service Name: GATT Server
Service RecHandle: 0x10002
Service Class ID List:
 "Generic Attribute" (0x1801)
Protocol Descriptor List:
 "L2CAP" (0x0100)
   PSM: 31
 "ATT" (0x0007)
   uint16: 0x000c
   uint16: 0x000f
Language Base Attr List:
 code_ISO639: 0x656e
 encoding:    0x6a
 base_offset: 0x100
Failed to connect to SDP server on 00:1A:7D:DA:71:0F: Connection refused
Service Name: OBEX Object Push
Service RecHandle: 0x10004
Service Class ID List:
 "OBEX Object Push" (0x1105)
Protocol Descriptor List:
 "L2CAP" (0x0100)
 "RFCOMM" (0x0003)
   Channel: 1
 "OBEX" (0x0008)
Language Base Attr List:
 code_ISO639: 0x656e
 encoding:    0x6a
 base_offset: 0x100
Profile Descriptor List:
 "OBEX Object Push" (0x1105)
   Version: 0x0102
```

### Connect OPP Profile

Make sure that the pairing is successfully completed. You can learn how to do it on the [Pairing page](pairing.md).

Once the pairing is successfully completed, it is time to connect the OBEX Object Push profile. To interact with OBEX, the obexctl tool is used. Open another terminal and type
```
sudo bluez.obexctl
```

You will see output like this:
```
$ sudo obexctl
[NEW] Client /org/bluez/obex
[obex]#
```

This indicates that the OBEX client has been properly initialized and is awaiting interactive commands. The first thing to do is to get it connected to the remote server which is the device that has been paired in the previous step. Type:

```
[obex]# connect 00:25:56:D1:36:6B
```
You will see output like:
```
Attempting to connect to 00:25:56:D1:36:6B
[NEW] Session /org/bluez/obex/client/session4 [default]
[NEW] ObjectPush /org/bluez/obex/client/session4
Connection successful
[00:25:56:D1:36:6B]#
```

The above indicates that the connection has been established. Check the address

of the remote device in the prompt. It is now possible to send files.

### Sending Files

In order to send files use the *send* command while connected to the OBEX Object
Push profile. For sending a file type:
```
[00:25:56:D1:36:6B]# send <path to file>
```

Note that the file you are about to send should be accessible to the snap,

therefore it must be placed in a readable location. For example:

/var/snap/bluez/current.

Also keep in mind that the regular use of the OPP shall be accomplished through the [D-Bus OBEX API](https://github.com/pauloborges/bluez/blob/master/doc/obex-agent-api.txt).

therefore the bluez snap itself does not need access to other snaps data.
Below is example output of sending a file:
```
[00:25:56:D1:36:6B]# send /var/snap/bluez/current/f.txt
Attempting to send /var/snap/bluez/current/f.txt to /org/bluez/obex/client/session5
[NEW] Transfer /org/bluez/obex/client/session5/transfer10
Transfer /org/bluez/obex/client/session5/transfer10
       Status: queued
       Name: f.txt
       Size: 4
       Filename: /var/snap/bluez/current/f.txt
       Session: /org/bluez/obex/client/session5
[CHG] Transfer /org/bluez/obex/client/session5/transfer10 Status: complete
[DEL] Transfer /org/bluez/obex/client/session5/transfer10

```

### Receiving Files

By default there is no way to receive a file using Bluetooth on Ubuntu Core unless the application snap implements the receiving side. This is because the incoming transfer has to be allowed and the obexctl tool does not provide such an agent. It is assumed that the application will implement this. For reference, here is the [OBEX D-Bus Agent API](https://github.com/pauloborges/bluez/blob/master/doc/obex-agent-api.txt) description.

For convenience, there is a bluez-tests snap that packages the

[simple-obex-agent](https://git.kernel.org/cgit/bluetooth/bluez.git/tree/test/simple-obex-agent)

Python script that implements the mentioned API. It can be used to allow incoming file transfers through OBEX. The script itself has small modifications to make it compatible with Ubuntu Core specifics (Ubuntu Core uses the system, not session bus).

This feature has not been yet released, however, it is available in the edge channel for testing.

Install the bluez-tests snap

```
$ sudo snap install --edge bluez-tests
```

When the above operation successfully finishes, you are able to use the simple-obex-agent and experiment with receiving file transfers. Open another shell on the device and start the simple-obex-agent by typing:

```
$ sudo bluez-tests.simple-obex-agent
```

From now on it will listen for incoming OBEX transfers and when such transfers happen, it will prompt for a decision: accept or deny.

Please note that the software in the edge channel is for testing purposes only, therefore, do not hesitate to report any bugs or inconveniences found.

## Accessing gatt services

In this example we want to connect with a LE device and explore its provided GATT services. The used LE device in this example provides a number of vendor specific GATT services but also the standard battery GATT service.

First, connect with the discovered LE device by using the bluetoothctl command

```
$ sudo bluetoothctl
[bluetooth]# connect 5C:31:3E:71:0C:E7
Attempting to connect to 5C:31:3E:71:0C:E7
[CHG] Device 5C:31:3E:71:0C:E7 Connected: yes
Connection successful
```
As soon as BlueZ has discovered which GATT services are available the bluetoothctl utility will print out the following:

```
[CHG] Device 5C:31:3E:71:0C:E7 UUIDs: 00001800-0000-1000-8000-00805f9b34fb
[CHG] Device 5C:31:3E:71:0C:E7 UUIDs: 00001801-0000-1000-8000-00805f9b34fb
[CHG] Device 5C:31:3E:71:0C:E7 UUIDs: 0000180f-0000-1000-8000-00805f9b34fb
[CHG] Device 5C:31:3E:71:0C:E7 UUIDs: 0d271100-f0d4-469d-afd3-605a6ebbdb13
[CHG] Device 5C:31:3E:71:0C:E7 UUIDs: 0d27fa01-f0d4-469d-afd3-605a6ebbdb13
[CHG] Device 5C:31:3E:71:0C:E7 UUIDs: 0d27fa60-f0d4-469d-afd3-605a6ebbdb13
[CHG] Device 5C:31:3E:71:0C:E7 UUIDs: 0d27ffc0-f0d4-469d-afd3-605a6ebbdb13
[NEW] Service /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0010 Vendor specific (Primary)
[NEW] Characteristic /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0010/char0011 Vendor specific
[NEW] Characteristic /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0010/char0013 Vendor specific
[NEW] Characteristic /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0010/char0015 Vendor specific
[NEW] Characteristic /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0010/char0017 Vendor specific
[NEW] Characteristic /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0010/char0019 Vendor specific
[NEW] Characteristic /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0010/char001b Vendor specific
[NEW] Characteristic /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0010/char001d Vendor specific
[NEW] Service /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service001f Vendor specific (Primary)
[NEW] Characteristic /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service001f/char0020 Vendor specific
[NEW] Characteristic /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service001f/char0022 Vendor specific
[NEW] Characteristic /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service001f/char0024 Vendor specific
[NEW] Characteristic /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service001f/char0026 Vendor specific
[NEW] Descriptor /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service001f/char0026/desc0028 Client Characteristic Configuration
[NEW] Service /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0029 Battery Service (Primary)
[NEW] Characteristic /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0029/char002a Battery Level
[NEW] Descriptor /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0029/char002a/desc002c Client Characteristic Configuration
[NEW] Service /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service002d Vendor specific (Primary)
[NEW] Characteristic /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service002d/char002e Vendor specific
[NEW] Descriptor /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service002d/char002e/desc0030 Client Characteristic Configuration
[NEW] Descriptor /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service002d/char002e/desc0031 Characteristic User Description
[NEW] Service /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0032 Vendor specific (Primary)
[NEW] Characteristic /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0032/char0033 Vendor specific
[NEW] Descriptor /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0032/char0033/desc0035 Client Characteristic Configuration
[NEW] Descriptor /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0032/char0033/desc0036 Characteristic User Description
[NEW] Characteristic /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0032/char0037 Vendor specific
[NEW] Descriptor /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0032/char0037/desc0039 Client Characteristic Configuration
[NEW] Descriptor /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0032/char0037/desc003a Characteristic User Description
[NEW] Characteristic /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0032/char003b Vendor specific
[NEW] Descriptor /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0032/char003b/desc003d Client Characteristic Configuration
[NEW] Descriptor /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0032/char003b/desc003e Characteristic User Description
[CHG] Device 5C:31:3E:71:0C:E7 GattServices: /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0010
[CHG] Device 5C:31:3E:71:0C:E7 GattServices: /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service001f
[CHG] Device 5C:31:3E:71:0C:E7 GattServices: /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0029
[CHG] Device 5C:31:3E:71:0C:E7 GattServices: /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service002d
[CHG] Device 5C:31:3E:71:0C:E7 GattServices: /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0032
[CHG] Device 5C:31:3E:71:0C:E7 Name: X4-LIFE Xmarty 2.0
[CHG] Device 5C:31:3E:71:0C:E7 Alias: X4-LIFE Xmarty 2.0
```
It is now possible to select specific characteristics and read their values or, if possible, also write them. This example focuses on the battery level characteristic from the battery GATT service.
```
[5C-31-3E-71-0C-E7]# select-attribute /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0029/char002a
[X4-LIFE Xmarty 2.0:/service0029/char002a]# read
Attempting to read /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0029/char002a
[CHG] Attribute /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0029/char002a Value: 0x49
49
```
It is also possible to receive notifications when the value of a characteristic changes.

```
[X4-LIFE Xmarty 2.0:/service0029/char002a]# notify on
[CHG] Attribute /org/bluez/hci0/dev_5C_31_3E_71_0C_E7/service0029/char002a Notifying: yes
Notify started
```
This will now notify whenever the value of the selected characteristic changes.


