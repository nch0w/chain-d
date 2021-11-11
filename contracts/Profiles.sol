// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25;

import "./ConvertLib.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract Profiles {
    struct Profile {
        string firstName;
        string location;
        uint256 birthdayYear;
        string gender;
        string orientation;
    }

    mapping(address => Profile) public profiles;

    constructor() public {}

    function createProfile(
        string memory firstName,
        string memory location,
        uint256 birthdayYear,
        string memory gender,
        string memory orientation
    ) public {
        profiles[msg.sender] = Profile(
            firstName,
            location,
            birthdayYear,
            gender,
            orientation
        );
    }

    function getName(address addr) public view returns (string memory) {
        return profiles[addr].firstName;
    }

    // function sendCoin(address receiver, uint256 amount)
    //     public
    //     returns (bool sufficient)
    // {
    //     if (balances[msg.sender] < amount) return false;
    //     balances[msg.sender] -= amount;
    //     balances[receiver] += amount;
    //     emit Transfer(msg.sender, receiver, amount);
    //     return true;
    // }

    // function getBalanceInEth(address addr) public view returns (uint256) {
    //     return ConvertLib.convert(getBalance(addr), 2);
    // }

    // function getBalance(address addr) public view returns (uint256) {
    //     return balances[addr];
    // }
}
