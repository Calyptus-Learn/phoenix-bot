"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paths = void 0;
const path_1 = __importDefault(require("path"));
class Paths {
    constructor(outputDir) {
        this.outputDir = outputDir;
    }
    get root() {
        return this.outputDir.toString();
    }
    get accountsDir() {
        return path_1.default.join(this.outputDir.toString(), 'accounts');
    }
    get relAccountsDir() {
        return path_1.default.relative(process.cwd(), this.accountsDir);
    }
    get instructionsDir() {
        return path_1.default.join(this.outputDir.toString(), 'instructions');
    }
    get relInstructionsDir() {
        return path_1.default.relative(process.cwd(), this.instructionsDir);
    }
    get typesDir() {
        return path_1.default.join(this.outputDir.toString(), 'types');
    }
    get relTypesDir() {
        return path_1.default.relative(process.cwd(), this.typesDir);
    }
    get errorsDir() {
        return path_1.default.join(this.outputDir.toString(), 'errors');
    }
    get relErrorsDir() {
        return path_1.default.relative(process.cwd(), this.errorsDir);
    }
    accountFile(name) {
        return path_1.default.join(this.accountsDir, `${name}.ts`);
    }
    instructionFile(name) {
        return path_1.default.join(this.instructionsDir, `${name}.ts`);
    }
    typeFile(name) {
        return path_1.default.join(this.typesDir, `${name}.ts`);
    }
    errorFile(name) {
        return path_1.default.join(this.errorsDir, `${name}.ts`);
    }
}
exports.Paths = Paths;
//# sourceMappingURL=paths.js.map