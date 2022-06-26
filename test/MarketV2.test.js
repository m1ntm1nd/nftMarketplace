// Load dependencies
const { expect } = require('chai');

// Import utilities from Test Helpers
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { deployments, getNamedAccounts, ethers } = require('hardhat');
const { ZERO_ADDRESS } = require('@openzeppelin/test-helpers/src/constants');

const toBN = ethers.BigNumber.from;

describe('Market for ERC721s NFT tests', () => {
  let deployer;
  let random;
  let random2;
  let unlocker;
  let holder;
  let locker;
  let sig;
  let sigPermit;
  let rentTime;
  let deadline;

  const ADDRESS_ZERO = ethers.constants.AddressZero;
  const mybase = "https://mybase.com/json/";

  let args = {
    token: undefined,
    paytoken: undefined,
    tokenId: undefined,
    tokenIds: undefined,
    minTime: 1,
    maxTime: 1000,
    startDiscountTime: 500,
    price: 100,
    discountPrice: 90
  };

  const fee = 10;
  const feeMutltipier = 100;
  const day = 86400;
  const initialBalance = 10000000;

  beforeEach(async () => {
      [deployer, random, random2, unlocker, holder, locker] = await ethers.getSigners();
      // get chainId
      chainId = await ethers.provider.getNetwork().then((n) => n.chainId);

      const MarketInstance = await ethers.getContractFactory('NFTMarketplaceV2', deployer);
      const LockNFTInstance = await ethers.getContractFactory('LockNFT');
      const ERC20Instance = await ethers.getContractFactory('ERC20G');

      LockNFT = await LockNFTInstance.deploy(mybase);
      Market = await MarketInstance.deploy(deployer.address, fee);
      erc20 = await ERC20Instance.deploy([deployer.address, random.address, random2.address, unlocker.address, holder.address, locker.address]);

      args.token = LockNFT.address;
      args.paytoken = erc20.address;
      rentTime = 5;
      deadline = parseInt(+new Date() / 1000) + 100 * 24 * 60 * 60;

      //prepare
      await erc20.connect(locker).approve(Market.address, initialBalance);
      await erc20.connect(holder).approve(Market.address, initialBalance);
      await LockNFT.connect(holder).mint(await holder.getAddress(), 3);
      args.tokenId = (await LockNFT.totalSupply()) - 1;
      await LockNFT.connect(locker).setApprovalForAll(Market.address, true);

      sig = await signRent(
        LockNFT.address,
        erc20.address,
        args.tokenId,
        rentTime,
        args.price,
        0,
        deadline,
        holder
      );

      sigPermit = await signPermit(
        holder.address,
        Market.address,
        0,
        deadline,
        holder
      );
  });

  describe('Deployment', async function () {
    it('deploys', async function () {
        expect(Market.address).to.not.equal("");
    });
    it('stores correct wallet address', async function () {
      expect(await Market.wallet()).to.equal(deployer.address);
    });
    it('deploys NFT', async function () {
        expect(LockNFT.address).to.not.equal("");
    });
    it('deploys with correct base URI', async function () {
      expect(await LockNFT.tokenURI(await LockNFT.totalSupply() - 1)).to.include(mybase);
    });
    it('deploys with 0 tokens', async function () {
      expect(await LockNFT.totalSupply()).to.equal(3);
    });
    it('PayToken is deployed correctly', async function () {
      expect(await erc20.address).to.not.equal("");
      expect(await erc20.balanceOf(deployer.address)).to.be.equal(initialBalance);
    });
    it('Failed deployment if wallet is zero address', async function () {
      const MarketInstanceFail = await ethers.getContractFactory('NFTMarketplaceV2', deployer);
      await expect(MarketInstanceFail.deploy(ZERO_ADDRESS, fee)).to.be.revertedWith('ZERO_ADDRESS');
    });
  });

  
  describe('Rent tests', async function () {
    it('Rent Standart  workflow', async function () {
      const rentTime = 5;
      const deadline = parseInt(+new Date() / 1000) + 7 * 24 * 60 * 60;

      const signature = await signRent(
        LockNFT.address,
        erc20.address,
        args.tokenId,
        rentTime,
        args.price,
        await Market.nonces(holder.address),
        deadline,
        holder
      );

      await LockNFT.connect(holder).setApprovalForAll(Market.address, true);

      expect(await LockNFT.isApprovedForAll(locker.address, Market.address)).to.be.equal(true);

      const tx = await Market.connect(locker).rentWithoutPermit([LockNFT.address, erc20.address, args.tokenId, rentTime, args.price], deadline, signature);
      
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed;
      const gasPrice = receipt.effectiveGasPrice;
      const gasCostEth = ethers.utils.formatEther(gasPrice * gasUsed);
      
      console.log("RENT WITHOUT PERMIT: ");

      console.log("USED GAS: ");
      console.log(gasUsed);

      console.log("EFFECTIVE GAS PRICE: ");
      console.log(gasPrice);

      console.log("GAS COST IN ETH: ");
      console.log(gasCostEth);

      const blockNumBefore = await ethers.provider.getBlockNumber();
      const timestampBefore = (await ethers.provider.getBlock(blockNumBefore)).timestamp;
      const PriceWithFee = (await Market.userOffers(args.token, args.tokenId, holder.address)).price;
      const holderProfitWithoutAmount = PriceWithFee - PriceWithFee * fee / feeMutltipier;

      expect((await Market.userOffers(args.token, args.tokenId, holder.address)).endTime).to.be.equal(rentTime*day+timestampBefore);
      expect(holderProfitWithoutAmount).to.be.equal(
        await erc20.balanceOf(holder.address)-initialBalance);
    });

    it('Rent Standart workflow with permit', async function () {
      expect(await LockNFT.isApprovedForAll(locker.address, Market.address)).to.be.equal(true);

      expect(await LockNFT.balanceOf(locker.address)).to.be.equal(0);

      const tx = await Market.connect(locker).rent([LockNFT.address, erc20.address, args.tokenId, rentTime, args.price], deadline, sig, sigPermit);

      expect(await LockNFT.balanceOf(locker.address)).to.be.equal(1);
      
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed;
      const gasPrice = receipt.effectiveGasPrice;
      const gasCostEth = ethers.utils.formatEther(gasPrice * gasUsed);
      
      console.log("RENT WITH PERMIT: ");

      console.log("USED GAS: ");
      console.log(gasUsed);

      console.log("EFFECTIVE GAS PRICE: ");
      console.log(gasPrice);

      console.log("GAS COST IN ETH: ");
      console.log(gasCostEth);

      const blockNumBefore = await ethers.provider.getBlockNumber();
      const timestampBefore = (await ethers.provider.getBlock(blockNumBefore)).timestamp;
      const PriceWithFee = (await Market.userOffers(args.token, args.tokenId, holder.address)).price;
      const holderProfitWithoutAmount = PriceWithFee - PriceWithFee * fee / feeMutltipier;

      expect((await Market.userOffers(args.token, args.tokenId, holder.address)).endTime).to.be.equal(rentTime*day+timestampBefore);
      expect(holderProfitWithoutAmount).to.be.equal(
        await erc20.balanceOf(holder.address)-initialBalance);
    });

    it('Market permitAll functional', async function () {
      expect(await LockNFT.isApprovedForAll(holder.address, Market.address)).to.be.equal(false);

      const tx = await LockNFT.connect(locker).permitAll(holder.address, Market.address, deadline, sigPermit);

      expect(await LockNFT.isApprovedForAll(holder.address, Market.address)).to.be.equal(true);
    });

    describe("Helpers tests", async function () {
      it("backToken functional default", async function () {
        //offer-rent logic

        const tx = await Market.connect(locker).rent([LockNFT.address, erc20.address, args.tokenId, rentTime, args.price], deadline, sig, sigPermit);
  
        //time travel
        const blockNumBefore = await ethers.provider.getBlockNumber();
        const timestampBefore = (await ethers.provider.getBlock(blockNumBefore)).timestamp;
  
        await ethers.provider.send('evm_increaseTime', [rentTime*day]);
        await ethers.provider.send('evm_mine');
  
        const blockNumNow = await ethers.provider.getBlockNumber();
        const timestampNow = (await ethers.provider.getBlock(blockNumNow)).timestamp;
  
        expect(Math.trunc((timestampNow - timestampBefore)/10)).to.be.equal(Math.trunc(rentTime*day/10));
  
        await Market.connect(holder).backToken(args.token, holder.address, args.tokenId);
  
        expect(await LockNFT.ownerOf(args.tokenId)).to.be.equal(holder.address);
        expect((await Market.userOffers(args.token, args.tokenId, holder.address)).payToken).to.be.equal(ZERO_ADDRESS);
      });
  
      it("backToken non-existent offer negative", async function () {
        await expect(Market.connect(holder).backToken(args.token, holder.address, 
          args.tokenId)).to.be.revertedWith('offer is not exist');
      });
  
      it("backToken offer endTime not expired negative", async function () {
        await Market.connect(locker).rent([LockNFT.address, erc20.address, args.tokenId, rentTime, args.price], deadline, sig, sigPermit);
        
        await expect(Market.connect(holder).backToken(args.token, holder.address, 
          args.tokenId)).to.be.revertedWith('rent time is not expired');
      });

      it("Extend rent request-accept scen default", async function () {
        await Market.connect(locker).rent([LockNFT.address, erc20.address, args.tokenId, rentTime, args.price], deadline, sig, sigPermit);
        
        const _payAmount = 1000;
        const _extendedTime = 100;
        await Market.connect(locker).requestExtendRent(args.token, holder.address, args.tokenId, _payAmount, _extendedTime);
        
        expect((await Market.extendRequests(args.token, args.tokenId, holder.address)).payoutAmount).to.be.equal(_payAmount);
        expect((await Market.extendRequests(args.token, args.tokenId, holder.address)).isRenterAgree).to.be.equal(true);
        expect((await Market.extendRequests(args.token, args.tokenId, holder.address)).extendedTime).to.be.equal(_extendedTime);
  
        const holderBalance = await erc20.balanceOf(holder.address);
        await Market.connect(holder).acceptExtendRent(args.token, holder.address, args.tokenId, _payAmount);
        
        const blockNumBefore = await ethers.provider.getBlockNumber();
        const timestampBefore = (await ethers.provider.getBlock(blockNumBefore)).timestamp;
  
        expect(Math.trunc((await Market.userOffers(args.token, args.tokenId, holder.address)).endTime/1000)).to.be.equal(
          Math.trunc((timestampBefore + (rentTime + _extendedTime) * day)/1000));
  
        expect(parseInt(holderBalance)+_payAmount).to.be.equal(await erc20.balanceOf(holder.address));
        expect(await LockNFT.ownerOf(args.tokenId)).to.be.equal(locker.address);
      });

      it("acceptExtendRent renter is not agree negative", async function () {
        await Market.connect(locker).rent([LockNFT.address, erc20.address, args.tokenId, rentTime, args.price], deadline, sig, sigPermit);

        await expect(Market.connect(holder).acceptExtendRent(args.token, holder.address, args.tokenId, 
          0)).to.be.revertedWith('renter does not agree to the extend rent');
      });
    });
  
    
  });
  describe("checkLock tests", async function () {
    it("checkLock negative", async function () {
      await expect(Market.checkLock(erc20.address, args.tokenId)).to.be.revertedWith(
        "contract does not support locking");
    });

    it("checkLock positive", async function () {
      await expect(Market.checkLock(LockNFT.address, args.tokenId)).not.to.be.revertedWith(
        "contract does not support locking");
    });
  });

  describe("setWallet tests", async function () {
    it("Sets wallet", async function () {
      await Market.connect(deployer).setWallet(deployer.address);
      expect(await Market.wallet()).to.be.equal(deployer.address);
    });

    it("Fails if not onwer negative", async function () {
      await expect(Market.connect(random).setWallet(random.address)).to.be.revertedWith(
        "Ownable: caller is not the owner");
    });
  });

  describe("setFee tests", async function () {
    it("sets Fee", async function () {
      const anotherFee = 20;
      await Market.connect(deployer).setFee(anotherFee);
      expect(await Market.fee()).to.be.equal(anotherFee);
    });

    it("Fails if not onwer negative", async function () {
      const anotherFee = 200;
      await expect(Market.connect(random).setFee(anotherFee)).to.be.revertedWith(
        "Ownable: caller is not the owner");
    });
  });

  describe("setFeePause tests", async function () {
    it("setFeePause true", async function () {
      const status = true;
      await Market.connect(deployer).setFeePause(status);

      expect(await Market.feePause()).to.be.equal(status);
    });
  });
});

