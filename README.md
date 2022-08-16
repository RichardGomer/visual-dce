# Visualising DCEs

<img src="https://upload.wikimedia.org/wikipedia/en/3/32/University_of_Southampton_Logo.png" alt="" width="400px" style="margin: 24px 0">

## Introduction

The aim of this project is to explore how we can visualise DCEs (Discrete Choice Experiments) in a way that is more engaging for participants. We hypothesise that this will produce more accurate information and allow for better informed decisions.

## Installation

> This project requires NodeJS and NPM - it's been build and tested with `node 16.16.0` and `npm 8.11.0`.

### Clone this repository

```bash
git clone https://github.com/RichardGomer/visual-dce.git
```

### Install Dependencies and link executable

```bash
cd visual-dce
npm install
sudo npm link
```

> Note: you'll need to restart your terminal for the link to take effect.

## Usage

Running the `dce` command will display the help menu

### Input file format

The input file format takes the following structure:

```json
{
    "elements": ["svgName1", "svgName2", "svgName3"],
    "variables": {
        "VARIABLE_NAME": "Value"
    }
}
```

For each `svgName`, the program expects to find `svgName.svg` in the `elements` directory.

### Variables

Variables are all global, and are used to replace placeholders within SVG content. For example, if we set `"PRICE": "£10"` we can reference it as `{{PRICE}}` in our SVG file.

### Creating an SVG

After creating an input file, you can create an SVG by running:

```bash
dce create -i input.json -o output.svg
```
