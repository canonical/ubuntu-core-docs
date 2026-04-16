---
myst:
  html_meta:
    description: Complete reference for Ubuntu Core. Technical specifications, formats, and details for building, deploying, and managing Ubuntu Core images and devices.
---

(ref-index_reference)=
# Reference

Look here when you need specific technical details: system requirements and platform support, image format specifications, configuration options, and assertion formats.

## System specifications

Find what you need to know about Ubuntu Core hardware support, testing platforms, and support timelines. This section covers system requirements, compatible hardware, and release information.

- {ref}`System requirements <reference-system-requirements>`

  Minimum specifications and hardware compatibility for running Ubuntu Core.

- {ref}`Testing platforms <reference-testing-platforms>`

  Supported hardware and virtual machines for testing Ubuntu Core images.

- {ref}`Release notes <ref-release-notes_release-notes>`

  Ubuntu Core version history, features, and changes.

## Image construction

Technical specifications for building custom images and defining hardware properties. Includes gadget and kernel snap formats, boot configuration, and model assertions.

- {ref}`Gadget snap format <reference-gadget-snap-format>`

  Schema and structure of the gadget snap that defines hardware-specific properties and layouts.

- {ref}`Kernel boot parameters <reference-kernel-boot-parameters>`

  Boot-time kernel configuration options and their effects on system behavior.

- {ref}`Assertions <ref-index_assertions>`

  Format and structure of cryptographically signed assertions for model definitions, serial numbers, and validation.

```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

System requirements <system-requirements>
Testing platforms <testing-platforms>
Support duration <support-duration>
Release notes <release-notes>
Gadget snap format <gadget-snap-format>
Kernel boot parameters <kernel-boot-parameters>
Assertions <assertions/index>
