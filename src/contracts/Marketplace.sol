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
        address payable owner;
        bool purchased;
    }

    constructor() public {
        name = "wenchiu marketplace";
    }

    event ProductCreated(
        uint256 id,
        string name,
        uint256 price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint256 id,
        string name,
        uint256 price,
        address payable owner,
        bool purchased
    );

    function createProduct(string memory _name, uint256 _price) public {
        require(bytes(_name).length > 0, "empty name");
        require(_price > 0, "price < 0");

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
        emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint256 _id) public payable {
        //fetch product
        Product memory _product = products[_id];
        //fetch onwer
        address payable _seller = _product.owner;
        //product has valid id
        require(_product.id > 0 && _product.id <= productCount);
        //require enough ether
        require(msg.value >= _product.price);
        require(!_product.purchased);
        require(_seller != msg.sender);
        //purchase
        _product.owner = msg.sender;
        _product.purchased = true;
        products[_id] = _product;
        //pay the seller
        address(_seller).transfer(msg.value);
        //trigger event
        emit ProductPurchased(
            productCount,
            _product.name,
            _product.price,
            msg.sender,
            true
        );
    }
}
