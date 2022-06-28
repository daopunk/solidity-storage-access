const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const { getArrayItem, getMappingItem, } = require("../scripts/readStorage");

describe("StorageEx", function () {
  const provider = waffle.provider;
  let addr;
  let accounts;
  let users = [];

  before(async function() {
    // deploy contract
    const StorageEx = await ethers.getContractFactory("StorageEx");
    const contractX = await StorageEx.deploy();
    await contractX.deployed();
    addr = contractX.address;
    // get accounts
    accounts = await ethers.getSigners();

    // populate userBalance mapping
    for (let account of accounts) {
      users.push(account.address);
    }
    await contractX.populateUserBalances(users);
  });

  it("Check test account balance", async function () {
    expect(ethers.utils.formatEther(await provider.getBalance(users[3]))).to.equal("10000.0");
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

  it("Read balance from userBalances mapping", async function (){
    expect(await getMappingItem("0x7", addr, users[0])).to.equal(5)
    expect(await getMappingItem("0x7", addr, users[1])).to.equal(10)
    expect(await getMappingItem("0x7", addr, users[2])).to.equal(15)
    expect(await getMappingItem("0x7", addr, users[3])).to.equal(20)
  });
});

