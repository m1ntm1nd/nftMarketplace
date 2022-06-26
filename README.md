### Description

This repository contains a project based on the idea of creation a market for renting NFT.  
Borrow NFT for a fee, without a need for huge collateral. You can use NFT, but not transfer it, so the lender is safe. 

There are many ways to use NFT. You may want to use it to authorize on Discord server through Collab.land. You may want to use your NFT in a P2E game. A person does not have to pay the full cost of the token. It is safe and profitable.  

It is assumed that the owner of the NFT exposes it through the backend, thereby creating a signature. The buyer can take the signature of the one who puts up the NFT for rent. This is done by the 'rent' function. At the end of the lease, the owner of the NFT returns it by the 'backToken' function.

The seller can put the token up for sale for the desired token. He has the option to set discount price for offered items. He can also agree to an extension of the lease if the buyer creates a request!

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