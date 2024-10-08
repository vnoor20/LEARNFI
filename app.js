// app.js

let web3;
let contract;
const contractAddress = "0xA19f867e10AbFC82Ff0b88752AedF8EFcDc0935F";  // Replace with your deployed contract address
const contractABI = [{
  "inputs": [
    {
      "internalType": "address",
      "name": "userAddress",
      "type": "address"
    }
  ],
  "stateMutability": "nonpayable",
  "type": "constructor"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "user",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    },
    {
      "indexed": false,
      "internalType": "string",
      "name": "action",
      "type": "string"
    }
  ],
  "name": "TokensClaimed",
  "type": "event"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "name": "balances",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "_account",
      "type": "address"
    }
  ],
  "name": "checkBalance",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "_recipient",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "score",
      "type": "uint256"
    }
  ],
  "name": "claimTokensForQuiz",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "_recipient",
      "type": "address"
    }
  ],
  "name": "claimTokensForVideo",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "owner",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "_recipient",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "_amount",
      "type": "uint256"
    },
    {
      "internalType": "string",
      "name": "_action",
      "type": "string"
    }
  ],
  "name": "setReward",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"}]

window.addEventListener('load', async () => {
  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
  } else {
    alert('Please install MetaMask to use LearnFi');
    return;
  }

  // Navigation Links
  document.querySelector('a[href="#courses"]').addEventListener('click', () => toggleSection('courses'));
  document.querySelector('a[href="#marketplace"]').addEventListener('click', () => toggleSection('marketplace'));
  document.querySelector('a[href="#profile"]').addEventListener('click', () => toggleSection('profile'));

  // Wallet and Balance Buttons
  document.getElementById('walletButton').addEventListener('click', connectWallet);
  document.getElementById('checkBalance').addEventListener('click', checkBalance);

  // Event listeners for course completion
  const buttons = document.querySelectorAll('.complete-module');
  buttons.forEach(button => {
    button.addEventListener('click', async (e) => {
      const moduleName = e.target.getAttribute('data-module');
      await completeModule(moduleName);
    });
  });
});

// Function to connect to MetaMask wallet
async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      alert(`Connected: ${accounts[0]}`);
    } catch (error) {
      console.error("User denied wallet connection", error);
    }
  }
}

// Function to check the balance of the user
async function checkBalance() {
  if (!web3) {
    alert("Please connect your wallet first!");
    return;
  }
  const accounts = await web3.eth.getAccounts();
  contract = new web3.eth.Contract(contractABI, contractAddress);

  try {
    const balance = await contract.methods.checkBalance(accounts[0]).call();
    document.getElementById("balanceAmount").textContent = `${balance} Tokens`;
  } catch (error) {
    console.error("Error fetching balance", error);
  }
}

// Function to handle module completion and reward claiming
async function completeModule(moduleName) {
  if (!web3) {
    alert("Please connect your wallet first!");
    return;
  }

  const accounts = await web3.eth.getAccounts();
  contract = new web3.eth.Contract(contractABI, contractAddress);

  try {
    let tx;
    if (moduleName === "blockchain_basics") {
      tx = await contract.methods.claimTokensForVideo(accounts[0]).send({ from: accounts[0] });
    } else if (moduleName === "smart_contracts") {
      tx = await contract.methods.claimTokensForQuiz(accounts[0], 80).send({ from: accounts[0] });  // Assuming 80 is a passing score
    } else if (moduleName === "defi_applications") {
      tx = await contract.methods.claimTokensForQuiz(accounts[0], 90).send({ from: accounts[0] });  // Adjust score as needed
    } else if (moduleName === "nft_marketplaces") {
      tx = await contract.methods.claimTokensForVideo(accounts[0]).send({ from: accounts[0] });
    } else if (moduleName === "web3_security") {
      tx = await contract.methods.claimTokensForQuiz(accounts[0], 95).send({ from: accounts[0] });
    }

    alert("Tokens claimed successfully!");
  } catch (error) {
    console.error("Error claiming tokens", error);
  }
}

// Helper function to toggle sections
function toggleSection(sectionId) {
  document.querySelectorAll('section').forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById(sectionId).style.display = 'block';
}
