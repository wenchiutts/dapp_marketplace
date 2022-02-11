// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract Marketplace {
    string public name;
    uint256 public productCount = 0;
    mapping(uint256 => Product) public products;

    struct Product {
        uint256 id;
        string name;
        uint256 price;
        address owner;
        bool purchased;
    }

    constructor() public {
        name = "wenchiu marketplace";
    }

    event ProductCreated(
        uint256 id,
        string name,
        uint256 price,
        address owner,
        bool purchased
    );

    function createProduct(string memory _name, uint256 _price) public {
        //parameters correct
        //increase productCount
        productCount++;
        // create product
        products[productCount] = Product(
            productCount,
            _name,
            _price,
            msg.sender,
            false
        );
        //trigger event
    }
}
