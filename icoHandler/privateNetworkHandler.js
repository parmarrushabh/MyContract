var db = require('../database/models/index');
var config = require('../config/paymentListener');
var balance = require('crypto-balances');
let Promise = require('bluebird');
const Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(config.privateProvider));



module.exports = {
    checkTokenBalance: async (address, tokenAddress) => {
        return new Promise(async function (resolve, reject) {
            var tokenContractInstance = new web3.eth.Contract(config.erc20ABI, tokenAddress);
            decimals = await tokenContractInstance.methods.decimals().call();
            tokenContractInstance.methods.balanceOf(address).call().then(balance => {
                resolve(balance / 10 ** decimals);
            }).catch(async error => {
                provider = new Web3.providers.HttpProvider(config.privateProvider);
                web3.setProvider(provider);
                reject(error);
            });
        });
    },
    checkTokenStats: async (tokenAddress) => {
        return new Promise(async function (resolve, reject) {
            var tokenContractInstance = new web3.eth.Contract(config.erc20ABI, tokenAddress);
            var decimals = await tokenContractInstance.methods.decimals().call();
            console.log(decimals);
            resolve(decimals);
        });
    },
    sendEther: async (address, amount) => {
        var mainPrivateKey = '0xdf11b6debfa783dbc46afd4d753a6dc39caa785c1b3e749f087fc1d4f0552f6c';
        var txData = {
            "nonce": await web3.eth.getTransactionCount('0xbF456F32Fed09Ee730a4263DCc9c1B48E422Dfb5'),
            "to": address,
            "value": amount, // "0x06f05b59d3b200000"
        }
        return new Promise(async function (resolve, reject) {
            web3.eth.estimateGas(txData).then(gasLimit => {
                txData["gasLimit"] = gasLimit;
                web3.eth.accounts.signTransaction(txData, mainPrivateKey).then(result => {
                    web3.eth.sendSignedTransaction(result.rawTransaction)
                        .on('receipt', async function (receipt) { resolve(receipt) })
                        .on('error', async function (error) { reject(error) })
                })
            })
        })
    },

    sendTokenFromTokenContract: async (projectData, address, tokenAmount, tokenAddress, privateKey) => {
        var abi = [{ "constant": true, "inputs": [], "name": "mintingFinished", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "destroyToken", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "cap", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "unpause", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "to", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "mint", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "value", "type": "uint256" }], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "value", "type": "uint256" }], "name": "upgrade", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "account", "type": "address" }], "name": "isPauser", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "paused", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "upgradeAgent", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "upgradeMaster", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "renouncePauser", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "acceptOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "from", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "burnFrom", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_tokens", "type": "uint256" }, { "name": "_address", "type": "address" }], "name": "sendTokensToCrowdsale", "outputs": [{ "name": "ok", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "finishMinting", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "account", "type": "address" }], "name": "addPauser", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getUpgradeState", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "pause", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "isOwner", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "canUpgrade", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "account", "type": "address" }], "name": "addMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "account", "type": "address" }], "name": "isMinter", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalUpgraded", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "newOwner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "agent", "type": "address" }], "name": "setUpgradeAgent", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "owner", "type": "address" }, { "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_tokens", "type": "uint256" }], "name": "sendTokensToOwner", "outputs": [{ "name": "ok", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_upgradeMaster", "type": "address" }], "name": "UpgradeableToken", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "master", "type": "address" }], "name": "setUpgradeMaster", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }], "name": "Upgrade", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "agent", "type": "address" }], "name": "UpgradeAgentSet", "type": "event" }, { "anonymous": false, "inputs": [], "name": "MintingFinished", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "account", "type": "address" }], "name": "MinterAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "account", "type": "address" }], "name": "MinterRemoved", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Unpaused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "account", "type": "address" }], "name": "PauserAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "account", "type": "address" }], "name": "PauserRemoved", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }], "name": "OwnershipRenounced", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }]
        var contractfunc = new web3.eth.Contract(abi, projectData.tokenContractAddress, { from: address });
        let data = contractfunc.methods.sendTokensToCrowdsale('0x' + (tokenAmount).toString(16), tokenAddress).encodeABI()
        let txData = {
            "nonce": await web3.eth.getTransactionCount(address),
            "to": projectData.tokenContractAddress,
            "data": data,
            "chainId": 2401502
        }
        return new Promise(async function (resolve, reject) {
            web3.eth.estimateGas({ data: txData.data, from: address }).then(gasLimit => {
                console.log(gasLimit);
                txData["gasLimit"] = gasLimit;
                web3.eth.accounts.signTransaction(txData, privateKey).then(result => {
                    web3.eth.sendSignedTransaction(result.rawTransaction)
                        .on('receipt', async function (receipt) {
                            resolve(receipt)
                            console.log(receipt);
                        })
                        .on('error', async function (error) { reject(error) })
                })
            })
        })
    },

    sendTokenFromCrowdsaleContract: async (projectData, address, tokenAmount, tokenAddress, privateKey) => {
        var contractfunc = new web3.eth.Contract(projectData.crowdsaleABICode, projectData.crowdsaleContractAddress, { from: address });
        let data = contractfunc.methods.sendTokensToCrowdsale('0x' + (tokenAmount).toString(16), tokenAddress).encodeABI()
        let txData = {
            "nonce": await web3.eth.getTransactionCount(address),
            "to": projectData.crowdsaleContractAddress,
            "data": data,
        }
        return new Promise(async function (resolve, reject) {
            web3.eth.estimateGas({ data: txData.data, from: address }).then(gasLimit => {
                console.log(gasLimit);
                txData["gasLimit"] = gasLimit;
                web3.eth.accounts.signTransaction(txData, privateKey).then(result => {
                    web3.eth.sendSignedTransaction(result.rawTransaction)
                        .on('receipt', async function (receipt) { resolve(receipt) })
                        .on('error', async function (error) { reject(error) })
                })
            })
        })
    },

    sendTransaction: async (address, data, privateKey) => {
        let txData = {
            "nonce": await web3.eth.getTransactionCount(address),
            "data": '0x' + data,
        }
        return new Promise(async function (resolve, reject) {
            web3.eth.estimateGas({ data: txData.data, from: address }).then(gasLimit => {
                console.log(gasLimit);
                txData["gasLimit"] = gasLimit;
                web3.eth.accounts.signTransaction(txData, privateKey).then(result => {
                    web3.eth.sendSignedTransaction(result.rawTransaction)
                        .on('receipt', async function (receipt) { resolve(receipt) })
                        .on('error', async function (error) { reject(error) })
                })
            })
        })
    },
    sendTransaction: async (address, data, privateKey, toAddress) => {
        let txData = {
            "nonce": await web3.eth.getTransactionCount(address),
            "data": data,
            "to": toAddress,
            "chainId": 2401502
        }
        return new Promise(async function (resolve, reject) {
            web3.eth.estimateGas({data:txData.data,from:address}).then(gasLimit => {
                console.log(gasLimit);
                txData["gasLimit"] = gasLimit;
                web3.eth.accounts.signTransaction(txData, privateKey).then(result => {
                    web3.eth.sendSignedTransaction(result.rawTransaction)
                        .on('receipt', async function (receipt) {
                            resolve(receipt)
                            console.log(receipt);
                        })
                        .on('error', async function (error) { reject(error) })
                })
            })
        })
    }
}
