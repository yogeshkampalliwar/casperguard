// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GitPaid {
    struct Bounty {
        address owner;
        uint256 amount;
        bool paid;
        string issueUrl;
    }
    
    mapping(uint256 => Bounty) public bounties;
    uint256 public bountyCount;
    
    event BountyCreated(uint256 id, string issueUrl, uint256 amount);
    event BountyPaid(uint256 id, address developer, uint256 amount);
    
    function createBounty(string memory issueUrl) external payable {
        require(msg.value > 0, "Amount required");
        bounties[bountyCount] = Bounty(msg.sender, msg.value, false, issueUrl);
        emit BountyCreated(bountyCount, issueUrl, msg.value);
        bountyCount++;
    }
    
    function payDeveloper(uint256 bountyId, address developer) external {
        Bounty storage b = bounties[bountyId];
        require(msg.sender == b.owner, "Not owner");
        require(!b.paid, "Already paid");
        b.paid = true;
        payable(developer).transfer(b.amount);
        emit BountyPaid(bountyId, developer, b.amount);
    }
}
