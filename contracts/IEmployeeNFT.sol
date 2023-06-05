// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IEmployeeNFT is IERC721 {
    function isAdmin(address account) external view  returns (bool);
}
