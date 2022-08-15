import { JSDOM } from 'jsdom';
import fs from 'fs';

async function createNewSvg(filename: string, ...parts: HTMLCollection[]): Promise<void> {
    const doc = new JSDOM(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>`);
    const svg = doc.window.document.querySelector("svg") as SVGSVGElement;
    if (!svg) throw new Error("Could not find svg");
    
    parts.forEach(part => {
        console.log(part.length)
        for (let i = 0; i < part.length; i++) {
            svg.appendChild(part.item(i)!);
        }
    })

    fs.writeFileSync(filename, svg.outerHTML);
}

export default createNewSvg