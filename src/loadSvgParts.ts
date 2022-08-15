import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom'

async function loadSvgParts(filename: string): Promise<HTMLCollection> {

    const doc = await JSDOM.fromFile(path.join(__dirname, filename));
    if (!doc) throw new Error(`Could not load ${filename}`);

    const svg = doc.window.document.querySelector("svg")
    if (!svg) throw new Error(`Could not find svg in ${filename}`);

    const els = svg.children;
    if (!els) throw new Error(`Could not find any elements in ${filename}`);

    return els;

}

export default loadSvgParts