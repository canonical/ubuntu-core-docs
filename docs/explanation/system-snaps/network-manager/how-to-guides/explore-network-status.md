(explanation-system-snaps-network-manager-how-to-guides-explore-network-status)=
# Explore network status

This section shows how to use the _nmcli_ command line tool to examine the status of NetworkManager’s connections and devices.

Show the status of devices known to NetworkManager:

```bash
$ nmcli d
nmcli d
DEVICE           TYPE      STATE      CONNECTION         
enp0s31f6        ethernet  connected  Wired connection 1 
docker0          bridge    connected  docker0            
lo               loopback  unmanaged  --                 
```

Add `--help` for more details on a given option.

To show the current status of each of NetworkManager’s connections:

```
$ nmcli c
NAME                UUID                                  TYPE      DEVICE          
Wired connection 1  59b3aab1-f9a8-3bee-8fd2-2497a1dcd99c  ethernet  enp0s31f6       
docker0             b13e1f13-c23c-47c3-9b3e-ca43ecd79e79  bridge    docker0         
```

Finally, we can see the state of radio interfaces, including Wi-Fi and WWAN (cellular) with the _radio_ argument:

```bash
$ nmcli r
WIFI-HW  WIFI     WWAN-HW  WWAN    
enabled  enabled  enabled  enabled 
```

It is important to make sure that Wi-Fi/WWAN radios are enabled so the respective connection types can establish a connection (we will specify how to this in following sections). As with the other commands, “--help” shows usage information.

Observe NetworkManager activity (changes in connectivity state, devices or connection properties):

```bash
nmcli monitor
```

See nmcli connection monitor and nmcli device monitor to watch for changes in certain connections or devices.

