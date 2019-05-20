import { parseGlyphMappingsFromIconJar } from './parsers/iconJarParser.js';
import { parseGlyphMappingsFromCss } from './parsers/cssGlyphNameParser.js';
import { readFileAsText } from './utils/asyncFileReader.js';
import { KnownMappers, KnownMappingFileTypes } from './mappers.js'

export function isMappingFile(path) {
    return KnownMappingFileTypes.some((ft) => path.endsWith(ft));
}

export function getMapper(font, path) {
    const mapperInforList = KnownMappers.filter((item) => {
        return (item.name === font.name() && 
               (item.uniqueIDPattern === undefined || font.uniqueID().match(item.uniqueIDPattern)) &&
               (item.fileName === undefined || path.endsWith(item.fileName)));
    });

    if (mapperInforList.length <= 0)
        return;

    return new Mapper(mapperInforList[0]);
}

export class Mapper {
    constructor(mappingInfo) {
        this._mappingInfo = mappingInfo;
    }

    get prefix() {
        return this._mappingInfo.prefix;
    }

    async applyNameMapper(font) {
        if (!this._nameMapper)
            this._nameMapper = await getNameMapperFromUrl(this._mappingInfo.mappingUrl);

        if (this._nameMapper)
            applyNameMapper(this._nameMapper, font);
    }
}

export async function getNameMapperFromUrl(mappingUrl) {
    let fileContent;
    try {
        fileContent = await (await fetch(mappingUrl)).text();
    }
    catch (err) {
        return;
    }
    return await getNameMapperFromFileContent(mappingUrl, fileContent);
}


export async function getNameMapperFromFile(file) {
    const fileContent = await readFileAsText(file);
    return await getNameMapperFromFileContent(file.name, fileContent);
}

async function getNameMapperFromFileContent(path, fileContent) {
    if (path.endsWith('.css'))
        return await parseGlyphMappingsFromCss(fileContent);
    else if (path.endsWith('.ijmap'))
        return await parseGlyphMappingsFromIconJar(fileContent);
}

export function applyNameMapper(nameMapper, font) {
    font.glyphs().forEach(g => {
        const name = nameMapper(g.unicode);
        if (name)
            g.name = name;
    });
}