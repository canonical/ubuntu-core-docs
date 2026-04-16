---
myst:
  html_meta:
    description: Try pre-built Ubuntu Core images. These tutorials guide you through installing and exploring pre-built images on virtual machines and physical hardware, ideal for evaluating the system and getting familiar with its capabilities.
---

(ref-index_try-pre-built-images)=
# Try pre-built images

These tutorials guide you through installing and exploring pre-built Ubuntu Core images. Pre-built images are the quickest way to evaluate Ubuntu Core without any build configuration or hardware-specific customization.

Pre-built images are ideal for exploration and experimentation, but they are not intended for deployment or use at scale. They include extra snaps for onboarding and evaluation that you'll likely want to remove in production. To learn how to create custom images optimized for your hardware, see {ref}`Build an image <ref-index-build-your-first-image>`.

## Try on a virtual machine

Start by exploring Ubuntu Core in a virtual machine using Multipass. This is the fastest way to get Ubuntu Core running—no dedicated hardware required. You'll have a working system in minutes.

- {ref}`Install on a VM <tutorials-get-started-try-pre-built-images-install-on-a-vm>`

  Run Ubuntu Core locally on Windows, Mac, or Linux using Multipass.

## Install on hardware

Once you're comfortable with Ubuntu Core, install it on physical hardware. Pre-built images are available for Raspberry Pi and amd64 platforms. Choose the installation method that matches your hardware and preference.

- {ref}`Use Raspberry Pi imager <ref-use-raspberry-pi-imager_use-raspberry-pi-imager>`

  Install on Raspberry Pi using the graphical Imager tool.

- {ref}`Use the dd command <tutorials-get-started-try-pre-built-images-install-on-a-device-use-the-dd-command>`

  Write an Ubuntu Core image directly to internal storage using command-line tools.

**What's next:** After exploring pre-built images, see {ref}`Build an image <ref-index-build-your-first-image>` to learn how to create custom images tailored to your specific hardware and application needs.


```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

Install on a VM <install-on-a-vm>
Use Raspberry Pi Imager <use-raspberry-pi-imager>
Use the dd command <use-the-dd-command>
