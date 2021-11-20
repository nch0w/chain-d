# chain'd

![alt text](https://raw.githubusercontent.com/nch0w/chain-d/main/images/pic1.png)
![alt text](https://raw.githubusercontent.com/nch0w/chain-d/main/images/pic2.png)

## run frontend

First, install [MetaMask](https://metamask.io/).

```
cd app
npm install
npm run dev
```

## profile creation

```
let instance = await Profiles.deployed()
let accounts = await web3.eth.getAccounts()
instance.createProfile("Alice", "Exeter, NH", 2003, "female", "straight")
instance.getName(accounts[0])
```

## swiping

```
let swipes = await Swipes.deployed()
swipes.sendTransaction({value:1000000000, data:'1293812938109238'}, {from: accounts[1]})
```
