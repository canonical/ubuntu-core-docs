(explanation-preseed-performance)=
# Preseed performance

When Ubuntu Core boots for the first time, a *seeding* process installs an initial set of snaps and runs their respective hooks. Preseeding speeds up the seeding process by performing as many of these administrative tasks as possible in advance when an image is being created. 

The resultant image is called a _preseeded_ image, and a preseeded image is particularly effective on devices with limited network bandwidth.

With a preseeded image, the snap installation and update process is performed as part of the image creation process, before device deployment. This means a device is ready to go from the first boot, rather than requiring the further snap installation and updates that may be required with a non-preseeded image.

For details on how to create a preseeded image, see {ref}`Optimise boot speed <how-to-guides-image-creation-optimise-boot-speed>`.

## Measuring boot performance

The time it takes for a new device to be ready can be measured with the {ref}`ubuntu_core.bootchart <reference-kernel-boot-parameters>` kernel option. When enabled, a performance profile is built for each device boot, allowing you to compare how a non-preseeded image performs against a preseeded image.

The following are real examples of bootchart performance profiles, generated for the same deployment with and without preseeding and initialised over cell data.
## Without preseeding

Without preseeding, a device will need to reboot after the base and system snaps have been updated, and this has a significant impact on the length of time a device takes to become available.H

We can see this in our test deployment, with the generation of two bootcharts for each boot before the system becomes accessible. The total time it takes for those two boots to complete is 71.7 seconds, not including the early boot stages before bootchart starts.

- [First boot](https://assets.ubuntu.com/v1/a03aa582-bootchart-20241126-0011.svg): 22.8 seconds
- [Second boot](https://assets.ubuntu.com/v1/c4e63599-bootchart-20241126-0012.svg): 48.9 seconds
- **Total time before the system becomes accessible: 71.7 seconds**

## With preseeding

Our preseeded system did not need a reboot, and neither did it require any further updates or snap packages. This resulted in the system becoming accessible much faster, and as soon as the first boot had completed:

- [First boot](https://assets.ubuntu.com/v1/84af0f6d-bootchart-20241125-2330.svg): 11.4 seconds
- **Total time before the system becomes accessible: 11.4 seconds**

## Bootcharts

All three bootchart excerpts below show:

- **ping** read from storage utilisation
- **red** write to storage utilisation
- **blue** CPU utilisation
- **yellow** CPU wait time

### Without preseeding

The following shows two separate boots, the first for **22.8 seconds** and the second lasting **48.9 seconds**.

![No preseed Ubuntu Core bootchart](https://assets.ubuntu.com/v1/d632505b-no-preseed-bootchart.png)

### With preseeding

The following shows the only boot required for a preseeded image, lasting **11.4 seconds**.

![Preseeded Ubuntu Core bootchart](https://assets.ubuntu.com/v1/35aabcc9-preseed-bootchart.png)

