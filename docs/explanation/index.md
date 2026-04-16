---
myst:
  html_meta:
    description: Explanations of Ubuntu Core architecture, design, and operational models. Learn how the system works under the hood and why it is designed for IoT, embedded, and cloud deployments.
---

(ref-index_explanation)=
# Explanation

These guides provide the conceptual knowledge you need to understand how Ubuntu Core works. Read these to expand your knowledge of the architecture, operational models, and design decisions that make Ubuntu Core suitable for IoT, embedded, and cloud deployments.

## Architecture and components

Start here to understand the core concepts and architecture of Ubuntu Core. These topics introduce the components, storage model, and snap ecosystem that make Ubuntu Core immutable and transactional.

- {ref}`Core elements <ref-index_core-elements>`

  Storage layout, volume organization, and the essential components of an Ubuntu Core system.

- {ref}`Stores <ref-index_stores>`

  How snap stores work and how Ubuntu Core manages applications through store integration.

- {ref}`System snaps <ref-index_system-snaps>` and {ref}`Docker companion snap <explanation-docker-companion-snap>`

  System-level snaps that provide core functionality for networking and device management, and how to extend Ubuntu Core with containerized workloads.

## Lifecycle

Understand how Ubuntu Core systems evolve over time. These topics cover installation, updates, system recovery, modification, and optimization of running systems.

- {ref}`How installation works <explanation-how-installation-works>` and {ref}`Refresh control <explanation-refresh-control>`

  Understand the deployment process and how updates are managed and controlled to ensure predictable system behavior.

- {ref}`Remodeling <explanation-remodeling>`, {ref}`Recovery modes <explanation-recovery-modes>`, and {ref}`Remodel essential snaps <ref-remodel-essential-snaps_remodel-essential-snaps>`

  Change system properties on running devices, understand recovery capabilities, and manage essential snaps during remodeling.

- {ref}`Preseed performance <explanation-preseed-performance>`

  Optimizing initial system configuration and startup performance at scale.

## Security

Learn how Ubuntu Core maintains security and resilience. These topics explain the confinement model, encryption, and mechanisms for protecting data and maintaining system integrity.

- {ref}`Security and sandboxing <explanation-security-and-sandboxing>`, {ref}`Full disk encryption <explanation-full-disk-encryption>`, and {ref}`CVE remediation <explanation-cve-remediation>`

  Application isolation and permission models, data protection mechanisms, and how vulnerabilities are addressed in Ubuntu Core.


```{toctree}
:hidden:
:titlesonly:
:maxdepth: 2
:glob:

Recovery modes <recovery-modes>
Refresh control <refresh-control>
Remodeling <remodeling>
Remodel essential snaps <remodel-essential-snaps>
How installation works <how-installation-works>
Preseed performance <preseed-performance>
Docker companion snap <docker-companion-snap>
Full disk encryption <full-disk-encryption>
Full disk encryption with OP-TEE <full-disk-encryption-op-tee>
CVE remediation <cve-remediation>
Security and sandboxing <security-and-sandboxing>
Community engagement <community-engagement>
Core elements <core-elements/index>
Stores <stores/index>
System snaps <system-snaps/index>

