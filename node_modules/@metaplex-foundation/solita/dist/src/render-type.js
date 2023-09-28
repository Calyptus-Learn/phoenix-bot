"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderType = exports.determineTypeIsFixable = exports.beetVarNameFromTypeName = void 0;
const type_mapper_1 = require("./type-mapper");
const types_1 = require("./types");
const assert_1 = require("assert");
const serdes_1 = require("./serdes");
const render_enums_1 = require("./render-enums");
const render_data_enum_1 = require("./render-data-enum");
function beetVarNameFromTypeName(ty) {
    const camelTyName = ty.charAt(0).toLowerCase().concat(ty.slice(1));
    return `${camelTyName}Beet`;
}
exports.beetVarNameFromTypeName = beetVarNameFromTypeName;
class TypeRenderer {
    constructor(ty, fullFileDir, typeMapper = new type_mapper_1.TypeMapper()) {
        this.ty = ty;
        this.fullFileDir = fullFileDir;
        this.typeMapper = typeMapper;
        // -----------------
        // Rendered Fields
        // -----------------
        this.renderTypeField = (field) => {
            const typescriptType = this.typeMapper.map(field.type, field.name);
            return `${field.name}: ${typescriptType}`;
        };
        this.upperCamelTyName = ty.name
            .charAt(0)
            .toUpperCase()
            .concat(ty.name.slice(1));
        this.camelTyName = ty.name.charAt(0).toLowerCase().concat(ty.name.slice(1));
        this.beetArgName = beetVarNameFromTypeName(ty.name);
    }
    renderTypeScriptType() {
        if ((0, types_1.isIdlTypeDataEnum)(this.ty.type)) {
            return (0, render_data_enum_1.renderDataEnumRecord)(this.typeMapper, this.ty.name, this.ty.type.variants);
        }
        if ((0, types_1.isIdlTypeEnum)(this.ty.type)) {
            return (0, render_enums_1.renderScalarEnum)(this.ty.name, this.ty.type.variants.map((x) => x.name), true);
        }
        if (this.ty.type.fields.length === 0)
            return '';
        const fields = this.ty.type.fields
            .map((field) => this.renderTypeField(field))
            .join(',\n  ');
        const code = `export type ${this.upperCamelTyName} = {
  ${fields}
}`;
        return code;
    }
    // -----------------
    // Imports
    // -----------------
    renderImports() {
        const imports = this.typeMapper.importsUsed(this.fullFileDir, new Set([types_1.BEET_PACKAGE]));
        return imports.join('\n');
    }
    // -----------------
    // Data Struct/Enum
    // -----------------
    renderDataStructOrEnum() {
        if ((0, types_1.isIdlTypeDataEnum)(this.ty.type)) {
            return (0, render_data_enum_1.renderTypeDataEnumBeet)({
                typeMapper: this.typeMapper,
                dataEnum: this.ty.type,
                beetVarName: this.beetArgName,
                typeName: this.upperCamelTyName,
            });
        }
        if ((0, types_1.isIdlTypeEnum)(this.ty.type)) {
            const serde = this.typeMapper.mapSerde(this.ty.type, this.ty.name);
            const enumTy = this.typeMapper.map(this.ty.type, this.ty.name);
            this.typeMapper.serdePackagesUsed.add(types_1.BEET_PACKAGE);
            const exp = (0, serdes_1.serdePackageExportName)(types_1.BEET_PACKAGE);
            // Need the cast here since otherwise type is assumed to be
            // FixedSizeBeet<typeof ${enumTy}, typeof ${enumTy}> which is incorrect
            return `export const ${this.beetArgName} = ${serde} as ${exp}.FixedSizeBeet<${enumTy}, ${enumTy}>`;
        }
        const mappedFields = this.typeMapper.mapSerdeFields(this.ty.type.fields);
        const rendered = (0, serdes_1.renderTypeDataStruct)({
            fields: mappedFields,
            beetVarName: this.beetArgName,
            typeName: this.upperCamelTyName,
            isFixable: this.typeMapper.usedFixableSerde,
        });
        return `export ${rendered}`;
    }
    renderDataStructs() {
        const kind = this.ty.type.kind;
        (0, assert_1.strict)(kind === 'struct' || kind === 'enum', `only user defined structs or enums are supported, ${this.ty.name} is of type ${this.ty.type.kind}`);
        const typeScriptType = this.renderTypeScriptType();
        const dataStruct = this.renderDataStructOrEnum();
        return { typeScriptType, dataStruct };
    }
    /**
     * Performs parts of the render process that is necessary to determine if the
     * type is fixed or fixable.
     */
    determineIsFixable() {
        this.typeMapper.clearUsages();
        this.renderDataStructs();
        return this.typeMapper.usedFixableSerde;
    }
    render() {
        this.typeMapper.clearUsages();
        const { typeScriptType, dataStruct } = this.renderDataStructs();
        const imports = this.renderImports();
        return `
${imports}
${typeScriptType}

/**
 * @category userTypes
 * @category generated
 */
${dataStruct}
`.trim();
    }
}
/**
 * Performs parts of the render process that is necessary to determine if the
 * type is fixed or fixable.
 */
function determineTypeIsFixable(ty, fullFileDir, accountFilesByType, customFilesByType) {
    const typeMapper = new type_mapper_1.TypeMapper(accountFilesByType, customFilesByType);
    const renderer = new TypeRenderer(ty, fullFileDir, typeMapper);
    return renderer.determineIsFixable();
}
exports.determineTypeIsFixable = determineTypeIsFixable;
function renderType(ty, fullFileDir, accountFilesByType, customFilesByType, typeAliases, forceFixable) {
    const typeMapper = new type_mapper_1.TypeMapper(accountFilesByType, customFilesByType, typeAliases, forceFixable);
    const renderer = new TypeRenderer(ty, fullFileDir, typeMapper);
    const code = renderer.render();
    const isFixable = renderer.typeMapper.usedFixableSerde;
    return { code, isFixable };
}
exports.renderType = renderType;
//# sourceMappingURL=render-type.js.map