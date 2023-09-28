"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderAccountProviders = void 0;
class AccountProvidersRenderer {
    constructor(accounts) {
        this.upperCamelCaseAccountNames = accounts.map((account) => account.name.charAt(0).toUpperCase().concat(account.name.slice(1)));
    }
    _renderImports() {
        return this.upperCamelCaseAccountNames
            .map((account) => `import { ${account} } from './${account}'`)
            .join('\n');
    }
    _renderProviders() {
        return `export const accountProviders = { ${this.upperCamelCaseAccountNames.join(', ')} }`;
    }
    render() {
        if (this.upperCamelCaseAccountNames.length === 0)
            return '';
        return `
${this._renderImports()}

${this._renderProviders()}
`.trim();
    }
}
/*
 * Renders imports of all accounts and re-export as account providers assuming
 * that this code will live in a module located in the same folder as the
 * account modules.
 */
function renderAccountProviders(accounts) {
    return new AccountProvidersRenderer(accounts !== null && accounts !== void 0 ? accounts : []).render();
}
exports.renderAccountProviders = renderAccountProviders;
//# sourceMappingURL=render-account-providers.js.map