"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructionDiscriminator = void 0;
const types_1 = require("./types");
const utils_1 = require("./utils");
class InstructionDiscriminator {
    constructor(ix, fieldName, typeMapper) {
        this.ix = ix;
        this.fieldName = fieldName;
        this.typeMapper = typeMapper;
    }
    renderValue() {
        return (0, types_1.isShankIdlInstruction)(this.ix)
            ? JSON.stringify(this.ix.discriminant.value)
            : JSON.stringify(Array.from((0, utils_1.instructionDiscriminator)(this.ix.name)));
    }
    getField() {
        if ((0, types_1.isShankIdlInstruction)(this.ix)) {
            const ty = this.ix.discriminant.type;
            this.typeMapper.assertBeetSupported(ty, `instruction ${this.ix.name} discriminant field`);
            return { name: this.fieldName, type: ty };
        }
        return (0, utils_1.anchorDiscriminatorField)(this.fieldName);
    }
    renderType() {
        return (0, types_1.isShankIdlInstruction)(this.ix)
            ? this.typeMapper.map(this.ix.discriminant.type, `instruction ${this.ix.name} discriminant type`)
            : (0, utils_1.anchorDiscriminatorType)(this.typeMapper, `instruction ${this.ix.name} discriminant type`);
    }
}
exports.InstructionDiscriminator = InstructionDiscriminator;
//# sourceMappingURL=instruction-discriminator.js.map