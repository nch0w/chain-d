pragma solidity >=0.4.25;

contract Matching {
    struct Swipe {
        bytes encryptedAddress;
        uint256 timestamp;
        uint256 fee;
    }

    mapping(address => Swipe[]) public swipes;

    constructor() public payable {}

    function() external payable {
        if (msg.value >= 1000000000) {
            bytes memory matchAddress = msg.data;
            swipes[msg.sender].push(
                Swipe(matchAddress, block.timestamp, msg.value)
            );
        }
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
