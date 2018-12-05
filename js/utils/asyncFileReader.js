export function readFileAsText(file) {
    return readFile(FileReader.prototype.readAsText, file);
}

export function readFileAsArrayBuffer(file) {
    return readFile(FileReader.prototype.readAsArrayBuffer, file);
}

export function readFile(fileReaderMethod, file) {
    const fr = new FileReader();
    return new Promise((resolve, reject) => {
        fr.onload = () => resolve(fr.result);
        fr.onerror = () => {
            fr.abort();
            reject(new DOMException("Problem parsing input file."));
        };
        fileReaderMethod.call(fr, file);
    });
}