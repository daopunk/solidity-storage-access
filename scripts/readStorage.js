const { ethers } = require('hardhat');
require('dotenv').config();

// ethers methods
const utils = ethers.utils;
const BigNumber = ethers.BigNumber;
const MaxUint256 = ethers.constants.MaxUint256

// deployed storage contract
const contractAddress = process.env.STORAGE_CONTRACT;

function getShortStr(slot) {
  const paddedSlot = utils.hexZeroPad(slot, 32);
  const storageLocation = await ethers.provider.getStorageAt(contractAddress, paddedSlot);
  const storageValue = BigNumber.from(storageLocation);

  const stringData = utils.toUtf8String(
    storageValue.and(MaxUint256.sub(255)).toHexString()
  );
  const stringReadable = stringData.replace(/\x00/g, '');
  console.log(stringReadable);
}



