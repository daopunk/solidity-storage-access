//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract StorageEx {
  enum Vote { Absent, Yes, No }

  // slot 0x0 Big Endian (first byte stored first)
  bytes2 a = 0xAce0;
  bytes4 b = 0xBebeAce0;
  bytes4 c = 0xCafeBebe;
  bytes6 d = 0xDebeCafeBebe;
  bytes8 e = 0xEbeeDebeCafeBebe;
  bytes8 f = 0xFebeeAceCafeBebe;

  // slot 0x1
  bytes16 aa = 0xAAce00Bebe00Cafe00Ace09876543210;
  bytes16 bb = 0xBBebe0Febee00Ace00Cafe0123456789;

  // slot 0x2
  string shortStr = "hello world";

  // slot 0x3 (keccak hashed into another location)
  string longStr = "this string is 92 bytes long so it will use three 32 byte storage slots totaling 96 bytes";

  // slot 0x4
  uint256 num = 99;
  
  // slot 0x5
  bytes8[] public dynamicArr16 = [a, b, c, d, e, f];

  // slot 0x6
  bytes16[] public dynamicArr8 = [a, b, c, d, e, f, aa, bb];

  // slot 0x7
  mapping(address => uint256) public userBalances;

  struct Proposal {
    address proposer;
    string description;
    uint256 yesVotes;
    uint256 noVotes;
    mapping(address => Vote) voteState;
  }

  // slot 0x8
  mapping(uint256 => Proposal) public proposals;

  // slot 0x9
  address public owner;

  // slot 0x10
  uint256 id = 1;

  constructor() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function populateUserBalances(address[] calldata users) onlyOwner external {
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
    if (vote) {
      prop.voteState[msg.sender] = Vote.Yes;
      prop.yesVotes += 1;
      }
    else {
      prop.voteState[msg.sender] = Vote.No;
      prop.noVotes += 1;
    }
  }

  receive() external payable {}
}
