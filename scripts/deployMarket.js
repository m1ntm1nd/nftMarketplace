const network = hre.network.name;
const fs = require('fs');

async function main() {
  const namesAndAddresses = {};
  const [deployer] = await hre.ethers.getSigners();

  const NFTMarketplaceInstance = await ethers.getContractFactory('NFTMarketplace');
  const NFTMarketplace = await NFTMarketplaceInstance.deploy(process.env.WALLET, process.env.FEE);

  console.log('Network', network);
  console.log('Deploying contracts with the account:', deployer.address);
  console.log('Account balance:', (await deployer.getBalance()).toString());

  console.log(`Smart contract has been deployed to: ${NFTMarketplace.address}`);

  namesAndAddresses.NFTMarketplace = NFTMarketplace.address;

  const data = await JSON.stringify(namesAndAddresses, null, 2);
  const dir = './networks/';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const fileName = 'NFTMarketplace_' + `${network}.json`;

  await fs.writeFileSync(dir + fileName, data, { encoding: 'utf8' });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });