export default class CSharpField {
    /**
     * @param {Object} o
     * @param {string} o.name 
     * @param {any} o.value 
     */
    constructor({name, value}) {
        this.name = name;
        this.value = value;
    }
}