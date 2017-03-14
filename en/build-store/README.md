# brand-store-doc

Initial layout and content for the snap brand store documentation.

## Build

To build this project you need to install the `documentation-builder` snap:

    $ snap install documentation-builder

And run it at the root of the project:

    $ cd brand-store-doc
    $ documentation-builder

This will create a `build` directory containing an `index.html` file you can open in your browser:

    $ xdg-open build/index.html
