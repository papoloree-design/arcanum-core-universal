// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SoberanoERC721
 * @dev Implementación ERC721 minimalista sin dependencias
 */
contract SoberanoERC721 {
    string public name;
    string public symbol;
    uint256 private _tokenIdCounter;

    mapping(uint256 => address) public ownerOf;
    mapping(address => uint256) public balanceOf;
    mapping(uint256 => address) public getApproved;
    mapping(address => mapping(address => bool)) public isApprovedForAll;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }

    function tokenURI(uint256 tokenId) public pure returns (string memory) {
        return "";
    }

    function approve(address to, uint256 tokenId) external {
        address owner = ownerOf[tokenId];
        require(msg.sender == owner || isApprovedForAll[owner][msg.sender], "Not authorized");
        getApproved[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    function setApprovalForAll(address operator, bool approved) external {
        isApprovedForAll[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        require(from == ownerOf[tokenId], "Wrong owner");
        require(
            msg.sender == from || 
            msg.sender == getApproved[tokenId] || 
            isApprovedForAll[from][msg.sender],
            "Not authorized"
        );
        
        unchecked {
            balanceOf[from]--;
            balanceOf[to]++;
        }
        
        ownerOf[tokenId] = to;
        delete getApproved[tokenId];
        
        emit Transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) external {
        transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory) external {
        transferFrom(from, to, tokenId);
    }

    function mint(address to) external returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        balanceOf[to]++;
        ownerOf[tokenId] = to;
        
        emit Transfer(address(0), to, tokenId);
        return tokenId;
    }

    function burn(uint256 tokenId) external {
        address owner = ownerOf[tokenId];
        require(msg.sender == owner, "Not owner");
        
        unchecked {
            balanceOf[owner]--;
        }
        
        delete ownerOf[tokenId];
        delete getApproved[tokenId];
        
        emit Transfer(owner, address(0), tokenId);
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }
}