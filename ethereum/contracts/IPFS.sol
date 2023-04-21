// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

contract IPFS {
    string public ipfsHash;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function setIPFSHash(string memory _ipfsHash) public onlyOwner {
        ipfsHash = _ipfsHash;
    }

    function getIPFSHash() public view returns (string memory) {
        return ipfsHash;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }
}
