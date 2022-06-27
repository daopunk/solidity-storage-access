const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getShortStr, getLongStr, getUint256, getBytePackedVar, getArrayItem } = require("../scripts/readStorage");


describe("StorageEx", function () {
  let addr;

  before(async function() {
    // deploy contract
    const StorageEx = await ethers.getContractFactory("StorageEx");
    const contractX = await StorageEx.deploy();
    await contractX.deployed();
    addr = contractX.address;
    // populate mappings / arrays

  });

  it("Read short string", async function () {
    expect(await getShortStr("0x2", addr)).to.equal("hello world");
  });

  it("Read long string", async function () {
    expect(await getLongStr("0x3", addr)).to.equal("this string is 92 bytes long so it will use three 32 byte storage slots totaling 96 bytes");
  });

  it("Read uint256", async function (){
    expect(await getUint256("0x4", addr)).to.equal(99);
  });
  
  it("Read byte-packed slot: less than or equal to 6-byte", async function (){
    expect(await getBytePackedVar("0x0", addr, 0, 2)).to.equal("ace0");
    expect(await getBytePackedVar("0x0", addr, 4, 4)).to.equal("bebeace0");
    expect(await getBytePackedVar("0x0", addr, 12, 4)).to.equal("cafebebe");
    expect(await getBytePackedVar("0x0", addr, 20, 6)).to.equal("debecafebebe");
  });

  it("Read byte-packed slot: 8-byte", async function (){
    expect(await getBytePackedVar("0x0", addr, 32, 8)).to.equal("ebeedebecafebebe");
    expect(await getBytePackedVar("0x0", addr, 48, 8)).to.equal("febeeacecafebebe");
  });

  it("Read byte-packed slot: 16-byte", async function (){
    expect(await getBytePackedVar("0x1", addr, 0, 16)).to.equal("aace00bebe00cafe00ace09876543210");
    expect(await getBytePackedVar("0x1", addr, 32, 16)).to.equal("bbebe0febee00ace00cafe0123456789");
  });

  it("Read byte-packed array: 8-byte slots", async function (){
    const answers = ["ace00", "bebeace000000000", "cafebebe00000000", "debecafebebe0000", "ebeedebecafebebe", "febeeacecafebebe"];
    for (let i=0; i<answers.length; i++) {
      expect(await getArrayItem("0x5", addr, i, 8)).to.equal(answers[i]);
    }
  });

  it("Read byte-packed array: 16-byte slots", async function (){
    const answers = ["ace0000000", "bebeace000", "cafebebe00", "debecafebebe000000000", "ebeedebecafebebe00000", "febeeacecafebebe00000", "aace00bebe00cafe00ace09876543210", "bbebe0febee00ace00cafe0123456789"];
    for (let i=0; i<answers.length; i++) {
      expect(await getArrayItem("0x6", addr, i, 16)).to.equal(answers[i]);
    }
  });


});

