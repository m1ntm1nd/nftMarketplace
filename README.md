### Description

This repository contains a project based on the idea of creating a market for renting NFT users.  
Borrow NFT for a fee, without a need for huge collateral. You can use NFT, but not transfer it, so the lender is safe. 

There are many ways to use NFT. You may want to use it to authorize on Discord server through Collab.land. You may want to use your NFT in a P2E game.  
At the same time, a person does not have to pay the full cost of the token.  
It is safe and profitable.  

The seller can put the token up for sale for the desired token. He has the option to set discount price for offered items. Also he can return the token ahead of time or agree to its extension.

The owner of the market receives a fixed commission for each rental transaction, can stop payment of rental comission for pass holders and set comission for rent and has other important proves.

***

### Instalation

bash  
```yarn install```

### Usage

For further work, you will need to install in this project all all the necessary dependencies,  
which are listed in the 'package.json' file (for example, coverage (```yarn add coverage```))

### Compilation

```npx hardhat compile```

### Run tests and coverage 

```npx hardhat coverage```

### Deploying contract

```npx hardhat run scripts/ *select the file you want to run*``` 
--network rinkeby

### Verify a contract

```npx hardhat run scripts/ *select the file you want to run*``` 
--network rinkeby

***

### LockNFT
#### Deploy
```npx hardhat run scripts/deployLockNFT.js``` --network rinkeby

#### Verify
```npx hardhat run scripts/verify_LockNFT.js``` --network rinkeby