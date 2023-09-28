/// <reference types="node" />
import { PathLike } from 'fs';
export declare class Paths {
    readonly outputDir: PathLike;
    constructor(outputDir: PathLike);
    get root(): string;
    get accountsDir(): string;
    get relAccountsDir(): string;
    get instructionsDir(): string;
    get relInstructionsDir(): string;
    get typesDir(): string;
    get relTypesDir(): string;
    get errorsDir(): string;
    get relErrorsDir(): string;
    accountFile(name: string): string;
    instructionFile(name: string): string;
    typeFile(name: string): string;
    errorFile(name: string): string;
}
