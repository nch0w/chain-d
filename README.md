# chain'd

## commands

```
let instance = await MetaCoin.deployed()
let accounts = await web3.eth.getAccounts()
instance.createProfile("Alice", "Exeter, NH", 2003, "female", "straight")
instance.getName(accounts[0])
    'Alice'
```
