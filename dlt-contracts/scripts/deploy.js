const hre = require("hardhat");

async function main() {
  console.log("==================================================================");
  console.log("Verde Grid Energy (VGE Technologies OÜ) — Smart Contract Deployer");
  console.log("Target Network:", hre.network.name);
  console.log("==================================================================");

  let deployerAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
  try {
    const signers = await hre.ethers.getSigners();
    if (signers && signers.length > 0) {
      deployerAddress = signers[0].address;
    }
  } catch (err) {
    console.log("Using default fallback admin wallet address for simulation.");
  }

  console.log("Deployer Address:", deployerAddress);

  const VerdeCertificate = await hre.ethers.getContractFactory("VerdeCertificate");
  const verdeCertificate = await VerdeCertificate.deploy();

  await verdeCertificate.waitForDeployment();
  const deployedAddress = await verdeCertificate.getAddress();

  console.log("\n✅ VerdeCertificate Smart Contract successfully deployed!");
  console.log("------------------------------------------------------------------");
  console.log("Contract Address :", deployedAddress);
  console.log("DLT Standard     : ERC-1155 Multi-Token (I-REC / dREC)");
  console.log("EVM Network      :", hre.network.name);
  console.log("------------------------------------------------------------------\n");

  // Register initial seed solar facility
  try {
    const tx = await verdeCertificate.registerFacility(
      "FAC-MY-PENANG-004",
      "Penang Solar Park, Malaysia",
      15000
    );
    await tx.wait();
    console.log("⚡ Registered seed solar facility: FAC-MY-PENANG-004 (15 MWp)");
  } catch (err) {
    console.log("Seed facility registration note:", err.message);
  }
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
