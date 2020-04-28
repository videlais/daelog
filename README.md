# Daelog

- [Daelog](#daelog)
  - [Installing](#installing)
  - [Using Daelog](#using-daelog)
  - [`<character>` Element](#character-element)
  - [Link Syntax](#link-syntax)
  - [Building](#building)

This is an *experimental* story format for Twine 2. It mostly works, but it is *very* beta.

## Installing

Open Twine 2. Click on Formats from the Sidebar. Go to "Add a new Format"

Copy and paste the following URL:

`URL`

Create a new story. From the Story Menu, go to "Change Story Format". Select Daelog.

## Using Daelog

Internally, Daelog uses [Tracery](https://www.tracery.io/) based on passage tags. If a passage has the tag `tracery`, its contents are split by new-lines into a grammar.

These can then be flattened through either:

1) Using Character Elements
2) Using `#passageName#` where the passage name matches one with a tag of `tracery`.

## `<character>` Element

This story format looks for and parses a special HTML5 element of `<character>`. If it has an attribute of `name`, this is used to flatten an existing grammar matching the exact string.

For example, if there were the following two passages --

```twee
:: David [tracery]
"Hi!"
"Hey!"

:: Start
<character name="David" />
```

-- when played, the Start passage would show either "Hi!" or "Hey!" as pulled from the passage named "David".

If a `<character>` element has the attribute of `name` and that value is "me", Daelog parses its contents to create links or restore HTML from the Twine storage.

## Link Syntax

Daelog supports the standard link syntax of Twine 2. Pipe and routing links work.

## Building

Download or clone the code.

Run `npm install`

Run `npm run start`. This will run the linter, compile the files, and then process them with Browsify + Babel.

A new `format.js` will be generated in the `dist/` directory.

**Note:** To test locally, download the desktop version of Twine and use the `file://` protocol to load local versions. Be sure to delete the current version each time, too! Twine 2 does not allow story formats with the same version to be loaded at the same time.
