const axios = require("axios");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { MerkleTree } = require("../utils/MerkleTree");
const niceList = require("../utils/niceList.json");
const serverUrl = "http://localhost:1225";

async function main() {
  // Convert names to Uint8Array using Buffer
  const niceListUint8Array = niceList.map((name) => keccak256(name));

  // Generate a Merkle Tree using the niceList
  const merkleTree = new MerkleTree(niceListUint8Array);

  // Select a name from the niceList
  const selectedName = niceList[Math.floor(Math.random() * niceList.length)];

  // Generate a proof for the selected name
  const proof = merkleTree.getProof(
    merkleTree.leaves.indexOf(keccak256(selectedName))
  );

  // Send the proof and name to the server
  const { data: gift } = await axios.post(`${serverUrl}/gift`, {
    name: keccak256(selectedName),
    proof
  });

  console.log({ gift });
}

main();
