// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract POPPToken is ERC20, ERC20Capped, ERC20Burnable, Ownable {
    error CapReached();

    constructor() ERC20("Proof Of Position", "POPP") ERC20Capped(10**9 * 10 ** decimals()) {
        _mint(msg.sender, 10**6 * 10 ** decimals());
    }

    /**
    * @dev {@inheritdoc}
    **/
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
      * @dev See {ERC20-_mint}.
     */
    function _mint(address account, uint256 amount) internal virtual override(ERC20, ERC20Capped) {
        if (ERC20.totalSupply() + amount > cap()) {
            revert CapReached();
        }

        super._mint(account, amount);
    }
}