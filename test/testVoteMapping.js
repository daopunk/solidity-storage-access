const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const { getMappingStruct, getNestedMappingStruct } = require("../scripts/readStorage");

describe("StorageEx", function () {
  const provider = waffle.provider;
  let addr;
  let accounts;
  let users = [];
  let propDesc = ["Prop desc 1", "Prop desc 2", "Prop desc 3"];

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

    // create proposals 1, 2, 3
    await contractX.createProposal(propDesc[0]);
    await contractX.connect(accounts[1]).createProposal(propDesc[1]);
    await contractX.connect(accounts[5]).createProposal(propDesc[2]);

    // vote on proposal 1
    await contractX.connect(accounts[1]).voteOnProposal(1, true);
    await contractX.connect(accounts[2]).voteOnProposal(1, false);
    await contractX.connect(accounts[5]).voteOnProposal(1, true);
    
    // vote on proposal 2
    await contractX.voteOnProposal(2, true);
    await contractX.connect(accounts[1]).voteOnProposal(2, false);
    await contractX.connect(accounts[2]).voteOnProposal(2, true);

    // vote on proposal 2
    await contractX.voteOnProposal(3, false);
    await contractX.connect(accounts[5]).voteOnProposal(3, false);
    await contractX.connect(accounts[2]).voteOnProposal(3, false);
  });

  it("Check test account balance", async function () {
    expect(ethers.utils.formatEther(await provider.getBalance(users[3]))).to.equal("10000.0");
  });

  it("Read mapping to struct: proposer", async function (){
    expect(await getMappingStruct("0x8", addr, 1, 0, "bytes")).to.equal(`00${users[0].slice(2)}`.toLowerCase());
    expect(await getMappingStruct("0x8", addr, 3, 0, "bytes")).to.equal(`00${users[5].slice(2)}`.toLowerCase());
  });

  it("Read mapping to struct: description", async function (){
    expect(await getMappingStruct("0x8", addr, 1, 1, "string")).to.equal("Prop desc 1");
    expect(await getMappingStruct("0x8", addr, 3, 1, "string")).to.equal("Prop desc 3");
  });

  it("Read mapping to struct: yes / no votes", async function (){
    expect(await getMappingStruct("0x8", addr, 1, 2, "number")).to.equal("2"); //Yes's
    expect(await getMappingStruct("0x8", addr, 1, 3, "number")).to.equal("1"); // No's

    expect(await getMappingStruct("0x8", addr, 2, 2, "number")).to.equal("2");
    expect(await getMappingStruct("0x8", addr, 2, 3, "number")).to.equal("1");

    expect(await getMappingStruct("0x8", addr, 3, 2, "number")).to.equal("0");
    expect(await getMappingStruct("0x8", addr, 3, 3, "number")).to.equal("3");
  });

  it("Read mapping to struct: voteState [nested] mapping to enum", async function (){
    expect(await getNestedMappingStruct("0x8", addr, 1, 4, users[0])).to.equal("0"); // Absent
    expect(await getNestedMappingStruct("0x8", addr, 1, 4, users[1])).to.equal("1"); // Yes
    expect(await getNestedMappingStruct("0x8", addr, 1, 4, users[2])).to.equal("2"); // No

    expect(await getNestedMappingStruct("0x8", addr, 2, 4, users[0])).to.equal("1"); // Yes
    expect(await getNestedMappingStruct("0x8", addr, 2, 4, users[1])).to.equal("2"); // No
    expect(await getNestedMappingStruct("0x8", addr, 2, 4, users[2])).to.equal("1"); // Yes

    expect(await getNestedMappingStruct("0x8", addr, 3, 4, users[0])).to.equal("2"); // No
    expect(await getNestedMappingStruct("0x8", addr, 3, 4, users[5])).to.equal("2"); // No
    expect(await getNestedMappingStruct("0x8", addr, 3, 4, users[2])).to.equal("2"); // No
  });
});

