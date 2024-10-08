// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


/**
 * @title EduQuest
 * @dev This contract provides rewards in tokens to users for completing educational actions.
 */
contract EduQuest is ERC20 {
    address public owner;

    // Event for when tokens are claimed by users for an action
    event TokensClaimed(address indexed user, uint256 amount, string action);

    /**
     * @dev Sets the contract deployer as the owner and mints an initial supply of tokens.
     * @param initialSupply The total supply of tokens that will be minted.
     */
    constructor(uint256 initialSupply) ERC20("EduToken", "EDU") {
        owner = msg.sender;
        _mint(owner, initialSupply * 10 ** decimals()); // Mint the initial supply to the owner
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can set rewards");
        _;
    }

    /**
     * @dev Reward the user with tokens for completing an action.
     * @param _recipient The user receiving the tokens.
     * @param _amount The amount of tokens to be rewarded.
     * @param _action The action for which tokens are being rewarded.
     */
    function setReward(address _recipient, uint256 _amount, string memory _action) public onlyOwner {
        _transfer(owner, _recipient, _amount); // Transfer tokens from owner to recipient
        emit TokensClaimed(_recipient, _amount, _action); // Emit the event
    }

    /**
     * @dev Claim tokens for watching a video.
     * @param _recipient The user who watched the video.
     */
    function claimTokensForVideo(address _recipient) public {
        uint256 rewardAmount = 10 * 10 ** decimals(); // Reward amount for video
        setReward(_recipient, rewardAmount, "watched_video");
    }

    /**
     * @dev Claim tokens for passing a quiz with a score above a certain threshold.
     * @param _recipient The user who passed the quiz.
     * @param score The score achieved by the user.
     */
    function claimTokensForQuiz(address _recipient, uint256 score) public {
        require(score >= 50, "Score must be at least 50 to claim tokens");
        uint256 rewardAmount = 20 * 10 ** decimals(); // Reward amount for quiz
        setReward(_recipient, rewardAmount, "passed_quiz");
    }

    /**
     * @dev Check the balance of a user's tokens.
     * @param _account The address of the user.
     * @return The token balance of the user.
     */
    function checkBalance(address _account) public view returns (uint256) {
        return balanceOf(_account); // Use ERC-20's balanceOf function
    }
}
