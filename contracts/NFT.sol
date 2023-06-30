// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// TO DO: Explain the reason/advantadge to use ERC721URIStorage instead of ERC721 itself
contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _burnedIds;

    address private marketplaceAddress;
    mapping(uint256 => address) private _creators;
    mapping(uint256 => uint256) private _burned;

    event TokenMinted(uint256 indexed tokenId, string tokenURI, address marketplaceAddress);

    constructor(address _marketplaceAddress) ERC721("R-HToken", "RHT") {
        marketplaceAddress = _marketplaceAddress;
    }

    function mintToken(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _creators[newItemId] = msg.sender;
        _setTokenURI(newItemId, tokenURI);

        // Give the marketplace approval to transact NFTs between users
        setApprovalForAll(marketplaceAddress, true);

        emit TokenMinted(newItemId, tokenURI, marketplaceAddress);
        return newItemId;
    }

    function getTokensOwnedByMe() public view returns (uint256[] memory) {
        uint256 numberOfExistingTokens = _tokenIds.current() + _burnedIds.current();
        uint256 numberOfTokensOwned = balanceOf(msg.sender);
        uint256[] memory ownedTokenIds = new uint256[](numberOfTokensOwned);

        uint256 currentIndex = 0;
        for (uint256 i = 0; i < numberOfExistingTokens; i++) {
            uint256 tokenId = i + 1;
            if (isBurned(tokenId) continue;
	    if (ownerOf(tokenId) != msg.sender) continue;
            ownedTokenIds[currentIndex] = tokenId;
            currentIndex += 1;
        }

        return ownedTokenIds;
    }

    function getTokenCreatorById(uint256 tokenId) public view returns (address) {
        return _creators[tokenId];
    }

    function getTokensCreatedByMe() public view returns (uint256[] memory) {
        uint256 numberOfExistingTokens = _tokenIds.current() + _burnedIds.current();
        uint256 numberOfTokensCreated = 0;

        for (uint256 i = 0; i < numberOfExistingTokens; i++) {
            uint256 tokenId = i + 1;
	    if (isBurned(tokenId) continue;
            if (_creators[tokenId] != msg.sender) continue;
            numberOfTokensCreated += 1;
        }

        uint256[] memory createdTokenIds = new uint256[](numberOfTokensCreated);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < numberOfExistingTokens; i++) {
            uint256 tokenId = i + 1;
	    if (isBurned(tokenId) continue;
            if (_creators[tokenId] != msg.sender) continue;
            createdTokenIds[currentIndex] = tokenId;
            currentIndex += 1;
        }

        return createdTokenIds;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);
        if (from != address(0) && to == address(0)) { // burning
            address owner = ownerOf(tokenId);
            require(owner == msg.sender, "Only the owner of NFT can burn it");
	    // require(tokenId == _tokenIds.current(), "Only the last one can be burned!");
        }
    }

    function burner(uint256 tokenId) public {
        super._burn(tokenId);
	_tokenIds.decrement();
	uint256 newBurnedId = _burnedIds.current();
	_burnedIds.increment();
	_burned[newBurnedId] = tokenId;
    }

    function isBurned(uint256 tokenId) public view returns (boolean) {
        uint256 numberOfBurnedTokens = _burnedIds.current();
	for (uint256 i = 0; i < numberOfBurnedTokens; i++) {
            if (_burned[i] == tokenId) return true;
        }
	return false;
    }

    function numberOfTokens(uint256 typeId) public view returns (uint256) {
        uint256 num_tokens = typeId == 0 ? _tokenIds.current() : _burnedIds.current();
        return num_tokens;
    }
}
