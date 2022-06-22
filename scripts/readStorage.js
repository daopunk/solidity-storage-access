const { ethers } = require('hardhat');
require('dotenv').config();

// ethers methods
const utils = ethers.utils;
const BigNumber = ethers.BigNumber;
const MaxUint256 = ethers.constants.MaxUint256

// deployed storage contract
// const contractAddress = process.env.STORAGE_CONTRACT;

function bytesLength(hexString) {
  // short string? 
  if (BigNumber.from(hexString).mask(1).eq(0)) {
    // if short string decode string length and strip off the upper 31 bytes
    return BigNumber.from(hexString).shr(1).mask(2).toNumber();
  }
  return BigNumber.from(hexString).shr(1).toNumber();
}

async function getShortStr(slot, contractAddress) {
  const paddedSlot = utils.hexZeroPad(slot, 32);
  const storageLocation = await ethers.provider.getStorageAt(contractAddress, paddedSlot);
  const storageValue = BigNumber.from(storageLocation);

  const stringData = utils.toUtf8String(
    storageValue.and(MaxUint256.sub(255)).toHexString()
  );
  return stringData.replace(/\x00/g, '');
}

async function getLongStr(slot, contractAddress) {
  const paddedSlot = utils.hexZeroPad(slot, 32);
  const storageReference = await ethers.provider.getStorageAt(contractAddress, paddedSlot);

  const baseSlot = utils.keccak256(paddedSlot);
  const Slength = bytesLength(storageReference);
  const totalSlots = Math.ceil(Slength / 32);

  let storageLocation = BigNumber.from(baseSlot).toHexString();
  let str = "";

  for (let i=1; i <= totalSlots; i++) {
    const stringDataPerSlot = await ethers.provider.getStorageAt(contractAddress, storageLocation);
    str = str.concat(utils.toUtf8String(stringDataPerSlot));
    storageLocation = BigNumber.from(baseSlot).add(i).toHexString();
  }
  return str.replace(/\x00/g, '');
}

module.exports = {
  getShortStr,
  getLongStr
}


