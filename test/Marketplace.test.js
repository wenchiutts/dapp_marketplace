const { assert } = require("chai");
const Marketplace = artifacts.require("./Marketplace.sol");
require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("Marketplace", ([deployer, seller, buyer]) => {
  let marketplace;

  before(async () => {
    marketplace = await Marketplace.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await marketplace.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await marketplace.name();
      assert.equal(name, "wenchiu marketplace");
    });
  });

  describe("products", async () => {
    let result, productCount;

    before(async () => {
      result = await marketplace.createProduct(
        "iPhone 13",
        web3.utils.toWei("1", "Ether"),
        { from: seller }
      );
      productCount = await marketplace.productCount();
    });

    it("creates products", async () => {
      //success
      assert.equal(productCount, 1);
      const event = result.logs[0].args;
      assert.equal(
        event.id.toNumber(),
        productCount.toNumber(),
        "id is correct"
      );
      assert.equal(event.name, "iPhone 13", "name is correct");
      assert.equal(event.price, "1000000000000000000", "id is correct");
      assert.equal(event.owner, seller, "owner is correct");
      assert.equal(event.purchased, false, "purchased is correct");
      //failure
      await await marketplace.createProduct(
        "",
        web3.utils.toWei("1", "Ether"),
        { from: seller }
      ).should.be.rejected;
      await await marketplace.createProduct(
        "iPhone 13",
        web3.utils.toWei("0", "Ether"),
        { from: seller }
      ).should.be.rejected;
    });

    it("lists products", async () => {
      const product = await marketplace.products(productCount);
      assert.equal(
        product.id.toNumber(),
        productCount.toNumber(),
        "id is correct"
      );
      assert.equal(product.name, "iPhone 13", "name is correct");
      assert.equal(product.price, "1000000000000000000", "id is correct");
      assert.equal(product.owner, seller, "owner is correct");
      assert.equal(product.purchased, false, "purchased is correct");
    });

    it("sells products", async () => {
      //track seller balance
      let oldSellerBalance;
      oldSellerBalance = await web3.eth.getBalance(seller);
      oldSellerBalance = new web3.utils.BN(oldSellerBalance);
      //success
      result = await marketplace.purchaseProduct(productCount, {
        from: buyer,
        value: web3.utils.toWei("1", "Ether")
      });

      //check logs
      const event = result.logs[0].args;
      assert.equal(
        event.id.toNumber(),
        productCount.toNumber(),
        "id is correct"
      );
      assert.equal(event.name, "iPhone 13", "name is correct");
      assert.equal(event.price, "1000000000000000000", "id is correct");
      assert.equal(event.owner, buyer, "owner is correct");
      assert.equal(event.purchased, true, "purchased is correct");

      //check seller receive funds
      let newSellerBalance;
      newSellerBalance = await web3.eth.getBalance(seller);
      newSellerBalance = new web3.utils.BN(newSellerBalance);
      let price;
      price = web3.utils.toWei("1", "Ether");
      price = new web3.utils.BN(price);
      const expectedBalance = oldSellerBalance.add(price);
      assert.equal(expectedBalance.toString(), newSellerBalance.toString());

      //try to buy a product that doesn't exist
      await marketplace.purchaseProduct(99, {
        from: buyer,
        value: web3.utils.toWei("1", "Ether")
      }).should.be.rejected;

      //try to buy a product without enough ether
      await marketplace.purchaseProduct(productCount, {
        from: buyer,
        value: web3.utils.toWei("0.5", "Ether")
      }).should.be.rejected;

      //deployer try to buy a product twice
      await marketplace.purchaseProduct(productCount, {
        from: deployer,
        value: web3.utils.toWei("1", "Ether")
      }).should.be.rejected;

      //buyer try to buy a product again
      await marketplace.purchaseProduct(productCount, {
        from: buyer,
        value: web3.utils.toWei("1", "Ether")
      }).should.be.rejected;
    });
  });
});
