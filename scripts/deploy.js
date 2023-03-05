const hre = require("hardhat");

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const info = async () => {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
}

const deployProposal = async (roleNFTAddr) => {
  
  const Proposal = await hre.ethers.getContractFactory("DAO");
  const proposal = await Proposal.deploy(roleNFTAddr);
  await proposal.deployed();
  console.log("Proposal Contract deployed to:", proposal.address);
  
  await verify(proposal.address, [roleNFTAddr]);
  // await verify("0x79e385197538f194D9fCeE3083C842d6405e9f54", ["0xb916aF6D900b25F3526cC97Af0722a2f41b33d50"], {IterableMapping: "0xD8B4Be9dC5c2998F6bda642c167b1A9dbe10D332"});
}

const deployRoleNFT = async (name, symbol) => {
  // const SugarHead = await hre.ethers.getContractFactory("SugarHead");
  const RoleNFT = await hre.ethers.getContractFactory("RoleNFT");
  const roleNFT = await RoleNFT.deploy(name, symbol);
  await roleNFT.deployed();
  console.log("RoleNFT Contract deployed to:", roleNFT.address);

  await verify(roleNFT.address, [name, symbol]);
  return roleNFT.address;
}

async function main() {

  await info();

  // Deploy NFT
  const roleNFTHeaderAddr = await deployRoleNFT(
    "TEST Role NFT",
    "TEST NFT"
  );

  // Deploy proposal Lock
  await deployProposal(roleNFTHeaderAddr);

  // await verify("0x16153A169E3a7Bfd33cc378EF07cbC016F52d5d1", ["0x9fb29Dfd63227a9aDA03740a4bb2c03824e27184"]);
}

async function verify(contractAddress, arguments, librayArg){
  await sleep(6 * 1000);
  try{
        await hre.run("verify:verify", {
          address: contractAddress,
          constructorArguments: arguments,
          libraries: librayArg
        })
     }
     catch(error) {
        console.error(error);
      };
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});