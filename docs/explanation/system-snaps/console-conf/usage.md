# Using console-conf

Ubuntu Core images that include console-conf will start a text-mode application when the
system starts for the first time:

![Press enter to configure](press-enter.png)

After the application starts, we will see a message.

![Initial message](init.png)

Then we will be allowed to configure networking for the device, using any ethernet or wifi devices detected. We also have the possibility of bonding them.

![Connectivity](connectivity.png)

After this, we can add an administrator account to the image. The email needs
to be registered in [Ubuntu](https://login.ubuntu.com).

![email](email.png)

In the final step, console-conf will create a user in the device and pull the ssh keys registered in [Ubuntu](https://login.ubuntu.com/ssh-keys), so we can ssh into the device by using them.

![Successful registration](registered.png)

From that point on, after rebooting we will see the registered user in the display:

![ssh message](ssh.png)
