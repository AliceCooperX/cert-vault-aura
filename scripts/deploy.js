import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy CertVaultAura contract
  const CertVaultAura = await ethers.getContractFactory("CertVaultAura");
  const certVaultAura = await CertVaultAura.deploy(deployer.address); // Use deployer as verifier
  
  await certVaultAura.waitForDeployment();
  
  const contractAddress = await certVaultAura.getAddress();
  console.log("CertVaultAura deployed to:", contractAddress);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: "sepolia",
    deployer: deployer.address,
    verifier: deployer.address,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
  
  console.log("Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
