const hre = require("hardhat");

async function main() {
  const StorageEx = await hre.ethers.getContractFactory("StorageEx");
  const contractX = await StorageEx.deploy();

  await contractX.deployed();

  console.log("StorageEx address:", contractX.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
