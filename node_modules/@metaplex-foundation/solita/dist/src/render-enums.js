"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderScalarEnums = exports.renderScalarEnum = void 0;
function renderScalarEnum(name, variants, includeExport) {
    const exp = includeExport ? 'export ' : '';
    return `
/**
 * @category enums
 * @category generated
 */
${exp}enum ${name} {
  ${variants.join(',\n  ')}    
}`.trim();
}
exports.renderScalarEnum = renderScalarEnum;
function renderScalarEnums(map, includeExport = false) {
    const codes = [];
    for (const [name, variants] of map) {
        codes.push(renderScalarEnum(name, variants, includeExport));
    }
    return codes;
}
exports.renderScalarEnums = renderScalarEnums;
//# sourceMappingURL=render-enums.js.map