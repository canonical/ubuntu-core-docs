(how-to-guides-image-creation-add-a-splash-screen)=
# Add a splash screen

By default, Ubuntu Core does not display a splash screen when a device is booting or shutting down. However, on Ubuntu Core 22 (and later), a splash screen can be enabled, either to display the built-in Ubuntu Core branding, or to display custom vendor branding or imagery.

![Ubuntu Core Splash](https://assets.ubuntu.com/v1/72b8914b-core-splash_01.png) 

Ubuntu Core’s splash screen is based on Ubuntu’s [Plymouth-based splash screen](https://wiki.ubuntu.com/Plymouth#Splash_Theme) implementation. It’s enabled by adding `quiet splash` as a [kernel boot parameter](/reference/kernel-boot-parameters):

```yaml
quiet splash
```

On Ubuntu Core 22 and later, when using the default GNU GRUB bootloader, kernel boot parameters can be configured either in the [Gadget snap](/reference/gadget-snap-format), or through [system options](https://snapcraft.io/docs/system-options). See [Modifying kernel boot parameters](/how-to-guides/manage-ubuntu-core/modify-kernel-options) for further details on each process.

## Customised splash screen

The splash screen can be customised in two different ways, either by including a new logo or image file, or by completely replacing the Plymouth theme used to generate the splash screen.

### New vendor logo or image

![Ubuntu Core vendor splash screen,  50%](https://assets.ubuntu.com/v1/3410143e-core-splash_02.png) 

A PNG-formatted vendor logo, or any other PNG-formatted image, can be placed within a new `/splash` directory in the root of the [Gadget snap](/reference/gadget-snap-format). The image file must be called `vendor-logo.png`:

```yaml
.
├── cmdline.extra
├── grub.conf
├── grubx64.efi
├── meta
│   ├── gadget.yaml
│   ├── gui
│   ├── hooks
│   │   └── configure
│   └── snap.yaml
├── pc-boot.img
├── pc-core.img
├── shim.efi.signed
├── snap
│   ├── command-chain
│   │   └── snapcraft-runner
│   └── hooks
│       └── configure
└── splash
   └── vendor-logo.png
```

The image will be scaled accordingly and images with a 2:1 aspect ratio work best (such as images with resolution of 800x400). Larger files will obviously increase the size of the gadget snap and the resulting Ubuntu Core image.

### Replacement Plymouth theme

The most flexible way to change the appearance of the Ubuntu Core splash screen is to install a replacement [Plymouth](https://wiki.ubuntu.com/Plymouth) theme.

While Plymouth itself supports a variety of different splash plugins, Ubuntu Core’s implementation only supports its [Scripts](https://gitlab.freedesktop.org/plymouth/plymouth/-/tree/main/themes/script?ref_type=heads) plugin. This is the most flexible plugin as it provides its own feature-rich [scripting language](https://www.freedesktop.org/wiki/Software/Plymouth/Scripts/).  


## Step-by-Step Guide to Creating a Custom Plymouth Theme

For developers new to Plymouth, follow these steps to create and install a custom theme for Ubuntu Core:

### 1. Understand Plymouth Theme Structure

A Plymouth theme consists of:

- A `.plymouth` configuration file (e.g., `vendor.plymouth`) that defines the theme’s metadata and script file.
- A `.script` file (e.g., `vendor.script`) written in Plymouth’s scripting language to control the splash screen’s visuals.
- Optional image or font files for logos, backgrounds, or text.

**Example Resources**: Explore a large collection of Plymouth themes for inspiration at [adi1090x/plymouth-themes](https://github.com/adi1090x/plymouth-themes). These themes, ported from Android boot animations, include examples like `angular` and `colorful_loop` that demonstrate scripting techniques.

### 2. Create the Theme Files

A new theme must be placed within a `/splash/plymouth/themes/vendor` directory in the root of the Gadget snap:

```
$GADGET/splash/plymouth/themes/vendor/
```

Pathnames specified in a custom Plymouth config file need to use the prefix `/run/mnt/gadget/splash/` rather than `/snap/gadget-snap/current/splash/` as the former is mounted in the _initramfs_ before Plymouth is starts, whereas the latter is not.

```
[Plymouth Theme]
Name=Vendor Theme
Description=A custom splash screen for Ubuntu Core
ModuleName=script

[script]
ImageDir=/run/mnt/gadget/splash/plymouth/themes/vendor
ScriptFile=/run/mnt/gadget/splash/plymouth/themes/vendor/vendor.script
```


It can also help to lower the kernel console logging verbosity by specifying `loglevel=3` (or lower) on the kernel command line. See [Customise the kernel command line](/reference/kernel-boot-parameters) for further details.

A good custom Plymouth theme example for Ubuntu Core is its own default theme:
[https://github.com/snapcore/core-splash](https://github.com/snapcore/core-splash)

Note that the configuration file inside the `vendor/` directory must be named `vendor.plymouth`. Configuration inside will point to the script file.

See [Building a gadget snap](/how-to-guides/image-creation/build-a-gadget-snap) for details on how to create a custom gadget snap.

### Troubleshooting

- **Theme not displaying**: Verify the `vendor.plymouth` file points to the correct .script file and that all files are in the `/run/mnt/gadget/splash/plymouth/themes/vendor/` path.


