---
myst:
  html_meta:
    description: Understand secure device onboarding with hardware-backed identity assertions. Learn how devices establish cryptographic identity during factory provisioning and registration with the model service.
---

(explanation-secure-device-onboarding)=
# Secure device onboarding

Secure device onboarding allows manufacturers and brands to establish and verify a device's identity using cryptography rather than shared secrets. By giving each device its own unique key pair, stored either in hardware (TPM/HSM) or software, this approach replaces traditional API key registration with a method that is both more secure and scalable. Only devices that can cryptographically prove their identity receive a serial assertion from the model service.

## Purpose and rationale

Traditionally, Ubuntu Core's device registration relies on a shared secret (API key) incorporated in an Ubuntu Core image batch during build. As the API key is the same for all devices running that image, if the key is compromised, it becomes possible for other devices to gain access to restricted content.

Secure device onboarding solves this with public-key cryptography. 

- Each device gets a unique hardware identity key pair during manufacturing.
- The public part of this key is registered with the model service as a hardware-identity assertion.
- When registering, the device proves it owns the private key by signing a challenge (nonce) from the model service.
- There's no shared secret to compromise, and each compromised device only affects that device—not the whole batch.

Using this functionality, the model service can verify a device's identity before issuing it with a serial assertion that is subsequently used for any future interaction with remote Canonical services. 

## Key concepts

### Hardware identity key pair

Every device gets two parts to this key pair:

- **Private key**: Stays secure on the device (ideally in a TPM or HSM) and never leaves it.
- **Public key**: Gets extracted and shared with the model service as part of a hardware-identity assertion.

This pair is created early in the device's life and stays with it forever; it is never regenerated, even during remodeling or re-imaging. The private key serves as proof that registration requests come from the real physical hardware. It is only used during the initial registration handshake, not for later communications.

### Device key pair

Along with the hardware identity key pair, each device gets a separate device key pair for day-to-day interactions with the model service:

- snapd generates this during first boot (and can regenerate it during remodeling or re-imaging).
- This key binds the device to its {ref}`serial assertion <reference-assertions-serial>`.
- You can refresh this key at any time without touching the hardware identity key.

This is the key that appears in the serial assertion and handles regular store transactions.

### Hardware-identity assertion

This is a signed document (the {ref}`hardware-identity assertion <reference-assertions-hardware-identity>`) that packages up the hardware's public key along with metadata:

- It holds the public half of the hardware identity key pair.
- It includes manufacturer info, hardware name, and a unique hardware identifier.
- It's signed and issued by the manufacturer or a trusted authority.
- It gets imported into the model service before the device even tries to register.

Once in place, the model service can use it to verify that incoming registration requests are genuinely signed with the device's private key.

## Registration process overview

The whole process happens in stages. It starts in the factory and ends with the device receiving its serial assertion.

### Stage 1: Hardware identity key generation

**When**: During manufacturing or on first boot of a factory image.

**Process**:

1. The device boots with a minimal factory image (or default Ubuntu Core image).
2. snapd invokes the gadget snap's `prepare-device` hook.
3. The gadget snap interfaces with the device's HSM or implements a software-based key generation mechanism.
4. A unique hardware identity key pair is generated and stored securely (preferably in hardware).
5. No information is returned to snapd at this stage; the gadget snap manages the keys internally.

By the end: The device has a hardware identity private key stored securely.

### Stage 2: Hardware-identity assertion export and import

**When**: After hardware identity keys are generated, before device distribution.

**Process**:

1. The device or factory extracts the public portion of the hardware identity key.
2. A hardware-identity assertion is formatted with the public key and signed by the issuer.
3. The assertion is exported from the device and provided to the brand or model service administrator.
4. The brand imports the hardware-identity assertion into the model service via the API or web UI.
5. The model service validates the assertion format and signature.
6. The public key and its SHA3-384 digest are extracted and stored in the model service database.

By the end: The model service now knows about the device's public key and can verify signatures.

### Stage 3: Device seeding and nonce retrieval

**When**: On first boot of the production image (after device reaches the field or is deployed).

**Process**:

