const { ethers } = require('hardhat');
require('dotenv').config();
// deployed storage contract
// const contractAddress = process.env.STORAGE_CONTRACT;

// ethers methods
const utils = ethers.utils;
const BigNumber = ethers.BigNumber;
const MaxUint256 = ethers.constants.MaxUint256

function bytesLength(hexString) {
  // short string? decode string length and strip off the upper 31 bytes
  if (BigNumber.from(hexString).mask(1).eq(0)) return BigNumber.from(hexString).shr(1).mask(2).toNumber();
  else return BigNumber.from(hexString).shr(1).toNumber();
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
  const sLength = bytesLength(storageReference);
  const totalSlots = Math.ceil(sLength / 32);

  let storageLocation = BigNumber.from(baseSlot).toHexString();
  let str = "";

  for (let i=1; i <= totalSlots; i++) {
    const stringDataPerSlot = await ethers.provider.getStorageAt(contractAddress, storageLocation);
    str = str.concat(utils.toUtf8String(stringDataPerSlot));
    storageLocation = BigNumber.from(baseSlot).add(i).toHexString();
  }
  return str.replace(/\x00/g, '');
}

async function getUint256(slot, contractAddress) {
  const paddedSlot = utils.hexZeroPad(slot, 32);
  const storageLocation = await ethers.provider.getStorageAt(contractAddress, paddedSlot);
  const storageValue = BigNumber.from(storageLocation);
  return storageValue;
}

async function getBytePackedVar(slot, contractAddress, byteShift, byteSize) {
  // if (byteShift > 32)
  const paddedSlot = utils.hexZeroPad(slot, 32);
  const storageLocation = await ethers.provider.getStorageAt(contractAddress, paddedSlot);
  let result = "";
  let altByteSize = 0;
  let altByteShift = 0;
  let check = false;

  if (byteSize <= 6) {
    return BigNumber.from(storageLocation).shr(byteShift * 4).mask(byteSize * 4 * 2).toNumber().toString(16);
  } else {
    altByteSize = byteSize - 6;
    altByteShift = byteShift + 12;
    check = true;
    result += await getBytePackedVar(slot, contractAddress, altByteShift, altByteSize);
  }

  if (check) {
    result += await getBytePackedVar(slot, contractAddress, byteShift, 6);
  }
  return result;
}

module.exports = {
  getShortStr,
  getLongStr,
  getUint256,
  getBytePackedVar
}


