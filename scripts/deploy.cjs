const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying CertVaultAura contract...");

  // Get the contract factory
  const CertVaultAura = await ethers.getContractFactory("CertVaultAura");

  // Deploy the contract with a verifier address (using deployer as verifier for demo)
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  if (!deployer.address) {
    throw new Error("No deployer account found. Please check your private key configuration.");
  }

  const certVaultAura = await CertVaultAura.deploy(deployer.address);
  await certVaultAura.waitForDeployment();

  const contractAddress = await certVaultAura.getAddress();
  console.log("CertVaultAura deployed to:", contractAddress);

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    deployer: deployer.address,
    verifier: deployer.address,
    network: "sepolia",
    timestamp: new Date().toISOString(),
    blockNumber: await deployer.provider.getBlockNumber()
  };

  console.log("Deployment completed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Deployer:", deployer.address);
  console.log("Verifier:", deployer.address);
  console.log("Network: sepolia");
  console.log("Timestamp:", deploymentInfo.timestamp);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
