import { JSDOM } from 'jsdom';
import fs from 'fs';

async function createNewSvg(filename: string, variables: Record<string, string>, ...parts: HTMLCollection[]): Promise<void> {
    const doc = new JSDOM(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800" height="600" viewBox="0 0 800 600" fill="none"></svg>`);
    const svg = doc.window.document.querySelector("svg") as SVGSVGElement;
    if (!svg) throw new Error("Could not find svg");

    let newInnerHtml = ""
    parts.forEach(part => {
        for (const item of part) {
            newInnerHtml += item.outerHTML;
        }
    })

    svg.innerHTML = populateVariables(newInnerHtml, variables);

    fs.writeFileSync(filename, svg.outerHTML);
}

function populateVariables(innerHTML: string, variables: Record<string, string>) {
    for (const key in variables) {
        innerHTML = innerHTML.replace(new RegExp(`{{${key}}}`, "g"), variables[key]);
    }
    return innerHTML;
}

export default createNewSvg