async function signRent(_token, _payToken, tokenId, rentTime, price, nonce, deadline, signer) {
  const typedData = {
    types: {
      Rent: [
        { name: '_token', type: 'address' },
        { name: '_payToken', type: 'address' },
        { name: 'tokenId', type: 'uint256' },
        { name: 'rentTime', type: 'uint256' },
        { name: 'price', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    },
    primaryType: 'Rent',
    domain: {
      name: "NFTMarketplaceV2",
      version: '1',
      chainId: chainId,
      verifyingContract: Market.address,
    },
    message: {
      _token,
      _payToken,
      tokenId,
      rentTime,
      price,
      nonce,
      deadline,
    },
  };
  
  const signature = await signer._signTypedData(
    typedData.domain,
    { Rent: typedData.types.Rent },
    typedData.message,
  );
  
  return signature;
}

async function signPermit(signer, spender, nonce, deadline, holder) {
  const typedData = {
    types: {
      PermitAll: [
        { name: 'signer', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    },
    primaryType: 'PermitAll',
    domain: {
      name: "MockNFT",
      version: '1',
      chainId: chainId,
      verifyingContract: LockNFT.address,
    },
    message: {
      signer,
      spender,
      nonce,
      deadline,
    },
  };
  
  const signature = await holder._signTypedData(
    typedData.domain,
    { PermitAll: typedData.types.PermitAll },
    typedData.message,
  );
  
  return signature;
}