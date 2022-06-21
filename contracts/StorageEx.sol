//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract StorageEx {
    // slot 0x0
    bytes8 varOne = "abcdefgh";
    bytes8 varTwo = 255;
    bytes12 varThree = 4095;
    bytes4 varFour = 0x10;

    // slot 0x1
    string shortStr = "hello world";

    // slot 0x2, 0x3, 0x4
    string longStr = "this string is longer than 32 bytes so it will take more than one storage slot";
    
    // slot 0x5
    bytes16[] public dynamicArr = [varOne, varTwo, varThree, varFour];
    
    // slot 0x6
    mapping(address => uint256) public userBalances;

    struct Proposal {
        uint256 id;
        string description;
        uint256 yesVotes;
        uint256 noVotes;
    }

    // slot 0x7
    mapping(uint256 => Proposal) public proposals;

}
