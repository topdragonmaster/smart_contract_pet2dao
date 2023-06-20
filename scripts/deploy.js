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
  
  const Proposal = await hre.ethers.getContractFactory("Pet2DAOProposal");
  const proposal = await Proposal.deploy(roleNFTAddr);
  await proposal.deployed();
  console.log("Proposal Contract deployed to:", proposal.address);
  
  await verify(proposal.address, [roleNFTAddr]);
}

const deployRoleNFT = async (name, symbol) => {
  const EmployeeNFT = await hre.ethers.getContractFactory("EmployeeNFT");
  const roleNFT = await EmployeeNFT.deploy(name, symbol);
  await roleNFT.deployed();
  console.log("EmployeeNFT Contract deployed to:", roleNFT.address);

  await verify(roleNFT.address, [name, symbol]);

  return roleNFT.address;
}

async function main() {

  await info();

  // Deploy NFT
  const roleNFTHeaderAddr = await deployRoleNFT(
    "Oncotelic Employee NFT",
    "Employee NFT"
  );

  // Deploy proposal Lock
  await deployProposal(roleNFTHeaderAddr);
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