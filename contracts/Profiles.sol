// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25;

import "./ConvertLib.sol";



// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract Profiles {
    struct Profile {
        address addr;
        string firstName;
        string location;
        uint256 birthdayYear;
        string gender;
        string orientation;
    }
    
    address[] public datingAccounts;
    address[] public matches;


    mapping(address => Profile) public profiles;

    constructor() public {}

    function createProfile(
        string memory firstName,
        string memory location,
        uint256 birthdayYear,
        string memory gender,
        string memory orientation

    ) public {
        Profile memory account = Profile(msg.sender, firstName, location, birthdayYear, gender, orientation);
        profiles[msg.sender] = account;
        datingAccounts.push(account.addr);
    }

    function getAccounts() public view returns (address[] memory){
        return datingAccounts;
    }

    function getAccount(address acct) public view returns (string memory, string memory, uint256, string memory, string memory){
        return (profiles[acct].firstName, profiles[acct].location, profiles[acct].birthdayYear, profiles[acct].gender, profiles[acct].orientation);
    }

    function makeMatches(uint256 age, string memory gender, string memory orientation) public view returns(address[] memory){
        address[] memory mtchs;
        uint index = 0;
        for(uint i = 0; i < datingAccounts.length-1;i++){
            if(getAge(datingAccounts[i]) == age && compareStrings(getGender(datingAccounts[i]), gender) && compareStrings(getOrientation(datingAccounts[i]), orientation))
            {
                mtchs[index] = datingAccounts[i];
                index++;
            }

        }
    return mtchs;

    }
    // using address
    function getName(address addr) public view returns (string memory) {
       return profiles[addr].firstName;
    }

    function getLocation(address addr) public view returns (string memory) {
        return profiles[addr].location;
    }

    function getAge(address addr) public view returns (uint256) {
        uint256 age = (2021 - profiles[addr].birthdayYear);
        return age;
    }

    function getGender(address addr) public view returns (string memory) {
        return profiles[addr].gender;
    }

    function getOrientation(address addr) public view returns (string memory) {
        return profiles[addr].orientation;
    }
    // using index
   function getName(uint256 index) public view returns (string memory) {
        return profiles[datingAccounts[index]].firstName;
    }

    function getLocation(uint256 index) public view returns (string memory) {
        return profiles[datingAccounts[index]].location;
    }

    function getAge(uint256 index) public view returns (uint256) {
        uint256 age = (2021 - profiles[datingAccounts[index]].birthdayYear);
        return age;
    }

    function getGender(uint256 index) public view returns (string memory) {
        return profiles[datingAccounts[index]].gender;
    }

    function getOrientation(uint256 index) public view returns (string memory) {
        return profiles[datingAccounts[index]].orientation;
    }
    

function compareStrings(string memory a, string memory b) public pure returns (bool) {
    return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
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