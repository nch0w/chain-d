import Web3 from "web3";
import profileArtifact from "../../build/contracts/Profiles.json";
import swipesArtifact from "../../build/contracts/Swipes.json";

// TODO use SubtleCrypto to generate a keypair; salt swipes

const App = {
  web3: null,
  account: null,
  swipes: null,
  profiles: null,

  start: async function () {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();

      this.swipes = new web3.eth.Contract(
        swipesArtifact.abi,
        swipesArtifact.networks[networkId].address
      );

      this.profiles = new web3.eth.Contract(
        profileArtifact.abi,
        profileArtifact.networks[networkId].address
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
      const accountText = document.getElementById("account");
      accountText.innerHTML = "Your address: " + this.account;
      await this.scan();
      await this.loadProfile(this.account);
    } catch (error) {
      console.error(error);
    }
  },

  swipe: async function () {
    // const amount = parseInt(document.getElementById("amount").value);
    const receiver = document.getElementById("receiver").value;
    const { addSwipe } = this.swipes.methods;
    await addSwipe(this.web3.utils.asciiToHex(receiver)).send({
      from: this.account,
      value: this.web3.utils.toWei("0.1", "ether"),
    });
    await this.scan();
  },

  scan: async function () {
    const { getAddresses, getNumSwipes, getSwipe } = this.swipes.methods;
    const addresses = await getAddresses().call();

    const swipeInfo = {};

    for (let address of addresses) {
      const numSwipes = await getNumSwipes(address).call();
      const allSwipes = [];
      for (let i = 0; i < numSwipes; i++) {
        const swipe = await getSwipe(address, i).call();
        console.log(swipe);
        allSwipes.push(swipe);
      }
      swipeInfo[address] = allSwipes;
    }

    const scanElement = document.getElementById("scanData");
    scanElement.innerHTML = `
      <table class="table table-striped">
        <tr>
          <th>Address</th>
          <th>Swipes</th>
        </tr>
        ${addresses
          .map(
            (address) => `<tr>
          <td>${address}</td>
          <td>
            <ol>
              ${swipeInfo[address]
                .map(
                  (swipe) => `
                <li>
                  <p>🔒 ${swipe[0]}</p>
                  <p>${new Date(
                    swipe[1] * 1000
                  ).toLocaleDateString()} ${new Date(
                    swipe[1] * 1000
                  ).toLocaleTimeString()}</p>
                </li>`
                )
                .join("")}
            </ol>
          </td>
        </tr>`
          )
          .join("\n")}
      </table>
    `;

    scanElement.innerHTML += `</table>`;
  },

  setStatus: function (message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },

  saveProfile: async function () {
    const { createProfile } = this.profiles.methods;
    const firstName = document.getElementById("profile-first-name").value;
    const location = document.getElementById("profile-location").value;
    const birthdayYear = parseInt(
      document.getElementById("profile-birthday-year").value
    );
    const gender = document.getElementById("profile-gender").value;
    const orientation = document.getElementById("profile-orientation").value;
    const bio = document.getElementById("profile-bio").value;
    await createProfile(
      firstName,
      location,
      birthdayYear,
      gender,
      orientation,
      bio
    ).send({ from: this.account });
    await this.loadProfile(this.account);
  },

  loadProfile: async function (_address) {
    const { getAccount } = this.profiles.methods;
    const account = await getAccount(_address).call();
    console.log(account);
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
