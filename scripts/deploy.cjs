const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying CertVaultAura contract...");

  // Get the contract factory
  const CertVaultAura = await ethers.getContractFactory("CertVaultAura");

  // Deploy the contract with a verifier address
  const [deployer] = await ethers.getSigners();
  const verifierAddress = "0x21d3DB780be7FD5205D283c3F6970b52E6d4E712";
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Verifier address:", verifierAddress);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  if (!deployer.address) {
    throw new Error("No deployer account found. Please check your private key configuration.");
  }

  const certVaultAura = await CertVaultAura.deploy(verifierAddress);
  await certVaultAura.waitForDeployment();

  const contractAddress = await certVaultAura.getAddress();
  console.log("CertVaultAura deployed to:", contractAddress);

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    deployer: deployer.address,
    verifier: verifierAddress,
    network: "sepolia",
    timestamp: new Date().toISOString(),
    blockNumber: await deployer.provider.getBlockNumber()
  };

  console.log("Deployment completed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Deployer:", deployer.address);
  console.log("Verifier:", verifierAddress);
  console.log("Network: sepolia");
  console.log("Timestamp:", deploymentInfo.timestamp);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
