(how-to-guides-using-ubuntu-core)=
# Using Ubuntu Core

Ubuntu Core and its applications run within a confined and transaction-based environment. This provides the robustness and security that makes Ubuntu Core ideal for embedded device deployment, but it also requires a different approach from classic Ubuntu systems. 

Application management, system configuration and update schedules in Ubuntu Core are managed by *snapd*, the snap packaging daemon. Snap features are explained comprehensively in the [Snap documentation](https://snapcraft.io/docs), while our [Ubuntu Core documentation](https://ubuntu.com/core/docs) handles the elements of the _snap_ ecosystem that are specifically applicable to Ubuntu Core.

```{admonition} Create your own images
:class: tip
While Ubuntu Core is primarily intended for developers to build custom images tailored for their application and targeted hardware, this page is a great place to start after you've just installed [pre-built Ubuntu Core images](/tutorials/try-pre-built-images/index) and want to learn a few of the basic principles quickly.
```

## Quickstart project

A good place to start is with an IoT web-kiosk. These are autonomous devices that typically display a purpose-built website on a screen. They're often left unattended for long period, and need to remain secure and up-to-date without requiring human intervention. 

To create a web-kiosk in Ubuntu Core, you will need an Ubuntu Core device with a connected display. For deployment in the field, you would normally build custom Ubuntu Core image with your desired applications. But since we are using a pre-built image, you need to run the following commands:

```bash
snap install ubuntu-frame 
snap install wpe-webkit-mir-kiosk
snap set wpe-webkit-mir-kiosk url=https://ubuntu.com/core
```

The first command installs [ubuntu-frame](https://snapcraft.io/ubuntu-frame). This provides the graphical display for developers deploying embedded applications with a GUI. The next snap, [wpe-webkit-mir-kiosk](https://snapcraft.io/wpe-webkit-mir-kiosk), installs an open-source web viewer and we use `snap set` to configure this with the web address we'd like to show. 

All of this initial configuration could be done during the image build to control the complete user experience from the first boot. To learn how to create your own custom image, see our [Build an image](/tutorials/build-your-first-image/index) guide.

## Interfaces

The installation speed will depend on your network connection and the speed of your device as various [interfaces](https://snapcraft.io/docs/interfaces) are automatically connected from the snaps to access your system. 

You can see which of these are being used with the `snap connections` command:

```bash
Interface                 Plug                                  Slot                         Notes
content[graphics-core22]  ubuntu-frame:graphics-core22          mesa-core22:graphics-core22  -
content[graphics-core22]  wpe-webkit-mir-kiosk:graphics-core22  mesa-core22:graphics-core22  -
hardware-observe          ubuntu-frame:hardware-observe         :hardware-observe            -
network                   wpe-webkit-mir-kiosk:network          :network                     -
network-bind              ubuntu-frame:network-bind             :network-bind                -
network-bind              wpe-webkit-mir-kiosk:network-bind     :network-bind                -
opengl                    ubuntu-frame:opengl                   :opengl                      -
opengl                    wpe-webkit-mir-kiosk:opengl           :opengl                      -
wayland                   wpe-webkit-mir-kiosk:wayland          ubuntu-frame:wayland         -
```

Each line in the above output describes how an [interface](https://snapcraft.io/docs/supported-interfaces) is used to connect an application to a system resource. This is accomplished through a system of [plugs and slots](https://snapcraft.io/docs/interface-management#heading--slots-plugs) which connect a consumer (plug) to a provider (slot). The [network](https://snapcraft.io/docs/network-interface) interface, for example, connects the system network provider slot (`:network`) to the application consumer plug (`wpe-webkit-mir-kiosk:network`) to provide the web view with network access.

The `snap connect` and `snap disconnect` commands are used to remove and activate an interface connection. To disable and then re-enable network access to `wpe-webkit-mir-kiosk`, for instance, you'd type:

```bash
snap disconnect wpe-webkit-mir-kiosk:network
snap connect wpe-webkit-mir-kiosk:network
```

Press the tab key to auto-complete partially typed connections and other _snap_ arguments.

## Snap management

To see a summary of system changes, such as interface disconnection and re-connection, plus updates, use the `snap changes` command:

```bash
$ snap changes
ID   Status  Spawn               Ready               Summary
7    Done    today at 10:35 UTC  today at 10:35 UTC  Disconnect : from wpe-webkit-mir-kiosk:network
8    Done    today at 10:36 UTC  today at 10:36 UTC  Connect wpe-webkit-mir-kiosk:network to snapd:network

```

You can list which snaps are installed on your Ubuntu Core system with `snap list`:

```bash
$ snap list
Name                  Version         Rev    Tracking       Publisher   Notes
core22                20240111        1125   latest/stable  canonical✓  base
mesa-core22           23.0.4          234    latest/stable  canonical✓  -
pi                    22-2            132    22/stable      canonical✓  gadget
pi-kernel             5.15.0-1050.53  800    22/stable      canonical✓  kernel
snapd                 2.61.2          21185  latest/stable  canonical✓  snapd
ubuntu-frame          130-mir2.16.3   8588   22/stable      canonical✓  -
wpe-webkit-mir-kiosk  2.38.5          104    22/stable      glancr      -
```

The above shows the standard (and initial) set of snaps in a default Ubuntu Core installation alongside those we installed for the above kiosk.

The default state for an Ubuntu Core image, including which snaps it includes, is defined by its [model assertion](/reference/assertions/model). You can view the one being used on the current system with the `snap known model` command, or use `snap known serial` to show the device serial number:

```bash
$ snap known serial
type: serial
authority-id: canonical
brand-id: canonical
model: ubuntu-core-22-pi-arm64
serial: 5764993d-e063-887a-b79c536066ad
[...]
```

For more details on which snaps are included with Ubuntu Core, see [Snaps in Ubuntu Core](/explanation/core-elements/snaps-in-ubuntu-core).

Any snaps you manually install can be removed with the `snap remove` command:

```bash
snap remove wpe-webkit-mir-kiosk
```

## Install a server

Ubuntu Core is also an ideal platform for server applications because it can handle both system and application updates automatically if needed.

To transform your device into a [NextCloud Server](https://nextcloud.com/athome/), for instance, install the [nextcloud](https://snapcraft.io/nextcloud) snap:

```bash
snap install nextcloud
```

Open the IP address of your device in a web browser on the same network and you'll see NextCloud's [Create an admin account](https://docs.nextcloud.com/server/latest/admin_manual/installation/installation_wizard.html) prompt.

![NextCloud admin account creation prompt](https://assets.ubuntu.com/v1/81d2e822-nextcloud.png)

In common with other server applications, NextCloud runs various services in the background. Snapped services like these can be viewed with the `snap services` command:

```bash
$ snap services
Service                               Startup  Current   Notes
nextcloud.apache                      enabled  active    -
nextcloud.logrotate                   enabled  inactive  timer-activated
nextcloud.mysql                       enabled  active    -
nextcloud.nextcloud-cron              enabled  active    -
nextcloud.nextcloud-fixer             enabled  active    -
nextcloud.php-fpm                     enabled  active    -
nextcloud.redis-server                enabled  active    -
nextcloud.renew-certs                 enabled  active    -
ubuntu-frame.daemon                   enabled  active    -
wpe-webkit-mir-kiosk.daemon           enabled  active    -
wpe-webkit-mir-kiosk.restart-watcher  enabled  active    -
```

The `snap stop <service-name>`, `snap start <service-name>` and `snap restart <service-name>` commands can all be used to start and stop services. If a service offers a reload function, usually to reload a configuration file without requiring a full restart, this can be added to `restart` with the `--reload` argument.

Similarly, services can be stopped from starting automatically, and re-enabled, with the `snap disable <service-name>` and `snap enable <service-name>` commands respectively.

For more information on services, take a look at [Services and daemons](https://snapcraft.io/docs/services-and-daemons).

## Next steps

The snap command includes comprehensive help output. To see this, type `snap help` followed by the command. The output will often include additional arguments that can be useful. Autocompletion can also help when tying snap commands, both to complete a command itself, and also to complete the names of snaps or interfaces. Type `snap` followed by a space and then the tab key to see the list of all possible commands, for instance.

For more information on how to work with snaps, including how to make data snapshots, how to install specific revisions, see the [Snap Documentation ](https://snapcraft.io/docs/). 

To learn how to create your own custom image, see our [Build an image](/tutorials/build-your-first-image/index) guide.

