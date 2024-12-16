(contribute-to-our-docs)=
# How to contribute

Our documentation is a community effort, [published](https://ubuntu.com/core/docs) via the [Discourse](https://www.discourse.org/) forum hosted at [discourse.ubuntu.com](https://discourse.ubuntu.com).

**We warmly welcome community contributions, suggestions, fixes and constructive feedback.**

Feel free to modify any [documentation topic](https://discourse.ubuntu.com/c/ubuntu-core-docs/) with updated or more insightful information. If you [already participate](#heading--new-users) in the snap community, you won't need additional permissions; pages are freely editable within the forum itself. Just click on the _Edit_ button at the bottom of the documentation article forum post:

![Discourse edit button](https://assets.ubuntu.com/v1/4106d751-discourse-edit.png)

The navigational structure, style, and content of our documentation follows the [Diátaxis](https://diataxis.fr/) systematic framework for technical documentation authoring. This splits documentation pages into tutorials, how-to guides, reference material and explanatory text.

Documentation consistency is vital, which is why we're listing some guidelines below, but don't let this formality put you off  - just start writing and editing. If something is inconsistent, we'll fix it.

As [Voltaire](https://en.wikipedia.org/wiki/Voltaire) wrote, "_Perfect is the enemy of good_," and we'd rather have documentation we can fix than non-existent documentation we can't.

- [Open Documentation Academy](#heading--academy)
- [New Discourse users](#heading--new-users)
- [Style and language](#heading--style)
- [Diátaxis](#heading--diataxis)
- [Navigation menu](#heading--navigation)
- [Discourse markdown](#heading--markdown) 
  - [Headings and titles](#heading--headings)
  - [Lists](#heading--lists)
  - [Code blocks](#heading--code)
  - [Inline code](#heading--inline)
  - [Anchors](#heading--anchors)
  - [Notes](#heading--notes)
  - [Comments](#heading--comments)
  - [Foldouts](#heading--foldouts)
  - [Images](#heading--images)

---

<h2 id='heading--academy'>Open Documentation Academy</h2>

Our [Canonical Open Documentation Academy](https://discourse.ubuntu.com/t/about-the-open-documentation-academy/39615/3) is a great way to make your first open source documentation contributions to Ubuntu Core, snap and Snapcraft.

The Academy is an initiative led by the documentation team at Canonical to provide help, advice, mentorship, and dozens of different tasks to get started on, within a friendly and encouraging environment. 

A key aim of this initiative is to help lower the barrier into successful open-source software contribution, by making documentation into the gateway.

But even if you're an expert, we want the Academy to be place to  share knowledge, a place to get involved with new developments, and somewhere you can ask for help on your own projects.

The best way to get started is with our [task list](https://github.com/canonical/open-documentation-academy/issues) . Take a look, bookmark it, and see our [Getting started](https://discourse.ubuntu.com/t/getting-started/42769) guide for next steps.

Get in touch either through the task list, or through one of the following locations:
- Our [discussion forum](https://discourse.ubuntu.com/c/open-documentation-academy) on the Ubuntu Community Hub.
- On [Matrix](https://matrix.to/#/#documentation:ubuntu.com) group for interactive chat.
- And [follow us on Fosstodon](https://fosstodon.org/@CanonicalDocumentation) for the latest updates and events.

If you’d like to ask us questions outside of our public forums, feel free to email us at [docsacademy@canonical.com](mailto:docsacademy@canonical.com).

In addition to the above, we have a weekly **Documentation Office Hours** starting at 16:00 UTC every Friday. Everyone is welcome, and links and comments can be found on the [forum post](https://discourse.ubuntu.com/t/documentation-office-hours/42771).

Finally, subscribe to our [Documentation event calendar](https://calendar.google.com/calendar/u/0?cid=Y19mYTY4YzE5YWEwY2Y4YWE1ZWNkNzMyNjZmNmM0ZDllOTRhNTIwNTNjODc1ZjM2ZmQ3Y2MwNTQ0MzliOTIzZjMzQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20). We’ll expand our Documentation Office Hours schedule and add other events throughout the year.

<h2 id='heading--new-users'> New Discourse users</h2>

Anyone can edit and contribute to our documentation, but you need to spend a little time with our Discourse forum first.

New Discourse users are temporarily limited in their capabilities (called their *Trust Level*) until they’ve read and participated a little in the forum. New users start at Trust Level 0, but at Trust Level 1, they can create and edit documentation freely.

Trust Level 1 is attained by:

* Entering at least 5 topics
* Reading at least 30 posts
* Spending a total of 10 minutes reading posts

Users at Trust Level 1 can:

* Edit wiki posts
* Use all core Discourse functions; all new user restrictions are removed
* Send private messages
* Upload images and attachments
* Flag posts to alert moderators
* Mute other users

<h2 id='heading--style'>Style and language</h2>

One of our biggest challenges is accommodating an audience with a huge variation in experience, from beginners exploring the *snap* command, through snap creators experimenting with _snapcraft.yaml_, to experts harnessing the API and deploying snaps across thousands of IoT devices.

Consequently, we try to:
- pitch the writing and editing appropriately for the subject
- write inclusively and assume very little prior knowledge of the reader 
- link or explain phrases, acronyms and concepts that may be unfamiliar, and if unsure, err on the side of caution

Some general tips:
- use a spell checker
- resist being overly formal
- resist being overly verbose
- verify links and examples

We (mostly) adhere to the [Ubuntu style guide](https://docs.ubuntu.com/styleguide/en). In particular:
- we use British English (en-GB), for example:
  -   the _ise_ suffix in preference to _ize_ (_capitalise_ rather than _capitalize_)
  - _our_ instead of _or_ (as in _colour_ and _color_)
  - license as a verb, licence as a noun
  - catalogue rather than catalog
- dates take the format _1 January 2013_, _1-2 January 2013_ and _1 January - 2 February 2013_

<h2 id='heading--diataxis'>Diátaxis</h2>

Our navigational structure, style, and the content of our documentation follows the [Diátaxis](https://diataxis.fr/) systematic framework for technical documentation authoring. This splits documentation pages into tutorials, how-to guides, reference material and explanatory text:

- **Tutorials** are lessons that accomplish specific tasks through _doing_. They help with familiarity and place users in the safe hands of an instructor.
- **How-to guides** are recipes, showing users how to achieve something, helping them get something done. A _How-to_ has no obligation to teach.
- **Reference** material is descriptive, providing facts about functionality that is isolated from what needs to be done.
- **Explanation** is discussion, helping users gain a deeper or better understanding of Snap and Snapcraft, along with how and why they function as they do.

For further details on our Diátaxis strategy, see [Diátaxis, a new foundation for Canonical documentation](https://ubuntu.com/blog/diataxis-a-new-foundation-for-canonical-documentation).

Improving our documentation and applying the principles of Diátaxis are on-going tasks. There's a lot to do, and we don't want to deter anyone from contributing to our docs. If you don't know whether something should be a tutorial, how-to, reference doc or explanatory text, either ask on the forum or publish what you're thinking. Changes are easy to make, and every contribution helps.

<h2 id='heading--navigation'>Navigation menu</h2>

The navigation menu on the published docs site ([https://ubuntu.com/core/docs](https://ubuntu.com/core/docs)) is generated automatically from a table in that page's forum post ([https://discourse.ubuntu.com/t/ubuntu-core-documentation/19764](https://discourse.ubuntu.com/t/ubuntu-core-documentation/19764)).

Unlike every other page in our documentation, the page hosting the navigation menu cannot be edited. This is because we need to retain some gateway control over which pages are published and where. A small error in the navigation table can completely break the final output and the redirects it contains could break the rendering of other pages too.

If you think something should be added to our navigation, either leave a comment under that page's respective forum post, or the navigation page itself.

The code that creates the navigation and publishes our documentation from Discourse can be found here:
[canonicalwebteam.discourse](https://github.com/canonical/canonicalwebteam.discourse).

<h2 id='heading--markdown'>Discourse Markdown</h2>

Documentation is written in the [Markdown](https://daringfireball.net/projects/markdown/syntax) format [supported by Discourse](https://meta.discourse.org/t/post-format-reference-documentation/19197/2).

Mostly, you don't need to worry about the syntax. You can simply use the style toolbar in the Discourse topic editing window to mark the elements you need.

<h3 id='heading--headings'>Headings and titles</h3>

```markdown
## Subheading within a document
### Subheading of a subheading
```
On `snapcraft.io/docs`, we don't use the top-level heading (`# Heading`) because the topic title in Discourse serves this purpose.

Headings and subheadings need to use _sentence case_, which means the first letter is typically the only one capitalised, unless the title includes names, product names or acronyms.

<h3 id='heading--lists'>Lists</h3>

For a bullet list, use the following syntax:

```markdown
We (mostly) adhere to the Ubuntu style guide, for example:
- we use British English (en-GB):
  - the _ise_ suffix in preference to _ize_ 
```
And for a numbered list, precede each item with `1.` (the numbering then becomes automatic, and it's easier to insert new items):

```markdown
1. This is the first item
1. This is the second
1. This is the third
   1. This is a sublist 
```

Unless a list item is particularly long (which should be avoided) and includes punctuation, don't end the item with a full stop. If one item needs a full stop, add the full stop to other items too.

<h3 id='heading--code'>Code blocks</h3>

Enclose a code block with three backticks and include the *type* of code:

    ```yaml
    name: gimp
    version: '2.10.8'
    summary: GNU Image Manipulation Program
    ```

The most common code types are: `bash`, `yaml`, `json`, and `no-highlight`. The last is like a miscellaneous type. It is often used to display command output.

Also, a little contentiously as it goes against the [style guide](https://docs.ubuntu.com/styleguide/en), we use a command line dollar prompt (`$`) to demarcate input and output in the same code block:

```bash
$ snap version
snap    2.36.1
snapd   2.36.1
series  16
ubuntu  18.04
kernel  4.15.0-39-generic
```

In sympathy with the command line, we replace _$_ with _#_ when running commands from root.

<h3 id='heading--inline'>Inline code</h3>

Use a backtick to mark inline commands and other literals. For instance, to create `$SNAP_DATA`:

```markdown
For instance, to create `$SNAP_DATA`:
```

### Angle brackets and variable names

Angle brackets, `<>`, are typically used to show variables in example commands:

`schema://<user name>:<password>@<address>:<port>/<name>`

Example variable names are acceptable if you judge that the context makes it clear enough:

```bash
# set the working directory
WORKDIR /app
# copy the repository files to it
COPY . /app
```

In tutorials, provide the exact values that you want the user to use:

`docker-compose run web django-admin startproject myapp .`

<h3 id='heading--hyperlinks'>Hyperlinks</h3>

For links to internal files or external URLs, use the following format:

```markdown
[visible text](url)
```

The `visible text` is what will appear in the documentation. The `url` is either the full URL of a link outside of the documentation, or the topic reference without the domain name for a page within the documentation. 

To link to `https://forum.snapcraft.io/t/snapcraft-overview/8940`, for example, you would use the following:

```markdown
For more details, see [Snapcraft overview](/).
```
The Discourse topic identifier, _8940_ in the above example, is optional and can be omitted.

<h3 id='heading--anchors'>Anchors</h3>

Discourse Markdown does not support anchor links to a position *within* the same page or another document.

However, you can use standard HTML within Markdown, which means we can manually add HTML anchor elements that can be linked to.

The [recommended way](https://meta.discourse.org/t/deep-linking-to-headings-anchors/47552) to create anchors is using heading elements with an ID. The ID needs to have `heading--` as a prefix:

```html
<h3 id='heading--myanchor'>Link to me</h3>
```

To create an anchor called `base-snap`, for example, enter the following into your document:

```html
<h3 id='heading--base-snap'>Base snaps</h3>
```

This can now be linked to with the following:

```markdown
/t/snapcraft-overview#base-snap
```

Use HTML sparingly as it can make the raw text difficult to read.

<h3 id='heading--notes'>Notes and admonishments</h3>

Admonishments in Discourse use BBtext markup syntax. Using ````{note}` ... ````` draws a box around the contained text. 

```markdown
[note type="important" status="Info"]

An informative note. This box is dark blue.
```
```

This produces:

[note type="important" status="Info"]

An informative note.
```

You can omit the status header.

```plain
[note type="important"]

A note without a title.
```
```

And its output:

[note type="important"]

A note without a title.
```

The `type` parameter is optional, but recommended:

```plain
```{note}

A note that only uses default settings.
```
```

And its output:

```{note}

A note that only uses default settings.
```


#### Types of ````{note}`

Changing the `type` parameter changes how it is presented to the reader:

- `important` (default)
- `caution`
- `positive`
- `negative`

The below examples are produced using type and status combinations of 'caution/Warning', 'positive/High score', and 'negative/Game over', respectively:

#### Caution

```
```{caution}
Here be dragons.

Uses `caution` type.
```
```

```{caution}
Here be dragons.

Uses `caution` type.
```

#### Positive

```
```{tip}
Great work.

Uses `positive` type.
```
```

```{tip}
Great work.

Uses `positive` type.
```

#### Negative

```
```{warning}
Please try again.

Uses `negative` type.
```
```

```{warning}
Please try again.

Uses `negative` type.
```

Hyperlinks cannot be word-wrapped within admonishments. Doing so will not format the links.

<h3 id='heading--comments'>Comments</h3>

Sometimes it's useful to provide information to documentation editors. For that, add the comment inside a block quote that includes the :construction: icon. These will be excluded from the dedicated documentation web site, but will be visible in the forum when editing. It may look similar to this:

```markdown
[quote]
:construction: **NOTE TO EDITORS** :construction:

This note is not visible in the dedicated documentation site.
[/quote]
```
<h3 id='heading--foldouts'>Foldouts</h3>

When a page contains a lot of extraneous information such as walkthroughs or reference tables, a *foldout* can be used. This will create a collapsed header which, when clicked, will expand to display all the content below it.

Foldout syntax in Discourse uses two sets of square brackets with an open and close details tag that acts as the title in the opening brackets:

```markdown
[details=Manually create a network on a 10.x.x.x subnet]

If you try to run `lxd init` on a system that is connected to a network with a `10.x.x.x` subnet,
then the final step of the Iinit* may fail with the following error:

[/details]
```
The above will appear as follows:

[details=Manually create a network on a 10.x.x.x subnet]

If you try to run `lxd init` on a system that is connected to a network with a
`10.x.x.x` subnet, then the final step of the Iinit* may fail with the following error:

[/details]

<h3 id='heading--images'>Images</h3>

Most of our documentation covers command line tools, editing and developing. However, if relevant, we highly encourage the use of images. An image should be easier to understand than text, reinforce concepts being discussed in the topic, and break the monotony of words following words.

When making images:
- do not crop your images too closely to allow context
- use a resolution high enough to make text legible and work with high-DPI displays
- a wide aspect ratio fits better with the width of the rendered documentation
- save with lossless compression, such as PNG for screenshots (JPG is acceptable for photos)

Images can be simply dragged and dropped into the topic you're editing, or uploaded via the toolbar icon. It can also be helpful to edit the description field of an image link after uploading:

```markdown
![description of image](url)
```

