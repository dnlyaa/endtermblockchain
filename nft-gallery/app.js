const contractAddress = "0x3088950bA7e5872bA92D0431F8D1b9527608A992"; // твой RPS контракт
const abi = [
    "function play(uint8 choice) public",
    "function getHistory(address player) public view returns (uint8[] memory, uint8[] memory)"
];

const fixedNFTs = [
    "https://gateway.pinata.cloud/ipfs/bafkreierreacfmawcclbpba6ll374fh4hl3tbnogmhkf6insxas4n5teqq",
    "https://gateway.pinata.cloud/ipfs/bafkreicziqpj6m7gxqvull4rww2trj4lyieqs35wti4jzrz3kcwsj32ili",
    "https://gateway.pinata.cloud/ipfs/bafkreidas23cqtytgqydlsq76y77vwzirafrukdnvdojkwt2xczlf2w6fi"
];

let walletAddress = "";
let contract;
let signer;
let provider;

document.getElementById("connectWallet").addEventListener("click", async () => {
    if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
    }

    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    walletAddress = await signer.getAddress();
    document.getElementById("wallet").value = walletAddress;

    contract = new ethers.Contract(contractAddress, abi, signer);
    alert("Wallet connected: " + walletAddress);
});

document.getElementById("loadNFTs").addEventListener("click", async () => {
    if (!contract) {
        alert("Connect your wallet first!");
        return;
    }

    try {
        const tx = await contract.play(0); // write-транзакция, чтобы MetaMask открылось
        await tx.wait();
    } catch (err) {
        console.error(err);
        alert("Transaction failed or rejected");
        return;
    }

    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    for (let i = 0; i < fixedNFTs.length; i++) {
        try {
            const response = await fetch(fixedNFTs[i]);
            const metadata = await response.json();

            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <h3>${metadata.name}</h3>
                <p>${metadata.description}</p>
                ${metadata.attributes.map(attr => `<p><strong>${attr.trait_type}:</strong> ${attr.value}</p>`).join('')}
            `;
            gallery.appendChild(card);
        } catch (e) {
            console.error("Failed to load NFT metadata:", e);
        }
    }
});
