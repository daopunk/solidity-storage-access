//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract StorageEx {
  enum Vote { Absent, Yes, No }

  // slot 0x0
  bytes8 a = "hello";
  bytes8 b = 0x0000000f0000000f;
  bytes4 c = 0xAceBabee;
  bytes3 d = 0xCafe00;
  bytes3 e = "zzz";
  bytes2 f = 0x1234;
  bytes2 g = "hi";
  bytes1 h = 0xef;
  bytes1 i = "y";

  // slot 0x1
  string shortStr = "hello world";

  // slot 0x2, 0x3, 0x4 
  string longStr = "this string is 92 bytes long so it will use three 32 byte storage slots totaling 96 bytes";
  
  // slot 0x5
  bytes16[] public dynamicArr = [a, b, c, d, e, f, g, h, i];
  
  // slot 0x6
  mapping(address => uint256) public userBalances;

  struct Proposal {
    address proposer;
    string description;
    uint256 yesVotes;
    uint256 noVotes;
    mapping(address => Vote) voteState;
  }

  // slot 0x7
  mapping(uint256 => Proposal) public proposals;

  // slot 0x8
  address public owner;

  // slot 0x9
  uint256 public id;

  constructor() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function populateUserBalances(address[] memory users) external onlyOwner {
    // function variables are stored in memory
    uint256 bal = 5;
    for (uint256 j=0; j < users.length; j++) {
      userBalances[users[j]] = bal;
      bal += 5;
    }
  }

  function createProposal(string calldata desc) external {
    Proposal storage prop = proposals[id];
    prop.proposer = msg.sender;
    prop.description = desc;
    prop.voteState[msg.sender] = Vote.Absent;
    id++;
  }

  function voteOnProposal(uint256 propId, bool vote) external {
    Proposal storage prop = proposals[propId];
    if (vote) prop.voteState[msg.sender] = Vote.Yes;
    else prop.voteState[msg.sender] = Vote.No;
  }

  receive() external payable {}
}
