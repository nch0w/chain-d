// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25;

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
        string bio;
    }

    address[] public datingAccounts;

    mapping(address => Profile) public profiles;
    mapping(address => address[]) public matches;

    constructor() public {}

    function createProfile(
        string memory firstName,
        string memory location,
        uint256 birthdayYear,
        string memory gender,
        string memory orientation,
        string memory bio
    ) public {
        Profile memory account = Profile(
            msg.sender,
            firstName,
            location,
            birthdayYear,
            gender,
            orientation,
            bio
        );
        profiles[msg.sender] = account;
        datingAccounts.push(account.addr);
    }

    function makeMatches(
        address addr,
        uint256 age,
        string memory gender,
        string memory orientation
    ) public {
        for (uint256 i = 0; i < datingAccounts.length; i++) {
            if (
                getAge(datingAccounts[i]) == age &&
                compareStrings(getGender(datingAccounts[i]), gender) &&
                compareStrings(getOrientation(datingAccounts[i]), orientation)
            ) {
                matches[addr].push(datingAccounts[i]);
            }
        }
    }

    // returns the address array of matches that has been mapped to the given address
    function getMatches(address addr) public view returns (address[] memory) {
        return matches[addr];
    }

    // gets all accounts/addresses on the network
    function getAccounts() public view returns (address[] memory) {
        return datingAccounts;
    }

    // gets all stored information of given account/address
    function getAccount(address acct)
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            string memory,
            string memory,
            string memory
        )
    {
        return (
            profiles[acct].firstName,
            profiles[acct].location,
            profiles[acct].birthdayYear,
            profiles[acct].gender,
            profiles[acct].orientation,
            profiles[acct].bio
        );
    }

    // getter functions using address
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

    // getter functions using index
    function getNameIndex(uint256 index) public view returns (string memory) {
        return profiles[datingAccounts[index]].firstName;
    }

    function getLocationIndex(uint256 index)
        public
        view
        returns (string memory)
    {
        return profiles[datingAccounts[index]].location;
    }

    function getAgeIndex(uint256 index) public view returns (uint256) {
        uint256 age = (2021 - profiles[datingAccounts[index]].birthdayYear);
        return age;
    }

    function getGenderIndex(uint256 index) public view returns (string memory) {
        return profiles[datingAccounts[index]].gender;
    }

    function getOrientationIndex(uint256 index)
        public
        view
        returns (string memory)
    {
        return profiles[datingAccounts[index]].orientation;
    }

    // simple functions to do with comparing variables

    function compareStrings(string memory a, string memory b)
        public
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
}
