# phoenix-bot
In this tutorial, we are building a simple market maker trading bot using Phoenix.

1. The bot will look up the current market price of the asset on a SOL-USDC market of an external exchange.
1. The bot will build its own trading strategy and calculate optimal prices.
1. Based on the prices from the strategy, the bot will place orders on Phoenix.

## Steps
1. Create a .env file based on .env.example, but replaced with your variables.<br/>
Note: For more details on creating a file system wallet keypair on Solana, refer to this [Solana Documentation](https://docs.solana.com/wallet-guide/file-system-wallet). Remember to keep your keypair and passphrase secure and do not share them with anyone.
1. Install the project dependencies: `npm install`
1. Run the project: `npm start`
