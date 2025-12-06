// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AionERC20
 * @dev Token ERC20 creado por TokenFactory
 */
contract AionERC20 is ERC20, Ownable {
    uint8 private _decimals;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_,
        uint8 decimals_,
        address owner_
    ) ERC20(name_, symbol_) Ownable(owner_) {
        _decimals = decimals_;
        _mint(owner_, initialSupply_ * 10 ** decimals_);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}

/**
 * @title AionERC721
 * @dev NFT ERC721 creado por TokenFactory
 */
contract AionERC721 is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    string private _baseTokenURI;

    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseURI_,
        address owner_
    ) ERC721(name_, symbol_) Ownable(owner_) {
        _baseTokenURI = baseURI_;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI_) external onlyOwner {
        _baseTokenURI = baseURI_;
    }

    function mint(address to) external onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(to, tokenId);
        return tokenId;
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }
}

/**
 * @title TokenFactory
 * @dev Factory para crear tokens ERC20 y ERC721 en AION-Ω
 * @notice Producción en Polygon Mainnet
 */
contract TokenFactory is ReentrancyGuard {
    // Eventos
    event ERC20Created(
        address indexed creator,
        address indexed tokenAddress,
        string name,
        string symbol,
        uint256 initialSupply
    );

    event ERC721Created(
        address indexed creator,
        address indexed tokenAddress,
        string name,
        string symbol
    );

    // Registro de tokens creados
    mapping(address => address[]) public creatorToTokens;
    address[] public allTokens;

    /**
     * @dev Crear un nuevo token ERC20
     * @param name_ Nombre del token
     * @param symbol_ Símbolo del token
     * @param initialSupply_ Suministro inicial (sin decimales)
     * @param decimals_ Número de decimales (usualmente 18)
     */
    function createERC20(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_,
        uint8 decimals_
    ) external nonReentrant returns (address) {
        require(bytes(name_).length > 0, "Name cannot be empty");
        require(bytes(symbol_).length > 0, "Symbol cannot be empty");
        require(initialSupply_ > 0, "Initial supply must be > 0");
        require(decimals_ <= 18, "Decimals must be <= 18");

        AionERC20 token = new AionERC20(
            name_,
            symbol_,
            initialSupply_,
            decimals_,
            msg.sender
        );

        address tokenAddress = address(token);
        creatorToTokens[msg.sender].push(tokenAddress);
        allTokens.push(tokenAddress);

        emit ERC20Created(msg.sender, tokenAddress, name_, symbol_, initialSupply_);

        return tokenAddress;
    }

    /**
     * @dev Crear un nuevo token ERC721 (NFT)
     * @param name_ Nombre de la colección
     * @param symbol_ Símbolo de la colección
     * @param baseURI_ URI base para los metadatos
     */
    function createERC721(
        string memory name_,
        string memory symbol_,
        string memory baseURI_
    ) external nonReentrant returns (address) {
        require(bytes(name_).length > 0, "Name cannot be empty");
        require(bytes(symbol_).length > 0, "Symbol cannot be empty");

        AionERC721 nft = new AionERC721(
            name_,
            symbol_,
            baseURI_,
            msg.sender
        );

        address nftAddress = address(nft);
        creatorToTokens[msg.sender].push(nftAddress);
        allTokens.push(nftAddress);

        emit ERC721Created(msg.sender, nftAddress, name_, symbol_);

        return nftAddress;
    }

    /**
     * @dev Obtener tokens creados por una dirección
     */
    function getTokensByCreator(address creator) external view returns (address[] memory) {
        return creatorToTokens[creator];
    }

    /**
     * @dev Obtener todos los tokens creados
     */
    function getAllTokens() external view returns (address[] memory) {
        return allTokens;
    }

    /**
     * @dev Número total de tokens creados
     */
    function totalTokensCreated() external view returns (uint256) {
        return allTokens.length;
    }
}
