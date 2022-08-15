import createNewSvg from "./createNewSvg";
import loadSvg from "./loadSvgParts";

async function run() {
    createNewSvg("output.svg",
        // await loadSvg("../elements/sun.svg"),
        // await loadSvg("../elements/rain.svg"),
        await loadSvg("../elements/charger.svg")
    )
}

run()
