import createNewSvg from "./createNewSvg";
import loadSvg from "./loadSvgParts";
import { z } from "zod"
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs";
import path from "path";
import {TInput, InputType} from "./InputType";
import { createSpinner } from "nanospinner";
import chalk from "chalk";

async function handleCreate({i,d,p}: yargs.ArgumentsCamelCase) {
    const input = String(i)
    const output = String(d)
    const prefix = String(p)


    const fileSpinner = createSpinner("Attempting to read input file")
    try {
        const file = fs.readFileSync(path.resolve(input), "utf8");
        fileSpinner.update({ text: "Parsing JSON data" })
        try {
            InputType.parse(JSON.parse(file))
        } catch (e) {
            fileSpinner.error({ text: `Could not parse file ${chalk.redBright(input)} - printing additional info below:` })
            console.log(e)
            process.exit(1)
        }
        fileSpinner.success({ text: "Successfully loaded JSON data" })
        
        const arr = JSON.parse(file) as TInput;

        const dirSpinner = createSpinner("Attempting to create output directory")
        try {
            fs.mkdirSync(output)
        } catch (e) {
            if (e.code !== "EEXIST") {
                dirSpinner.error({ text: `Could not create output directory ${chalk.redBright(output)} - printing additional info below:` })
                console.log(e)
                process.exit(1)
            }
        }
        dirSpinner.success({ text: "Successfully created output directory" })

        Promise.all(arr.map(async ({name, variables, elements}, idx) => {
            const spinner = createSpinner(`Building ${name || idx}`)
            let loadedSvgs = await Promise.all(elements.map(async el => {
                spinner.update({text: `Building ${name || idx}: loading ${chalk.yellow(el)}`})
                try {
                    const svg = await loadSvg(path.join(__dirname, "..", "elements", el + ".svg"), variables)
                    return svg
                } catch(e) {
                    spinner.error({text: `Could not load ${chalk.redBright(el)}.svg`})
                    console.log(e)
                    process.exit(1)
                }
            }))

            spinner.update({text: `Building ${name || idx}: Creating output file`})
            await createNewSvg(path.join(output, prefix ? prefix + "-" + (name || idx) + ".svg" : (name || idx) + ".svg"), variables, ...loadedSvgs)
            spinner.success({text: `Building ${name || idx}: Successfully created output file ${chalk.yellow(path.join(output, prefix ? prefix + "-" + (name || idx) + ".svg" : (name || idx) + ".svg"))}`})
        }))
    } catch (e) {
        fileSpinner.error({text: `Could not read input file ${chalk.redBright(input)}`})
        process.exit(1)
    }
}

async function run() {
    const args = yargs(hideBin(process.argv))
        .usage("$0 <command> [options]")
        .command({
            command: "create",
            describe: "Create a new svg file",
            aliases: ["c"],
            builder: {
                "Output Directory": {
                    describe: "The name of the folder to create",
                    demandOption: true,
                    type: "string",
                    alias: "d",
                },
                "File Prefix": {
                    describe: "The prefix for each file",
                    demandOption: false,
                    type: "string",
                    alias: "p"
                },
                "Input File": {
                    describe: "Path to the input file",
                    demandOption: true,
                    type: "string",
                    alias: "i"
                }
            },
            handler: handleCreate
        })
        .demandCommand(1)
        .example("$0 create -i input.json -o output.svg", `Create a new SVG file from input ${chalk.yellow("input.json")} and output it to ${chalk.yellow("output.svg")}`)
        .epilogue(chalk.gray("Produced by the University of Southampton (https://southampton.ac.uk)"))
        .argv
}

run()
