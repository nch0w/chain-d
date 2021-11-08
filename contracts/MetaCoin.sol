// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.7.0;

import "./ConvertLib.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract MetaCoin {
    struct Profile {
        string firstName;
        string location;
        uint256 birthdayYear;
        string gender;
        string orientation;
        string school;
        string bio;
        string interests;
        string photos;
    }

    mapping(address => Profile) profiles;

    // event Transfer(address indexed _from, address indexed _to, uint256 _value);

    constructor() public {
        // balances[tx.origin] = 30000;
    }

    function createProfile(
        string memory firstName,
        string memory location,
        uint256 birthdayYear,
        string memory gender,
        string memory orientation,
        string memory school,
        string memory bio,
        string memory interests,
        string memory photos
    ) public {
        profiles[msg.sender] = Profile(
            firstName,
            location,
            birthdayYear,
            gender,
            orientation,
            school,
            bio,
            interests,
            photos
        );
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
