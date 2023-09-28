/// <reference types="node" />
import { PathLike } from 'fs';
import { CustomSerializers } from './serializers';
import { ForceFixable } from './type-mapper';
import { IdlAccount, PrimitiveTypeKey, ResolveFieldType } from './types';
export declare function renderAccount(account: IdlAccount, fullFileDir: PathLike, accountFilesByType: Map<string, string>, customFilesByType: Map<string, string>, typeAliases: Map<string, PrimitiveTypeKey>, serializers: CustomSerializers, forceFixable: ForceFixable, programId: string, resolveFieldType: ResolveFieldType, hasImplicitDiscriminator: boolean): string;
