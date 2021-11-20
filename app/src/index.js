import Web3 from "web3";
import profileArtifact from "../../build/contracts/Profiles.json";
import swipesArtifact from "../../build/contracts/Swipes.json";

// TODO use SubtleCrypto to generate a keypair; salt swipes

function buf2hex(buffer) {
  // from https://stackoverflow.com/questions/40031688/javascript-arraybuffer-to-hex
  return (
    "0x" +
    [...new Uint8Array(buffer)]
      .map((x) => x.toString(16).toUpperCase().padStart(2, "0"))
      .join("")
  );
}

const App = {
  web3: null,
  account: null,
  swipes: null,
  profiles: null,
  keyPair: null,

  data: {
    myAccount: null,
    allAccounts: {},
  },

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

      // set up keypair
      this.keyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 4096,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
      const accountText = document.getElementById("account");
      accountText.innerHTML = "Your address: " + this.account;
      await this.showMyProfile();
      await this.showAllAccounts();
      await this.scan();
    } catch (error) {
      console.error(error);
    }
  },

  encryptAddress: async function (address) {
    const publicKey = this.keyPair.publicKey;
    const enc = new TextEncoder();
    console.log(enc.encode(address));
    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKey,
      enc.encode(address)
    );
    return buf2hex(ciphertext);
  },

  swipe: async function (receiver) {
    console.log(receiver);
    // const amount = parseInt(document.getElementById("amount").value);
    const { addSwipe } = this.swipes.methods;
    await addSwipe(await this.encryptAddress(receiver)).send({
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
        allSwipes.push(swipe);
      }
      swipeInfo[address] = allSwipes;
    }

    const scanElement = document.getElementById("scanData");
    scanElement.innerHTML = `
      <table class="table table-striped">
        <tr>
          <th>Account</th>
          <th>Swipes</th>
        </tr>
        ${addresses
          .map(
            (address) => `<tr>
          <td>${this.data.allAccounts[address].firstName} (${address})</td>
          <td>
            <ol>
              ${swipeInfo[address]
                .map(
                  (swipe) => `
                <li>
                  <p>🔒 ${swipe[0].substring(0, 10)} ... ${swipe[0].substring(
                    swipe[0].length - 10
                  )}</p>
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
    await this.showMyProfile(this.account);
    await this.showAllAccounts();
  },

  showMyProfile: async function () {
    this.data.myAccount = await this.loadProfile(this.account);
    if (this.data.myAccount.firstName) {
      const myProfileElement = document.getElementById("myProfile");
      myProfileElement.innerHTML = this.profileCardGenerator(
        this.data.myAccount
      );
      const profileModalButton = document.getElementById("profileModalButton");
      profileModalButton.innerText = "Edit Profile";
    }
  },

  showAllAccounts: async function () {
    await this.loadAllAccounts();
    const compatibleAccountsElement =
      document.getElementById("compatibleAccounts");
    // const compatibleAccounts = this.data.allAccounts;
    const compatibleAccounts = this.compatibleAccounts(this.data.allAccounts);
    compatibleAccountsElement.innerHTML = `
    <div class="row">
      ${Object.keys(compatibleAccounts)
        .map((account) =>
          this.profileCardGenerator(compatibleAccounts[account], true)
        )
        .join("\n")}
    </div>
    `;

    const allAccountsElement = document.getElementById("allAccounts");
    const allAccounts = this.data.allAccounts;
    allAccountsElement.innerHTML = `
    <div class="row">
      ${Object.keys(allAccounts)
        .map(
          (account) => this.profileCardGenerator(allAccounts[account]),
          false
        )
        .join("\n")}
    </div>
    `;
  },

  compatibleAccounts: function (accountsObject) {
    let accounts = Object.values(accountsObject);
    accounts = accounts.filter((account) => account.address !== this.account);
    if (this.data.myAccount.gender === "Male") {
      accounts = accounts.filter(
        (account) =>
          (account.orientation !== "Straight" && account.gender === "Male") ||
          (account.orientation !== "Lesbian" && account.gender === "Female")
      );
      if (this.data.myAccount.orientation === "Straight") {
        accounts = accounts.filter((account) => account.gender === "Female");
      } else if (this.data.myAccount.orientation === "Gay") {
        accounts = accounts.filter((account) => account.gender === "Male");
      }
    } else if (this.data.myAccount.gender === "Female") {
      accounts = accounts.filter(
        (account) =>
          (account.orientation !== "Straight" && account.gender === "Female") ||
          (account.orientation !== "Gay" && account.gender === "Male")
      );
      if (this.data.myAccount.orientation === "Straight") {
        accounts = accounts.filter((account) => account.gender === "Male");
      } else if (this.data.myAccount.orientation === "Lesbian") {
        accounts = accounts.filter((account) => account.gender === "Female");
      }
    }
    return accounts;
  },

  loadAllAccounts: async function () {
    const { getAccounts } = this.profiles.methods;
    const addresses = await getAccounts().call();
    for (let address of addresses) {
      this.data.allAccounts[address] = await this.loadProfile(address);
    }
  },

  loadProfile: async function (_address) {
    const { getAccount } = this.profiles.methods;
    const account = await getAccount(_address).call();
    return {
      firstName: account[0],
      location: account[1],
      birthdayYear: account[2],
      gender: account[3],
      orientation: account[4],
      bio: account[5],
      address: _address,
    };
  },

  profileCardGenerator: function (profile, showSwipe) {
    return `
      <div class="card profile-card">
        <div class="card-body">
          <h5 class="card-title"><b>${profile.firstName}</b>, ${
      2021 - profile.birthdayYear
    } </h5>
          <h6 class="card-subtitle mb-2 text-muted">${profile.address}</h6>
          <p class="card-text">
          ${profile.location}  · 
          ${profile.orientation} ${profile.gender} <br />
          <i>${profile.bio}</i>
          </p>
          ${
            showSwipe && profile.address !== this.account
              ? `<button onclick="App.swipe('${profile.address}')" class="btn btn-primary">Swipe</a>`
              : ""
          }
        </div>
    </div>
    `;
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
