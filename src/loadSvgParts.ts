import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom'

async function loadSvgParts(filePath: string): Promise<HTMLCollection> {

    const doc = await JSDOM.fromFile(filePath);
    if (!doc) throw new Error(`Could not load ${filePath}`);

    const svg = doc.window.document.querySelector("svg")
    if (!svg) throw new Error(`Could not find svg in ${filePath}`);

    const els = svg.children;
    if (!els) throw new Error(`Could not find any elements in ${filePath}`);

    return els;

}

export default loadSvgParts