1. Device boots and snapd initializes the seeding process.
2. snapd requests a nonce from the model service by calling the `/v1/request-id` endpoint.
3. Model service returns a unique nonce with a 600-second (10-minute) lifespan to prevent replay attacks.

By the end: The device has a fresh nonce that's valid for the next 10 minutes.

### Stage 4: Serial assertion request with cryptographic proof

**When**: During device seeding, after receiving the nonce.

**Process**:

1. snapd invokes the gadget snap's `prepare-serial-request` hook, passing the nonce.
2. The gadget snap retrieves the hardware identity private key from the HSM or software storage.
3. The gadget snap signs the nonce using the hardware identity private key.
4. The gadget snap populates the body of the serial assertion request with:
   - `hardware-id-key-sha3-384`: The SHA3-384 digest of the public key
   - `request-id-signature`: The cryptographic signature of the nonce
5. snapd generates the device key pair and forms the serial assertion request with the populated body.
6. snapd submits the serial assertion request to the model service without requiring an API key.

By the end: The model service gets cryptographic proof that the request is genuine.

### Stage 5: Signature verification and serial assertion issuance

**When**: Model service receives the serial assertion request.

**Process**:

1. Model service checks that the model is configured for hardware-identity based provisioning.
2. Model service looks up the hardware-identity record using the `hardware-id-key-sha3-384` from the request body.
3. Model service verifies the nonce signature using:
   - The stored public key corresponding to the SHA3-384 digest
   - The signature provided in `request-id-signature`
   - The original nonce issued in Stage 3
4. Model service checks that the nonce has not expired (is still within 600 seconds).
5. If all checks pass, model service forms and signs the serial assertion with the device's public key.
6. Serial assertion is returned to the device.

By the end: The device gets its serial assertion and registration is complete.

## Factory process requirements

Your manufacturing process needs to handle these key steps to set up secure onboarding:

### Key provisioning

Each device needs its own unique hardware identity key pair, and these keys need to stay secure. Have a plan for devices where key generation fails.

### Image preparation

You can trigger key generation either with a minimal factory image (via the `prepare-device` hook) or let it happen on first boot of the standard Ubuntu Core image. Either way, if you're using a factory image, add the `--factory-image` flag when building so the system knows it's a factory-only setup. This flag gets cleared once you transition to normal operation.

### Assertion generation and export

Once keys are generated, extract the public key and package it into a hardware-identity assertion with your issuer info, manufacturer details, and a digital signature. Ideally, automate the export of multiple assertions so you can batch import them into the model service.

### Import into model service

The model service API handles bulk imports, so you can upload multiple assertions at once. It's safe to upload the same assertion multiple times—the operation is idempotent. The service validates everything before storing it.

## Gadget snap requirements

Your gadget snap acts as the bridge between snapd and your specific hardware. It handles the security-sensitive operations that need to know about your device:

### Prepare-device hook

This hook sets up the hardware identity key pair during installation. For details on implementation—including how to work with TPMs, HSMs, and detect factory mode—see the [snapd prepare-device hook documentation](https://snapcraft.io/docs/the-prepare-device-hook).

### Prepare-serial-request hook

This hook runs during device registration to sign the nonce with the hardware identity private key, proving the request is genuine. For implementation details and the expected input/output format, see the [snapd prepare-serial-request hook documentation](https://snapcraft.io/docs/the-prepare-serial-request-hook).

## Remodeling considerations

When you remodel a device to a different model:

- The hardware identity key pair is retained and does not regenerate.
- The device key pair **can** be regenerated if needed.
- Both models must use the same provisioning method (both hardware-identity or both api-key).
- You can't remodel between different provisioning types.

This keeps the hardware identity intact as devices move between product lines.

## See also

- {ref}`How installation works <explanation-how-installation-works>` for device provisioning context
- {ref}`Hardware-identity assertion <reference-assertions-hardware-identity>` for assertion format details
- {ref}`Serial assertion <reference-assertions-serial>` for the resulting registration artifact
- {ref}`Gadget snap format <reference-gadget-snap-format>` for hook implementation details
- {ref}`System requirements <reference-system-requirements>` for TPM and hardware prerequisites
