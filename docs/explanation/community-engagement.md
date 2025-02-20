# Community engagement

Ubuntu Core is an open source project hosted by Canonical. We warmly welcome community contributions, suggestions, fixes and constructive feedback.

We're committed to:
* actively encouraging community contributions
* providing support and help to both established and potential contributors
* managing our capacity planning to facilitate community engagement
* creating a welcoming environment to foster community spirit (see [Code of conduct](https://ubuntu.com/community/ethos/code-of-conduct))

## Where to find the project

Ubuntu Core does not have a its own code repository.  It is instead built entirely from [snap packages](/explanation/core-elements/snaps-in-ubuntu-core/) and managed by the snap daemon, snapd. As a result, the source code for the project is split across several locations, alongside any other snap packages that may be installed:

- **[snapd](https://github.com/snapcore/snapd)** is the background service that manages and maintains snaps, and provides the `snap` command line tool.
- **[gadget snaps](https://github.com/search?q=org%3Asnapcore+gadget&type=repositories)** define and configures system properties specific to one or more devices.
- **[kernel snaps](https://github.com/snapcore/sample-kernels)** define the Linux kernel to run on each system.
- **[base snaps](https://snapcraft.io/docs/base-snaps)** provide the run-time environment and a minimal set of libraries.

In addition to the above, our [Documentation](https://ubuntu.com/core/docs) is hosted and built from [https://github.com/canonical/ubuntu-core-docs](https://github.com/canonical/ubuntu-core-docs). See [How to contribute](/contributing.md) for further details.

## Contributions

Project contributions can take many forms. We aim to be responsive and help contributors navigate the project to enable them to get involved, regardless of what avenues may be available to specific projects. This includes:

* Monitoring platforms including Launchpad, GitHub, Discourse, or others for issues, comments, and pull requests.
* Monitoring communication channels, including IRC, Matrix, Discourse, mailing lists, etc.
* Timely responses to questions, suggestions, and requests for help (aiming for 1-4 working days)
* Timely reviews and merging (when appropriate) of submitted contributions

These actions and responsibilities have been incorporated into our regular team processes to ensure responsiveness proportionate to the capacity of the team/project in question. In particular, we have a daily rotation schedule for issue tracking, forum responses and merge proposals.

## Responsibilities

Both documentation and engineering teams agree to shoulder responsibilities implied by this  commitment to target the goals and handle contributions.

### Documentation team

* Identifying suitable docs-related issues in the project and suggesting them to community
* Reviewing contributions for language, style, and formatting
* Providing guidance to community members regarding docs contributions

### Engineering team

* Reviewing contributions for technical correctness and roadmap alignment
* Interacting with community members regarding technical aspects of the project

## Get in touch

You can find the Ubuntu Core team on both the Ubuntu Discourse forum and the Snapcraft forum:
- https://discourse.ubuntu.com/c/ubuntu-core-docs
- https://forum.snapcraft.io/c/snapd

For interactive discussions, the team can also be found on Matrix.org:
- https://matrix.to/#/#documentation:ubuntu.com
