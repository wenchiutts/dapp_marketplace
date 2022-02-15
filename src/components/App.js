import React, { useState, useEffect } from "react";
import logo from "../logo.png";
import "./App.css";

import Web3 from "web3";
import Marketplace from "../abis/Marketplace.json";
import Main from "./Main.js";

const App = () => {
  const [account, setAccount] = useState();
  const [productCount, setProductCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [marketplace, setMarketplace] = useState();

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.send("eth_requestAccounts");
      // await window.ethereum.enable();
      console.log("accounts", accounts);
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
      window.alert("non-etherum browser detected");
    }
  };

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const account = await web3.eth.getAccounts();
    setAccount(account[0]);

    const networkId = await web3.eth.net.getId();
    console.log("networkId", networkId);
    const networkData = Marketplace.networks[networkId];
    console.log("networkData", networkData);

    if (networkData) {
      const marketplace = new web3.eth.Contract(
        Marketplace.abi,
        networkData.address
      );
      console.log("marketplace.methods", marketplace.methods);
      setMarketplace(marketplace);
      const productCount = await marketplace.methods.productCount().call();
      // console.log("productCount", productCount);
      setProductCount(productCount);

      for (let i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call();
        setProducts(prev => [...prev, product]);
      }

      setIsLoading(false);
    } else {
      window.alert("Marketplace contract not deployed to detected network");
    }
  };

  const createProduct = (name, price) => {
    setIsLoading(true);
    marketplace.methods
      .createProduct(name, price)
      .send({ from: account })
      .once("receipt", receipt => {
        setIsLoading(false);
        console.log("receipt", receipt);
      });
  };

  const purchaseProduct = (id, price) => {
    setIsLoading(true);
    marketplace.methods
      .purchaseProduct(id)
      .send({ from: account, value: price })
      .once("receipt", receipt => {
        setIsLoading(false);
        console.log("receipt", receipt);
      });
  };

  useEffect(() => {
    const init = async () => {
      loadWeb3();
      loadBlockchainData();
    };
    init();
  }, []);

  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          WENCHIU Marketplace
        </a>
        <p style={{ color: "#fff" }}>{account}</p>
      </nav>

      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex">
            {isLoading ? (
              <div id="loader" className="text-center">
                <p>Loading...</p>
              </div>
            ) : (
              <Main
                createProduct={createProduct}
                purchaseProduct={purchaseProduct}
                productCount={productCount}
                products={products}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
