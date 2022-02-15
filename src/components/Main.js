import React, { useState } from "react";

const Main = ({ createProduct, purchaseProduct, productCount, products }) => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);

  return (
    <div className="content">
      <h1>Add Product</h1>
      <form
        onSubmit={event => {
          event.preventDefault();
          const name = productName.value;
          const price = window.web3.utils.toWei(
            productPrice.value.toString(),
            "Ether"
          );
          createProduct(name, price);
        }}
      >
        <div className="form-group mr-sm-2">
          <input
            id="productName"
            type="text"
            ref={input => {
              setProductName(input);
              // this.productName = input;
            }}
            className="form-control"
            placeholder="Product Name"
            required
          />
        </div>
        <div className="form-group mr-sm-2">
          <input
            id="productPrice"
            type="text"
            ref={input => {
              setProductPrice(input);
              // this.productPrice = input;
            }}
            className="form-control"
            placeholder="Product Price"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Product
        </button>
      </form>
      <p>&nbsp;</p>
      <h2>Buy Product</h2>
      <h4>product count:{productCount}</h4>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Price</th>
            <th scope="col">Owner</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody id="productList">
          {products.map((product, key) => {
            console.log(product);
            return (
              <tr key={key}>
                <th scope="row">{product.id}</th>
                <td>{product.name}</td>
                <td>
                  {window.web3.utils.fromWei(product.price.toString(), "Ether")}{" "}
                  Eth
                </td>
                <td>{product.owner}</td>
                <td>
                  {!product.purchased ? (
                    <button
                      name={product.id}
                      value={product.price}
                      onClick={event => {
                        purchaseProduct(event.target.name, event.target.value);
                      }}
                    >
                      Buy
                    </button>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Main;
