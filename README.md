# How To Acces D-Email

- Visit https://www.demails.xyz/
- Make sure your wallet is connected to the [Polygon Mumbai Testnet](https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/)
- Add testnet Matic if needed using a [faucet](https://faucet.polygon.technology/)
- Connect wallet (using Mumbai Testnet)
- Select Init Inbox
- Use recipient's wallet address as the address you are sending your email to.
- Send!

*Note recipient may need to manually refresh inbox using button to see new emails

*You can find the contract on Polygon Mumbai here at: [0xcAac6E79b814c46A019A29784840A187DECc2478](https://mumbai.polygonscan.com/address/0xcAac6E79b814c46A019A29784840A187DECc2478)

## Feel free to send us d-mails!
 - 0x24b9a28CCfa9F4c1f3B8758155dEF332f85026de
 - 0x1bd506aed4e48609a63371c5e2571747a249b1b2
 - 0xbf871a24cd733f840a091a03eca6a514157c4cdc
 - 0xfe54a9526af80aa733f19d7520340c3c5d1d7714
 - 0xcb7eaE15998C253c3cfb570a63f65eA22C093530

## Web3Con Hackathon
This project was made possible by [@NuzairNuwais](https://twitter.com/NuzairNuwais), [@AvniAgrawal1802](https://twitter.com/AvniAgrawal1802), [@ChimingPork](https://twitter.com/ChimingPork), [@wgg](https://twitter.com/wgg), and [@heyskylark](https://twitter.com/heyskylark). Completed for the 2022 [Web3Con](https://www.web3con.dev/), hosted by [DeveloperDAO](https://www.developerdao.com/).


# Setup
Currently I am using Node v16 for this project. Node v17 is **not** compatible with hardhat at this time.
- `npm install`
- `npm start`

# Advanced Sample Hardhat Project

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.js
node scripts/deploy.js
npx eslint '**/*.js'
npx eslint '**/*.js' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/deploy.js
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```
