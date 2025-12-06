// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SoberanoERC1155
 * @dev Implementación ERC1155 minimalista sin dependencias
 */
contract SoberanoERC1155 {
    mapping(uint256 => mapping(address => uint256)) public balanceOf;
    mapping(address => mapping(address => bool)) public isApprovedForAll;

    event TransferSingle(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256 id,
        uint256 value
    );

    event TransferBatch(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256[] ids,
        uint256[] values
    );

    event ApprovalForAll(address indexed account, address indexed operator, bool approved);

    event URI(string value, uint256 indexed id);

    function uri(uint256) public pure returns (string memory) {
        return "";
    }

    function balanceOfBatch(
        address[] memory accounts,
        uint256[] memory ids
    ) external view returns (uint256[] memory) {
        require(accounts.length == ids.length, "Length mismatch");
        uint256[] memory batchBalances = new uint256[](accounts.length);
        
        for (uint256 i = 0; i < accounts.length; ++i) {
            batchBalances[i] = balanceOf[ids[i]][accounts[i]];
        }
        
        return batchBalances;
    }

    function setApprovalForAll(address operator, bool approved) external {
        isApprovedForAll[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 value,
        bytes memory
    ) external {
        require(
            msg.sender == from || isApprovedForAll[from][msg.sender],
            "Not authorized"
        );
        require(balanceOf[id][from] >= value, "Insufficient balance");
        
        unchecked {
            balanceOf[id][from] -= value;
            balanceOf[id][to] += value;
        }
        
        emit TransferSingle(msg.sender, from, to, id, value);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values,
        bytes memory
    ) external {
        require(ids.length == values.length, "Length mismatch");
        require(
            msg.sender == from || isApprovedForAll[from][msg.sender],
            "Not authorized"
        );
        
        for (uint256 i = 0; i < ids.length; ++i) {
            uint256 id = ids[i];
            uint256 value = values[i];
            require(balanceOf[id][from] >= value, "Insufficient balance");
            
            unchecked {
                balanceOf[id][from] -= value;
                balanceOf[id][to] += value;
            }
        }
        
        emit TransferBatch(msg.sender, from, to, ids, values);
    }

    function mint(address to, uint256 id, uint256 value) external {
        balanceOf[id][to] += value;
        emit TransferSingle(msg.sender, address(0), to, id, value);
    }

    function burn(address from, uint256 id, uint256 value) external {
        require(balanceOf[id][from] >= value, "Insufficient balance");
        unchecked {
            balanceOf[id][from] -= value;
        }
        emit TransferSingle(msg.sender, from, address(0), id, value);
    }
}