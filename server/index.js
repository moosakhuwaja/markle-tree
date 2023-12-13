const express = require("express");
const bodyParser = require("body-parser");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { MerkleTree } = require("../utils/MerkleTree");
const verifyProof = require("../utils/verifyProof");
const niceList = require("../utils/niceList.json");

const port = 1225;

const app = express();
app.use(bodyParser.json());

// TODO: hardcode a merkle root here representing the whole nice list
// paste the hex string in here, without the 0x prefix
const merkleTree = new MerkleTree(niceList);

// get the root

const MERKLE_ROOT = merkleTree.getRoot();

app.post("/gift", (req, res) => {
  // grab the parameters from the front-end here
  const { name, proof } = req.body;

  // Convert the hardcoded merkle root to Uint8Array
  const merkleRootUint8Array = Buffer.from(MERKLE_ROOT, "hex");

  // Check if the proof is valid
  const isValid = verifyProof(proof, keccak256(name), merkleRootUint8Array);

  if (isValid) {
    res.send("You got a toy robot!");
  } else {
    res.send("You are not on the list :(");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
