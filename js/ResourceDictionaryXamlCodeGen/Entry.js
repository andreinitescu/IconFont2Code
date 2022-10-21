
export default class Entry {
    /**
     * 
     * @param {*} param0 
     */
    constructor({ key, value }) {
        if (typeof key !== 'string' || key.length === 0) {
            throw new Error("key should be a non empty string");
        }

        if (typeof value !== 'string' || value.length === 0) {
            throw new Error("value should be a non empty string");
        }

        this.key = key;
        this.value = value;
    }
} 