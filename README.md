# Ubuntu Core documentation repository

This documentation will walk you through the steps of building and managing
an Ubuntu Core device.

You can find it published on [docs.ubuntu.com/core](http://docs.ubuntu.com/core).

# Building

To begin with building this documentation, first git clone this repository
to a working directory on your local computer.

Next, to be able to build the documentation, you need to install
documentation-builder:

     snap install documentation-builder

Then install the git-repo utility:

    snap install git-repo

From the root of the documentation source tree (e.g. ubuntu-core-docs) do the
following to get the Ubuntu Core Stacks sub-repositories:

     repo init -u https://github.com/canonical-docs/ubuntu-core-docs.git
     repo sync

Then build the documentation via:

     documentation-builder

All of the generated documentation will be placed under build/

# Contributing new or updated documentation

Follow the same steps as the above *Building* section to get a full
working source tree for the Ubuntu Core documentation. Note that the use
of git-repo for managing this source tree means that the core Ubuntu Core
documentation is at the root git repository located on
GitHub while other documentation for Stacks snaps are located in various
sub-repositories, with a typical upstream location on Launchpad. repo init
and sync bring all of these sub-repositories into one working tree as
defined in default.xml, located in the root directory of the
ubuntu-core-docs working tree.

Here is a recommended work flow for contributing documentation changes:

1. If you're changing documentation that is part of the Ubuntu Core
base documentation, then you'll simply want to create a new local branch,
make changes and commit them, followed by pushing your changes up to your
own GitHub project area. Create a new pull request against the master
branch of the Ubuntu Core documentation on GitHub.

2. If you're changing the documentation of one of the Stack snap
sub-repositories, such as [bluez](https://git.launchpad.net/~snappy-hwe-team/snappy-hwe-snaps/+git/bluez)
or [network-manager](https://git.launchpad.net/~snappy-hwe-team/snappy-hwe-snaps/+git/network-manager)
snaps, then you'll want to do a similar thing to step #1 except that you'll
push a merge request up to Launchpad instead of to GitHub. Each of the
Stacks documentation is contained inline in the snap's source directory.

3. If you are contributing a new Stacks sub-repository and want to enable
it to be built when running documentation-builder at the root directory,
then you'll need to add an entry to default.xml located at the root of the
ubuntu-core-docs source tree. You'll add a new entry to make sure
that git-repo pulls the sub-repository down when executing repo sync. This
line would look like the following:

    <project path="en/stacks/network/my-new-stack-snap" name="my-new-stack-snap" />

The location of *my-new-stack-snap* will be placed relative to the root of
your ubuntu-core-docs source directory.

It's recommended that you push a copy to your own GitHub repository with
your changes to ubuntu-core-docs and use a custom repo init line
for testing purposes like so:

    repo init -u https://github.com/your_username/ubuntu-core-docs.git

This will allow you to be able to build the complete ubuntu-core-docs
documentation source along with your new Stacks snap documentation. Just
like above, the output will be placed in the build/ directory.
