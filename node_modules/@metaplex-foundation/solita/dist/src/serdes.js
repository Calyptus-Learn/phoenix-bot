"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTypeDataStruct = exports.renderDataStruct = exports.assertKnownSerdePackage = exports.isKnownSerdePackage = exports.serdePackageTypePrefix = exports.extractSerdePackageFromImportStatment = exports.serdePackageExportName = exports.serdePackages = void 0;
const assert_1 = require("assert");
const types_1 = require("./types");
exports.serdePackages = new Map([
    [types_1.BEET_PACKAGE, types_1.BEET_EXPORT_NAME],
    [types_1.BEET_SOLANA_PACKAGE, types_1.BEET_SOLANA_EXPORT_NAME],
    [types_1.SOLANA_WEB3_PACKAGE, types_1.SOLANA_WEB3_EXPORT_NAME],
]);
const packsByLengthDesc = Array.from(exports.serdePackages.keys()).sort((a, b) => a.length > b.length ? -1 : 1);
function serdePackageExportName(pack) {
    if (pack == null)
        return null;
    const exportName = exports.serdePackages.get(pack);
    (0, assert_1.strict)(exportName != null, `Unknown serde package ${pack}`);
    return exportName;
}
exports.serdePackageExportName = serdePackageExportName;
function extractSerdePackageFromImportStatment(importStatement) {
    // Avoiding matching on 'beet' for 'beet-solana' by checking longer keys first
    for (const pack of packsByLengthDesc) {
        const exportName = exports.serdePackages.get(pack);
        if (importStatement.includes(pack)) {
            (0, assert_1.strict)(importStatement.includes(`as ${exportName}`), `${importStatement} should import ${pack} as ${exportName}`);
            return pack;
        }
    }
    return null;
}
exports.extractSerdePackageFromImportStatment = extractSerdePackageFromImportStatment;
function serdePackageTypePrefix(pack) {
    const packExportName = serdePackageExportName(pack);
    return packExportName == null ? '' : `${packExportName}.`;
}
exports.serdePackageTypePrefix = serdePackageTypePrefix;
function isKnownSerdePackage(pack) {
    return (pack === types_1.BEET_PACKAGE ||
        pack === types_1.BEET_SOLANA_PACKAGE ||
        pack === types_1.SOLANA_WEB3_PACKAGE);
}
exports.isKnownSerdePackage = isKnownSerdePackage;
function assertKnownSerdePackage(pack) {
    (0, assert_1.strict)(isKnownSerdePackage(pack), `${pack} is an unknown and thus not yet supported de/serializer package`);
}
exports.assertKnownSerdePackage = assertKnownSerdePackage;
// -----------------
// Rendering processed serdes to struct
// -----------------
function renderField(field, addSeparator = false) {
    const sep = addSeparator ? ',' : '';
    return field == null ? '' : `['${field.name}', ${field.type}]${sep}`;
}
function renderFields(fields) {
    return fields == null || fields.length === 0
        ? ''
        : fields.map((x) => renderField(x)).join(',\n    ');
}
/**
 * Renders DataStruct for Instruction Args and Account Args
 */
function renderDataStruct({ fields, structVarName, className, argsTypename, discriminatorField, discriminatorName, discriminatorType, paddingField, isFixable, }) {
    const fieldDecls = renderFields(fields);
    const discriminatorDecl = renderField(discriminatorField, true);
    discriminatorType = discriminatorType !== null && discriminatorType !== void 0 ? discriminatorType : 'number[]';
    const extraFields = [];
    if (discriminatorName != null) {
        extraFields.push(`${discriminatorName}: ${discriminatorType}`);
    }
    if (paddingField != null) {
        extraFields.push(`${paddingField.name}: number[] /* size: ${paddingField.size} */`);
    }
    let structType = fields.length === 0
        ? `{ ${extraFields.join('\n    ')} }`
        : extraFields.length === 0
            ? argsTypename
            : `${argsTypename} & {
      ${extraFields.join('\n      ')}
  }
`;
    // -----------------
    // Beet Struct (Account)
    // -----------------
    if (className != null) {
        const beetStructType = isFixable ? 'FixableBeetStruct' : 'BeetStruct';
        return `export const ${structVarName} = new ${types_1.BEET_EXPORT_NAME}.${beetStructType}<
    ${className},
    ${structType}
>(
  [
    ${discriminatorDecl}
    ${fieldDecls}
  ],
  ${className}.fromArgs,
  '${className}'
)`;
    }
    else {
        const beetArgsStructType = isFixable
            ? 'FixableBeetArgsStruct'
            : 'BeetArgsStruct';
        // -----------------
        // Beet Args Struct (Instruction)
        // -----------------
        return `export const ${structVarName} = new ${types_1.BEET_EXPORT_NAME}.${beetArgsStructType}<${structType}>(
  [
    ${discriminatorDecl}
    ${fieldDecls}
  ],
  '${argsTypename}'
)`;
    }
}
exports.renderDataStruct = renderDataStruct;
/**
 * Renders DataStruct for user defined types
 */
function renderTypeDataStruct({ fields, beetVarName, typeName, isFixable, }) {
    (0, assert_1.strict)(fields.length > 0, `Rendering struct for ${typeName} should have at least 1 field`);
    const fieldDecls = fields
        .map((f) => {
        return `['${f.name}', ${f.type}]`;
    })
        .join(',\n    ');
    const beetArgsStructType = isFixable
        ? 'FixableBeetArgsStruct'
        : 'BeetArgsStruct';
    // -----------------
    // Beet Args Struct (Instruction)
    // -----------------
    return `const ${beetVarName} = new ${types_1.BEET_EXPORT_NAME}.${beetArgsStructType}<${typeName}>(
  [
    ${fieldDecls}
  ],
  '${typeName}'
)`;
}
exports.renderTypeDataStruct = renderTypeDataStruct;
//# sourceMappingURL=serdes.js.map