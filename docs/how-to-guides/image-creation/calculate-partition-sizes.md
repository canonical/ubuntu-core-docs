(how-to-guides-image-creation-calculate-partition-sizes)=
# Calculate partition sizes

The partitions within Ubuntu Core's [Storage layout](/explanation/core-elements/storage-layout) are defined within the _gadget.yaml_ of the [Gadget snap](/reference/gadget-snap-format). The size of each partition can be customised for a particular device and deployment. The process for doing this, and estimating partition sizes, is described below.

See [Building a gadget snap](/how-to-guides/image-creation/build-a-gadget-snap) for details on how a gadget snap can be built. 

## Size ranges

The gadget defines valid size ranges with two parameters:

* `min-size` is the lower bound for the size
* `size` is the upper bound. Currently, it is also the default size applied on UC auto-installations and for partitions created by [ubuntu-image](/how-to-guides/image-creation/use-ubuntu-image)

The recommended sizes for each partition type and role are as follows:

* _system-seed_: This partition contains the configuration for the first-stage recovery boot loader alongside at least one recovery system. A recovery system is a set of snaps (base, kernel, gadget and application snaps), together with model and snap assertions, from which a device can be recovered or reinstalled. Additionally, it contains boot-related bits, of negligible size when compared with the seed’s one.

  If [remodelling](/) is to be used, this partition needs to store additional recovery systems that are created when doing a remodel. This requires, as a minimum, twice the size of the seed, which in turn depends on the snaps that have been included in the model assertion.

  It will be possible to carefully remove older recovery systems after a remodel, which means there is no need for more space than 2 recovery systems.

* _system-boot_: This partition contains the kernel image files (kernel.efi / kernel.img) for each kernel revision in the system. In addition, this partition requires the space for an additional kernel that is temporarily stored when refreshing the kernel snap.

  For example, the size of kernel.efi is around 52 MiBs. If we take a [refresh.retain=3](https://snapcraft.io/docs/managing-updates#control-updates-with-system-options-5) (the default for Ubuntu Core, and for classic/hybrid it is 2) and 10 MiBs for additional boot components, such as grub and u-boot, this would give a minimum size of around:

  52*4 + 10 = 418 MiBs

- Here, the multiplication of the kernel.efi by 4 is due to the requirement of 3 snap files due to the specified refresh.retain, plus 1 for a temporary file while doing a refresh.

   Therefore the minimum system-boot required is:


   *system_boot*  = (*refresh.retain* + 1)*_kernel.efi_ or _.img_ +10


* _system-save_: This partition stores device identity backup data and data to facilitate recovery or re-install. The size it needs depends on how much information our snaps need to store there. A minimum of 32 MiBs is needed for encryption to work.
* _system-data_: This is the writable partition, and contains the snap files installed in the system and snaps data.

### Minimum size calculation

*Min_Size* = *system_seed* + *system_save* + *system_boot* + (*refresh.retain*+ 1)* &Sigma; *snap_size_i*

Where:

* *system_seed* is the initial seed size
* *system_save* is the minimum 32 MiBs required
* *system_boot* is (refresh.retain+1)kernel.ef or .img + 10
* &Sigma;  *snap_size_i* is the sum of all snaps installed in the system, including customer snaps, snapd, kernel and gadget. We add one to the refresh.retain, because all snaps will need temporary space while installing a new snap.

With a `refresh.retain` of 3, a bare minimum of 2GiB (~4 seeds) would be needed, but usually more is expected as the snaps have their own data.

## How to calculate your Ubuntu Core minimum sizes

The following table presents minimum sizes for current and future Ubuntu C releases. For future releases, the metrics are approximations and may change. 

| System | base (MiBs) | \*kernel (MiBs) | \*gadget (MiBs) | snapd (MiBs) | \*kernel.efi (MiBs) |
| ------ | ----------- | --------------- | --------------- | ------------ | ------------------- |
| UC20   | 64          | 379             | 2               | 41           | 40                  |
| UC22   | 75          | 335             | 3               | 41           | 49                  |
| UC24   | ~70         | ~343            | ~3              | ~36          | ~50                 |
| UC26   | Unknown     | Unknown         | ~3              | ~36          | ~50                 |


To calculate the minimal size for an Ubuntu Core image, we apply:
 
*Min_Size* = *system_seed* + *system_save* + *system_boot* + 4* &Sigma;  *snap_size_i*

For example, let’s calculate the bare minimum storage for Ubuntu Core 24 using a refresh.retain of 2, the parameters from the table above and no additional snap. The values for system_seed and system_save are bare minimum requirements. 
 
- *system_seed*= 457 MiB
- *system_save* = 32 MiB
- *system_boot* = (*refresh.retain*+1) * *kernel.efi* + 10 = 160 MiB
-  &Sigma; *snap_size_i*  = *base_snap* + *kernel_snap* + *gadget_snap* + *snapd_snap* + *other_snaps*   
      = 75 + 343 + 3 + 40 + 0 =4 61 MiB 

Replacing these values we get: 

- *Min_Size* = *system_seed* + *system_save* + *system_boot* + 4*  &Sigma;  *snap_size_i*
- *Min_Size* = 457 + 32 + 160+ 4*461 =2493 MiB


Again, this is not considering any additional application snap and it will represent the bare minimum size.

