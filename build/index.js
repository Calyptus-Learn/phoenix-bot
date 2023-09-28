"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.execute = void 0;
require("dotenv").config();
const web3_js_1 = require("@solana/web3.js");
const phoenixSdk = __importStar(require("@ellipsis-labs/phoenix-sdk"));
const execute = () => __awaiter(void 0, void 0, void 0, function* () {
    const REFRESH_FREQUENCY_IN_MS = 2000;
    const MAX_ITERATIONS = 3;
    // Maximum time an order is valid for
    const ORDER_LIFETIME_IN_SECONDS = 7;
    // Edge of $0.5
    const EDGE = 0.5;
    let counter = 0;
    if (!process.env.PRIVATE_KEY) {
        throw new Error("Missing PRIVATE_KEY in your .env file");
    }
    let privateKeyArray;
    try {
        privateKeyArray = JSON.parse(process.env.PRIVATE_KEY);
    }
    catch (error) {
        throw new Error("Error parsing PRIVATE_KEY. Please make sure it is a stringified array");
    }
    let traderKeypair = web3_js_1.Keypair.fromSecretKey(new Uint8Array(privateKeyArray));
    const marketPubkey = new web3_js_1.PublicKey("4DoNfFBfF7UokCC2FQzriy7yHK6DY6NVdYpuekQ5pRgg");
    const endpoint = "https: //api.mainnet-beta.solana.com";
    const connection = new web3_js_1.Connection(endpoint);
    // Create a Phoenix Client
    const client = yield phoenixSdk.Client.create(connection);
    // Get the market metadata for the market you wish to trade on
    const marketState = client.marketStates.get(marketPubkey.toString());
    const marketData = marketState === null || marketState === void 0 ? void 0 : marketState.data;
    if (!marketData) {
        throw new Error("Market data not found");
    }
    const setupNewMakerIxs = yield phoenixSdk.getMakerSetupInstructionsForMarket(connection, marketState, traderKeypair.publicKey);
    if (setupNewMakerIxs.length !== 0) {
        const setup = new web3_js_1.Transaction().add(...setupNewMakerIxs);
        const setupTxId = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, setup, [traderKeypair], {
            skipPreflight: true,
            commitment: "confirmed",
        });
        console.log(`Setup Tx Link: https://beta.solscan.io/tx/${setupTxId}`);
    }
    else {
        console.log("No setup required. Continuing...");
    }
    do {
        // Before quoting, we cancel all outstanding orders
        const cancelAll = client.createCancelAllOrdersInstruction(marketPubkey.toString(), traderKeypair.publicKey);
        // Note we could bundle this with the place order transaction below, but we choose to cancel
        // separately since getting the price could take a non-deterministic amount of time
        try {
            const cancelTransaction = new web3_js_1.Transaction().add(cancelAll);
            const txid = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, cancelTransaction, [traderKeypair], {
                skipPreflight: true,
                commitment: "confirmed",
            });
            console.log("Cancel tx link: https://beta.solscan.io/tx/" + txid);
        }
        catch (err) {
            console.log("Error: ", err);
            continue;
        }
        // Now we can place an order
        try {
            // Get current SOL price from Coinbase
            const response = yield fetch("https://api.coinbase.com/v2/prices/SOL-USD/spot");
            const data = yield response.json();
            if (!data.data || !data.data.amount)
                throw new Error("Invalid response structure");
            const price = parseFloat(data.data.amount);
            let bidPrice = price - EDGE;
            let askPrice = price + EDGE;
            console.log(`SOL price: ${price}`);
            console.log(`Placing bid (buy) order at: ${bidPrice}`);
            console.log(`Placing ask (sell) order at: ${askPrice}`);
            const currentTime = Math.floor(Date.now() / 1000);
            const bidOrderTemplate = {
                side: phoenixSdk.Side.Bid,
                priceAsFloat: bidPrice,
                sizeInBaseUnits: 1,
                selfTradeBehavior: phoenixSdk.SelfTradeBehavior.Abort,
                clientOrderId: 1,
                useOnlyDepositedFunds: false,
                lastValidSlot: undefined,
                lastValidUnixTimestampInSeconds: currentTime + ORDER_LIFETIME_IN_SECONDS,
            };
            const bidLimitOrderIx = client.getLimitOrderInstructionfromTemplate(marketPubkey.toBase58(), traderKeypair.publicKey, bidOrderTemplate);
            const askOrderTemplate = {
                side: phoenixSdk.Side.Ask,
                priceAsFloat: askPrice,
                sizeInBaseUnits: 1,
                selfTradeBehavior: phoenixSdk.SelfTradeBehavior.Abort,
                clientOrderId: 1,
                useOnlyDepositedFunds: false,
                lastValidSlot: undefined,
                lastValidUnixTimestampInSeconds: currentTime + ORDER_LIFETIME_IN_SECONDS,
            };
            const askLimitOrderIx = client.getLimitOrderInstructionfromTemplate(marketPubkey.toBase58(), traderKeypair.publicKey, askOrderTemplate);
            let instructions = [];
            if (counter < MAX_ITERATIONS) {
                instructions = [bidLimitOrderIx, askLimitOrderIx];
            }
            // If strategy has been executed for MAX_ITERATIONS times withdraw the funds from the exchange.
            if (counter === MAX_ITERATIONS) {
                // Create WithdrawParams. Setting params to null will withdraw all funds
                const withdrawParams = {
                    quoteLotsToWithdraw: null,
                    baseLotsToWithdraw: null,
                };
                const placeWithdraw = client.createWithdrawFundsInstruction({
                    withdrawFundsParams: withdrawParams,
                }, marketPubkey.toString(), traderKeypair.publicKey);
                instructions.push(placeWithdraw);
            }
            // Send place orders/withdraw transaction
            try {
                const placeQuotesTx = new web3_js_1.Transaction().add(...instructions);
                const placeQuotesTxId = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, placeQuotesTx, [traderKeypair], {
                    skipPreflight: true,
                    commitment: "confirmed",
                });
                console.log("Place quotes", bidPrice.toFixed(marketState.getPriceDecimalPlaces()), "@", askPrice.toFixed(marketState.getPriceDecimalPlaces()));
                console.log(`Tx link: https://solscan.io/tx/${placeQuotesTxId}`);
            }
            catch (err) {
                console.log("Error: ", err);
                continue;
            }
            counter += 1;
            yield (0, exports.delay)(REFRESH_FREQUENCY_IN_MS);
        }
        catch (error) {
            console.error(error);
        }
    } while (counter < MAX_ITERATIONS);
});
exports.execute = execute;
const delay = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
};
exports.delay = delay;
(0, exports.execute)();
