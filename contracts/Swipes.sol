pragma solidity >=0.4.25;

contract Swipes {
    struct Swipe {
        bytes encryptedAddress;
        uint256 timestamp;
        uint256 fee;
    }

    mapping(address => Swipe[]) public swipes;

    constructor() public {}

    function addSwipe(bytes memory encryptedMatch) public payable {
        if (msg.value >= 1000000000) {
            swipes[msg.sender].push(
                Swipe(encryptedMatch, block.timestamp, msg.value)
            );
        }
    }

    function getNumSwipes(address _address) public view returns (uint256) {
        return swipes[_address].length;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
