export default class EnhancedFile {
    constructor(file) {
        if (!(file instanceof File)) {
            throw new Error('file is not an instance of File');
        }

        this._file = file;
    }

    /**
     * @param {string} fileExtension File extension without leading dot
     * @returns {boolean}
     */
    hasExtension(fileExtension) {
        if (typeof fileExtension !== 'string') {
            throw new Error('fileExtension is not an instance of string');
        }

        const fileName = this._file.name.toLowerCase();

        return fileName.endsWith(`.${fileExtension}`);
    }

    /**
     * @param {Array<string>} fileExtensions 
     * @returns {boolean}
     */
    hasSomeExtension(fileExtensions) {
        if (!Array.isArray(fileExtensions)) {
            throw new Error('fileExtensions is not an instance of Array');
        }

        return fileExtensions.some(ext => this.hasExtension(ext));
    }
}