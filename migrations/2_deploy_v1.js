const fs = require("fs");
const path = require("path");
const some = require("lodash/some");

const FiatTokenV1 = artifacts.require("FiatTokenV1");
const FiatTokenProxy = artifacts.require("FiatTokenProxy");

const THROWAWAY_ADDRESS = "0x0000000000000000000000000000000000000001";

let proxyAdminAddress = "";
let ownerAddress = "";
let masterMinterAddress = "";
let pauserAddress = "";
let blacklisterAddress = "";

// Read config file if it exists
if (fs.existsSync(path.join(__dirname, "..", "config.js"))) {
  ({
    PROXY_ADMIN_ADDRESS: proxyAdminAddress,
    OWNER_ADDRESS: ownerAddress,
    MASTERMINTER_ADDRESS: masterMinterAddress,
    PAUSER_ADDRESS: pauserAddress,
    BLACKLISTER_ADDRESS: blacklisterAddress,
  } = require("../config.js"));
}

module.exports = async (deployer, network, [addresses]) => {
  if (some(["development", "coverage"], (v) => network.includes(v))) {
    // DO NOT USE THESE ADDRESSES IN PRODUCTION - these are the deterministic
    // addresses from ganache, so the private keys are well known and match the
    // values we use in the tests
    proxyAdminAddress = "0x8AB4c210064613Af6326f800ACA3cb6f3375ed69";
    ownerAddress = "0x1a49771C2FcdF90A49cD2Bc946Fb878AF3E2F351";
    masterMinterAddress = "0x9a983C1DAEf891e9c45fa8Ee2A3381770c01795a";
    pauserAddress = "0xdF92105DB06310dB62BAD84086c2F45Bc4564514";
    blacklisterAddress = "0x12f6F06CD20f0d75e3fcD4D8bc8c736bBBd2b397";
  }

  console.log(`Proxy Admin:   ${proxyAdminAddress}`);
  console.log(`Owner:         ${ownerAddress}`);
  console.log(`Master Minter: ${masterMinterAddress}`);
  console.log(`Pauser:        ${pauserAddress}`);
  console.log(`Blacklister:   ${blacklisterAddress}`);

  if (
    !proxyAdminAddress ||
    !ownerAddress ||
    !masterMinterAddress ||
    !pauserAddress ||
    !blacklisterAddress
  ) {
    throw new Error(
      "PROXY_ADMIN_ADDRESS, OWNER_ADDRESS, MASTERMINTER_ADDRESS, PAUSER_ADDRESS, and BLACKLISTER_ADDRESS must be provided in config.js"
    );
  }

  console.log("Deploying implementation contract...");
  await deployer.deploy(FiatTokenV1);
  const fiatTokenV1 = await FiatTokenV1.deployed();
  console.log("Deployed implementation contract at", FiatTokenV1.address);

  console.log("Initializing implementation contract with dummy values...");
  await fiatTokenV1.initialize(
    "",
    "",
    "",
    0,
    THROWAWAY_ADDRESS,
    THROWAWAY_ADDRESS,
    THROWAWAY_ADDRESS,
    THROWAWAY_ADDRESS
  );

  console.log("Deploying proxy contract...");
  await deployer.deploy(FiatTokenProxy, FiatTokenV1.address);
  const fiatTokenProxy = await FiatTokenProxy.deployed();
  console.log("Deployed proxy contract at", FiatTokenProxy.address);

  console.log("Reassigning proxy contract admin...");
  // need to change admin first, or the call to initialize won't work
  // since admin can only call methods in the proxy, and not forwarded methods
  await fiatTokenProxy.changeAdmin(proxyAdminAddress);

  console.log("Initializing proxy contract...");
  // Pretend that the proxy address is a FiatTokenV1 - this is fine because the
  // proxy will forward all the calls to the FiatTokenV1 impl
  const proxyAsV1 = await FiatTokenV1.at(FiatTokenProxy.address);
  await proxyAsV1.initialize(
    "USD//C",
    "USDC",
    "USD",
    6,
    masterMinterAddress,
    pauserAddress,
    blacklisterAddress,
    ownerAddress
  );
};
