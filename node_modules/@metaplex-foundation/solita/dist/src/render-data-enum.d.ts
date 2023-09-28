import { TypeMapper } from './type-mapper';
import { IdlDataEnumVariant, IdlTypeDataEnum } from './types';
/**
 * Renders union type and related methods for Rust data enum.
 */
export declare function renderTypeDataEnumBeet(args: {
    typeMapper: TypeMapper;
    dataEnum: IdlTypeDataEnum;
    beetVarName: string;
    typeName: string;
}): string;
export declare function renderDataEnumRecord(typeMapper: TypeMapper, typeName: string, variants: IdlDataEnumVariant[]): string;
