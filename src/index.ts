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

async function handleCreate({i,o}: yargs.ArgumentsCamelCase) {
    const input = String(i)
    const output = String(o)


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
        
        const { variables, elements } = JSON.parse(file) as TInput;
    
        let loadedSvgs = Promise.all(elements.map(async el => {
            const spinner = createSpinner(`Loading ${chalk.yellow(el + ".svg")}`)
            try {
                const svg = await loadSvg(path.join(__dirname, "..", "elements", el + ".svg"))
                spinner.success({ text: `Loaded ${chalk.yellow(el + ".svg")}` })
                return svg
            } catch (e) {
                spinner.error({ text: `Could not load ${chalk.redBright(el + ".svg")}` })
                console.log(e)
                process.exit(1)
            }

        }))
    
        const svgSpinner = createSpinner(`Creating new SVG`)
        createNewSvg(output, variables, ...(await loadedSvgs))
        svgSpinner.success({ text: `Created new SVG: ${chalk.green(output)}` })
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
                "Output File": {
                    describe: "The name of the file to create",
                    demandOption: true,
                    type: "string",
                    alias: "o",
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
        .argv
}

run()
