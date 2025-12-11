const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { solidityPackedKeccak256 } = require("ethers");

const addresses = [
  { address: "0x407f374db9db4a88e6ee8502c262963d19f4aabd", amount: "1000000000000000000" },
  { address: "0x3de790344c4f2278b95084195e9c77deda7e30ef", amount: "1000000000000000000" }
];

function hashLeaf(addr, amount) {
    const hash = solidityPackedKeccak256(
        ["address", "uint256"],
        [addr, amount]
    );
    return Buffer.from(hash.slice(2), "hex"); // convert 0x... to Buffer
}

const leaves = addresses.map(x => hashLeaf(x.address, x.amount));

const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

console.log("Merkle Root:", tree.getHexRoot());

addresses.forEach(x => {
    const leaf = hashLeaf(x.address, x.amount);
    const proof = tree.getHexProof(leaf);

    console.log("\nAddress:", x.address);
    console.log("Amount:", x.amount);
    console.log("Proof:", proof);
});
