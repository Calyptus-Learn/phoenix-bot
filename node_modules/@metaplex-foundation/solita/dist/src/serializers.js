"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSerializers = void 0;
const constants_1 = require("constants");
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
class CustomSerializers {
    constructor(serializers) {
        this.serializers = serializers;
    }
    static create(projectRoot, serializers) {
        const resolvedSerializers = new Map();
        for (const [key, val] of serializers) {
            resolvedSerializers.set(key, path_1.default.resolve(projectRoot, val));
        }
        verifyAccess(resolvedSerializers);
        return new CustomSerializers(resolvedSerializers);
    }
    static get empty() {
        return CustomSerializers.create('', new Map());
    }
    serializerPathFor(typeName, modulePath) {
        const fullPath = this.serializers.get(typeName);
        return fullPath == null ? null : path_1.default.relative(modulePath, fullPath);
    }
    snippetsFor(typeName, modulePath, builtinSerializer) {
        const p = this.serializerPathFor(typeName, modulePath);
        const mdl = (() => {
            if (p == null)
                return null;
            const ext = path_1.default.extname(p);
            return ext.length > 0 ? p.slice(0, -ext.length) : p;
        })();
        const importSnippet = mdl == null ? '' : `import * as customSerializer from '${mdl}';\n`;
        const resolveFunctionsSnippet = mdl == null
            ? ''
            : `
const serializer = customSerializer as unknown as {
  serialize: typeof ${builtinSerializer}.serialize;
  deserialize: typeof ${builtinSerializer}.deserialize;
};

const resolvedSerialize = typeof serializer.serialize === 'function' 
  ? serializer.serialize.bind(serializer)
  : ${builtinSerializer}.serialize.bind(${builtinSerializer});
const resolvedDeserialize = typeof serializer.deserialize === 'function' 
  ? serializer.deserialize.bind(serializer) 
  : ${builtinSerializer}.deserialize.bind(${builtinSerializer});
`.trim();
        return {
            importSnippet,
            resolveFunctionsSnippet,
            serialize: mdl == null ? `${builtinSerializer}.serialize` : 'resolvedSerialize',
            deserialize: mdl == null
                ? `${builtinSerializer}.deserialize`
                : 'resolvedDeserialize',
        };
    }
}
exports.CustomSerializers = CustomSerializers;
function verifyAccess(serializers) {
    const violations = [];
    for (const [key, val] of serializers) {
        if (!(0, utils_1.canAccess)(val, constants_1.R_OK)) {
            violations.push(`Cannot access de/serializer for ${key} resolved to ${val}`);
        }
    }
    if (violations.length > 0) {
        throw new Error(`Encountered issues resolving de/serializers:\n ${violations.join('\n  ')}`);
    }
}
//# sourceMappingURL=serializers.js.map