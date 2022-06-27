### Description

This repository contains a project based on the idea of creation a market for renting NFT.  
Borrow NFT for a fee, without a need for huge collateral. A person does not have to pay the full cost of the token. It's profitable for buyers. You can use NFT, but not transfer it, so it's safe for sellers.

It is assumed that the owner of the NFT exposes it through the backend, thereby creating a signature. The buyer can take the signature of the one who puts up the NFT for rent. This is done by the 'rent' function. At the end of the lease, the owner of the NFT returns it by the 'backToken' function.

**The seller** can put the token up for rent for the desired token. He has the option to set discount price for offered items. He can also agree to an extension of the lease if the buyer creates a request!

**The buyer** can rent offered item and request for his extend.

**The owner of the market** receives a fixed commission for each rental transaction, can stop payment of rental comission for pass holders and set comission for rent and has other important rights.

### Reference Implementation

```Marketplace.sol / MarketplaceV2.sol``` are two versions of the marketplace implementation. The difference between the marketplace version 1 and 2 is that the second version does not have the function of early return of the NFT by the landlord. Also one of the main functions ```rent``` uses signatures.

```ERC721s.sol``` contains the implementation of the standard itself. It also features ERC721a-like gas-efficient batch minting. However, any implementation of the original ERC721 standard can be supplemented with the aforementioned mapping and functions.

```LockNFT.sol``` is the mock implementation for the NFT based on ERC721s. It contains public lock and unlock functions, that verify is msg.sender authorized to lock and unlock and then call the corresponding internal function. permitLock function implements EIP2612-like signature verification, which allows for better UX when used with actual service contracts.

```MockLockerContract.sol``` contains a sample of usage of the permitLock function by external contracts.

***

### Instalation

```yarn install```

### Compilation

```npx hardhat compile```

### Run tests and coverage 

```npx hardhat coverage```

### Deploying contract

```npx hardhat run scripts/ *select the file you want to run* --network *```

### Verify a contract

```npx hardhat run scripts/ *select the file you want to run* --network *```