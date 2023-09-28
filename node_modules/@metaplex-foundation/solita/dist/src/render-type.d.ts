/// <reference types="node" />
import { ForceFixable } from './type-mapper';
import { IdlDefinedTypeDefinition, PrimitiveTypeKey } from './types';
import { PathLike } from 'fs';
export declare function beetVarNameFromTypeName(ty: string): string;
/**
 * Performs parts of the render process that is necessary to determine if the
 * type is fixed or fixable.
 */
export declare function determineTypeIsFixable(ty: IdlDefinedTypeDefinition, fullFileDir: PathLike, accountFilesByType: Map<string, string>, customFilesByType: Map<string, string>): boolean;
export declare function renderType(ty: IdlDefinedTypeDefinition, fullFileDir: PathLike, accountFilesByType: Map<string, string>, customFilesByType: Map<string, string>, typeAliases: Map<string, PrimitiveTypeKey>, forceFixable: ForceFixable): {
    code: string;
    isFixable: boolean;
};
