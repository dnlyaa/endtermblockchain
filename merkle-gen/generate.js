const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

const addresses = [
  "0x407f374db9db4a88e6ee8502c262963d19f4aabd",
  "0x3de790344c4f2278b95084195e9c77deda7e30ef"
];

const leaves = addresses.map(addr => keccak256(addr.toLowerCase()));

const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

const root = tree.getHexRoot();

console.log("Merkle Root:", root);

addresses.forEach(addr => {
  const leaf = keccak256(addr.toLowerCase());
  const proof = tree.getHexProof(leaf);
  console.log("\nAddress:", addr);
  console.log("Proof:", proof);
});
