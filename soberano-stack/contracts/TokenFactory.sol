// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TokenFactory
 * @dev Factory para deployar contratos desde bytecode
 */
contract TokenFactory {
    event ContractCreated(address indexed creator, address indexed contractAddress, uint256 typeId);

    /**
     * @dev Deploy un contrato desde bytecode
     * @param bytecode Bytecode del contrato a deployar
     * @param typeId Identificador del tipo de contrato (1=ERC20, 2=ERC721, 3=ERC1155)
     * @return addr Dirección del contrato desplegado
     */
    function deploy(bytes memory bytecode, uint256 typeId) external returns (address addr) {
        assembly {
            addr := create(0, add(bytecode, 0x20), mload(bytecode))
        }
        require(addr != address(0), "Deployment failed");
        emit ContractCreated(msg.sender, addr, typeId);
    }

    /**
     * @dev Deploy con CREATE2 para direcciones determinísticas
     * @param bytecode Bytecode del contrato
     * @param salt Salt para CREATE2
     * @param typeId Tipo de contrato
     * @return addr Dirección del contrato desplegado
     */
    function deployCreate2(
        bytes memory bytecode,
        bytes32 salt,
        uint256 typeId
    ) external returns (address addr) {
        assembly {
            addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }
        require(addr != address(0), "Deployment failed");
        emit ContractCreated(msg.sender, addr, typeId);
    }

    /**
     * @dev Calcular dirección de CREATE2 antes de deployar
     */
    function computeAddress(bytes32 salt, bytes32 bytecodeHash) external view returns (address) {
        return address(uint160(uint256(keccak256(abi.encodePacked(
            bytes1(0xff),
            address(this),
            salt,
            bytecodeHash
        )))));
    }
}