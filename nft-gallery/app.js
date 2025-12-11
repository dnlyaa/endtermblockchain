const contractAddress = "0x442780338D8954546fcad2bC86c6eAC98141DEcf";
const abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)"
];

const fixedNFTs = [
  "https://gateway.pinata.cloud/ipfs/bafkreierreacfmawcclbpba6ll374fh4hl3tbnogmhkf6insxas4n5teqq",
  "https://gateway.pinata.cloud/ipfs/bafkreicziqpj6m7gxqvull4rww2trj4lyieqs35wti4jzrz3kcwsj32ili",
  "https://gateway.pinata.cloud/ipfs/bafkreidas23cqtytgqydlsq76y77vwzirafrukdnvdojkwt2xczlf2w6fi"
];

let galleryData = [];

async function loadNFTs() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const wallet = document.getElementById("wallet").value;
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";
    galleryData = [];

    for (let i = 0; i < fixedNFTs.length; i++) {
        const response = await fetch(fixedNFTs[i]);
        const metadata = await response.json();
        galleryData.push(metadata);
    }

    displayGallery(galleryData);
}

function displayGallery(data) {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";
    data.forEach(metadata => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${metadata.name}</h3>
            <p>${metadata.description}</p>
            ${metadata.attributes.map(attr => `<p><strong>${attr.trait_type}:</strong> ${attr.value}</p>`).join('')}
        `;
        gallery.appendChild(card);
    });
}

document.getElementById("loadNFTs").addEventListener("click", loadNFTs);

document.getElementById("searchName").addEventListener("input", () => {
    const searchValue = document.getElementById("searchName").value.toLowerCase();
    const filtered = galleryData.filter(metadata => 
        metadata.name.toLowerCase().includes(searchValue) ||
        metadata.attributes.some(attr => attr.trait_type === "Program" && attr.value.toLowerCase().includes(searchValue))
    );
    displayGallery(filtered);
});

document.getElementById("filterGrade").addEventListener("change", () => {
    const grade = document.getElementById("filterGrade").value;
    const filtered = grade ? galleryData.filter(metadata => 
        metadata.attributes.some(attr => attr.trait_type === "Grade" && attr.value === grade)
    ) : galleryData;
    displayGallery(filtered);
});
