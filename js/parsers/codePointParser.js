export function parseGlyphMappingsFromCodePointsFile(fileContent) {
    let mappings = {};

    return new Promise((resolve, reject) => {
        const regex = /(?<name>\w+) (?<code>\w+)/gm;

        let m;
        while ((m = regex.exec(fileContent)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            const code = parseInt(m.groups.code, 16);
            mappings[code] = m.groups.name;
        }

        resolve(getGlyphNameByCode.bind(null, mappings));
    });
}

function getGlyphNameByCode(mappings, unicode) {
    return mappings[unicode];
}
