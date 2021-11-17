import Web3 from "web3";
import profileArtifact from "../../build/contracts/Profiles.json";
import swipesArtifact from "../../build/contracts/Swipes.json";

const App = {
  web3: null,
  account: null,
  swipes: null,

  start: async function () {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = swipesArtifact.networks[networkId];
      this.swipes = new web3.eth.Contract(
        swipesArtifact.abi,
        deployedNetwork.address
      );

      console.log(this.swipes.methods);

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
      const accountText = document.getElementById("account");
      accountText.innerHTML = "Your address: " + this.account;
      await this.setNumberOfSwipes();
    } catch (error) {
      console.error(error);
    }
  },

  // refreshBalance: async function () {
  //   const { getBalance } = this.swipes.methods;
  //   const balance = await getBalance(this.account).call();

  //   const balanceElement = document.getElementsByClassName("balance")[0];
  //   balanceElement.innerHTML = balance;
  // },

  // sendCoin: async function () {
  //   const amount = parseInt(document.getElementById("amount").value);
  //   const receiver = document.getElementById("receiver").value;

  //   this.setStatus("Initiating transaction... (please wait)");

  //   const { sendCoin } = this.meta.methods;
  //   await sendCoin(receiver, amount).send({ from: this.account });

  //   this.setStatus("Transaction complete!");
  //   this.refreshBalance();
  // },

  swipe: async function () {
    const amount = parseInt(document.getElementById("amount").value);
    const receiver = document.getElementById("receiver").value;
    const { addSwipe } = this.swipes.methods;
    await addSwipe(this.web3.utils.asciiToHex("hello")).send({
      from: this.account,
      value: this.web3.utils.toWei(`${amount}`, "ether"),
    });
    console.log(amount, receiver);
    await this.setNumberOfSwipes();
  },

  setStatus: function (message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },

  setNumberOfSwipes: async function () {
    const { getNumSwipes } = this.swipes.methods;
    const numberOfSwipes = await getNumSwipes(this.account).call();
    console.log(numberOfSwipes);
    const numberOfSwipesElement = document.getElementById("swipeCounter");
    numberOfSwipesElement.innerHTML = numberOfSwipes;
  },
};

window.App = App;

window.addEventListener("load", function () {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live"
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545")
    );
  }

  App.start();
});
