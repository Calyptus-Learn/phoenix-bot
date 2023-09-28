import { TypeMapper } from './type-mapper';
import { IdlInstruction, IdlInstructionArg } from './types';
export declare class InstructionDiscriminator {
    private readonly ix;
    private readonly fieldName;
    private readonly typeMapper;
    constructor(ix: IdlInstruction, fieldName: string, typeMapper: TypeMapper);
    renderValue(): string;
    getField(): IdlInstructionArg;
    renderType(): string;
}
