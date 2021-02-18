export default class CSharpFieldName {
    static tryMakeValidName(name) {
        return typeof name === 'string' && name.length > 0 ? CSharpFieldName.makeValidName(name) : name;
    }

    /** @param {string} name */
    static makeValidName(name) {
        if (typeof name !== 'string' || name.length === 0)
            throw new Error("name must be a non-empty string");

        name = removeIllegalChars(name);
        name = removeIllegalStartChars(name);
        name = renameIfKeyword(name);

        return name;
    }
}

// https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/lexical-structure#identifiers
function removeIllegalChars(name) {
    return name.replace(/\./g, "");
}

/** @param {string} name */
function removeIllegalStartChars(name) {
    // Name must start with either a letter or an underscore
    return !name.match('^[a-zA-Z_]') ? `_${name}` : name;
}

function renameIfKeyword(name) {
    const csharpKeywords = ['abstract', 'as', 'base', 'bool', 'break'
        , 'byte', 'case', 'catch', 'char', 'checked'
        , 'class', 'const', 'continue', 'decimal', 'default'
        , 'delegate', 'do', 'double', 'else', 'enum'
        , 'event', 'explicit', 'extern', 'false', 'finally'
        , 'fixed', 'float', 'for', 'foreach', 'goto'
        , 'if', 'implicit', 'in', 'int', 'interface'
        , 'internal', 'is', 'lock', 'long', 'namespace'
        , 'new', 'null', 'object', 'operator', 'out'
        , 'override', 'params', 'private', 'protected', 'public'
        , 'readonly', 'ref', 'return', 'sbyte', 'sealed'
        , 'short', 'sizeof', 'stackalloc', 'static', 'string'
        , 'struct', 'switch', 'this', 'throw', 'true'
        , 'try', 'typeof', 'uint', 'ulong', 'unchecked'
        , 'unsafe', 'ushort', 'using', 'virtual', 'void'
        , 'volatile', 'while'];

    return csharpKeywords.includes(name) ? `_${name}` : name;
}