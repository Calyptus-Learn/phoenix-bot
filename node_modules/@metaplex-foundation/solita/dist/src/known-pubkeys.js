"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderKnownPubkeyAccess = exports.resolveKnownPubkey = exports.isProgramIdKnownPubkey = exports.isProgramIdPubkey = exports.isKnownPubkey = void 0;
const types_1 = require("./types");
const utils_1 = require("./utils");
const knownPubkeysMap = new Map([
    ['tokenProgram', { exp: 'TOKEN_PROGRAM_ID', pack: types_1.SOLANA_SPL_TOKEN_PACKAGE }],
    [
        'ataProgram',
        { exp: 'ASSOCIATED_TOKEN_PROGRAM_ID', pack: types_1.SOLANA_SPL_TOKEN_PACKAGE },
    ],
    [
        'systemProgram',
        { exp: 'SystemProgram.programId', pack: types_1.SOLANA_WEB3_PACKAGE },
    ],
    ['rent', { exp: 'SYSVAR_RENT_PUBKEY', pack: types_1.SOLANA_WEB3_PACKAGE }],
    ['programId', { exp: types_1.PROGRAM_ID_EXPORT_NAME, pack: types_1.PROGRAM_ID_PACKAGE }],
]);
function pubkeysPackageExportName(pack) {
    switch (pack) {
        case types_1.SOLANA_SPL_TOKEN_PACKAGE:
            return types_1.SOLANA_SPL_TOKEN_EXPORT_NAME;
        case types_1.SOLANA_WEB3_PACKAGE:
            return types_1.SOLANA_WEB3_EXPORT_NAME;
        case types_1.PROGRAM_ID_PACKAGE:
            return types_1.PROGRAM_ID_EXPORT_NAME;
        default:
            throw new utils_1.UnreachableCaseError(pack);
    }
}
function isKnownPubkey(id) {
    return knownPubkeysMap.has(id);
}
exports.isKnownPubkey = isKnownPubkey;
function isProgramIdPubkey(id) {
    return id == 'programId';
}
exports.isProgramIdPubkey = isProgramIdPubkey;
function isProgramIdKnownPubkey(knownPubkey) {
    return (knownPubkey.exp === types_1.PROGRAM_ID_EXPORT_NAME &&
        knownPubkey.pack === types_1.PROGRAM_ID_PACKAGE);
}
exports.isProgramIdKnownPubkey = isProgramIdKnownPubkey;
function resolveKnownPubkey(id) {
    const item = knownPubkeysMap.get(id);
    if (item == null)
        return null;
    const packExportName = pubkeysPackageExportName(item.pack);
    return { ...item, packExportName };
}
exports.resolveKnownPubkey = resolveKnownPubkey;
function renderKnownPubkeyAccess(knownPubkey, programIdPubkey) {
    if (isProgramIdKnownPubkey(knownPubkey)) {
        return programIdPubkey;
    }
    const { exp, packExportName } = knownPubkey;
    return `${packExportName}.${exp}`;
}
exports.renderKnownPubkeyAccess = renderKnownPubkeyAccess;
//# sourceMappingURL=known-pubkeys.js.map