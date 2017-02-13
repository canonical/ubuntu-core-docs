# Ubuntu Core documentation repository

This documentation will walk you through the steps of building and managing an Ubuntu Core device.

You can find it published on [docs.ubuntu.com/core](http://docs.ubuntu.com/core).

# Building

To build the documentation you need to install documentation-builder:

    $ snap install documentation-builder

Then install the git-repo utility:

    $ mkdir $HOME/.bin/
    $ export PATH=$PATH:$HOME/.bin/repo
    $ curl https://storage.googleapis.com/git-repo-downloads/repo > $HOME/.bin/repo
    $ chmod a+x $HOME/.bin/repo

From the root of the documentation source tree do the following to get the Ubuntu
Core Stacks bits:

    $ repo init -u git@github.com:CanonicalLtd/ubuntu-core-docs.git
    $ repo sync
    $ documentation-builder

All of the generated documentation will be under build/
