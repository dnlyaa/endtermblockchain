const contractAddress = "0x3088950bA7e5872bA92D0431F8D1b9527608A992"; // вставьте адрес вашего RPS контракта
const abi = [
    "function play(uint8 choice) public",
    "function getHistory(address player) public view returns (uint8[] memory, uint8[] memory)" // пример
];

let walletAddress = "";
let contract;
let signer;

document.getElementById("connectWallet").addEventListener("click", async () => {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        walletAddress = accounts[0];
        document.getElementById("wallet").value = walletAddress;
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, abi, signer);
        alert("Wallet connected: " + walletAddress);
        await loadHistory();
    } else {
        alert("Please install MetaMask!");
    }
});

document.querySelectorAll(".choices button").forEach(btn => {
    btn.addEventListener("click", async () => {
        if (!contract) {
            alert("Connect your wallet first!");
            return;
        }
        const choice = parseInt(btn.getAttribute("data-choice"));
        try {
            const tx = await contract.play(choice);
            await tx.wait();
            alert("Game played!");
            await loadHistory();
        } catch(e) {
            console.error(e);
            alert("Error playing game");
        }
    });
});

async function loadHistory() {
    const historyDiv = document.getElementById("history");
    historyDiv.innerHTML = "";
    try {
        const [playerChoices, results] = await contract.getHistory(walletAddress);
        for (let i = 0; i < playerChoices.length; i++) {
            const choice = ["Rock","Paper","Scissors"][playerChoices[i]];
            const result = ["Tie","You Lost","You Won"][results[i]];
            const p = document.createElement("p");
            p.textContent = `Game ${i+1}: ${choice} → ${result}`;
            historyDiv.appendChild(p);
        }
    } catch(e) {
        console.error(e);
    }
}
