pragma solidity >=0.4.25;

contract Swipes {
    struct Swipe {
        bytes encryptedAddress;
        uint256 timestamp;
        uint256 fee;
    }

    // map from address to swipes that address has sent
    mapping(address => Swipe[]) public swipes;
    address[] public addresses;

    constructor() public {}

    function addSwipe(bytes memory encryptedMatch) public payable {
        // reject if < 1 ETH sent
        if (msg.value < 100000000) return;

        // push sender to address list
        if (swipes[msg.sender].length == 0) {
            addresses.push(msg.sender);
        }

        // add the swipe
        swipes[msg.sender].push(
            Swipe(encryptedMatch, block.timestamp, msg.value)
        );
    }

    function getAddresses() public view returns (address[] memory) {
        return addresses;
    }

    function getNumSwipes(address _address) public view returns (uint256) {
        // get the number of swipes made by an address
        return swipes[_address].length;
    }

    function getSwipe(address _address, uint256 index)
        public
        view
        returns (
            bytes memory,
            uint256,
            uint256
        )
    {
        // get a specific swipe made by an address
        Swipe storage swipe = swipes[_address][index];
        return (swipe.encryptedAddress, swipe.timestamp, swipe.fee);
    }

    function getBalance() public view returns (uint256) {
        // return the smart contract's balance
        return address(this).balance;
    }
}
