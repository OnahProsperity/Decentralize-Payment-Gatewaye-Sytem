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
    proxyAdminAddress = "0x11C5537E028E0B14f0A4D1B4B6ff7804399CDe78";
    ownerAddress = "0xFa9cAEe1F3AaFfaB5bE0A3807677D44E724e026d";
    masterMinterAddress = "0xE5279Fe384CafCfc02e1d85D0857aFC9C20466c5";
    pauserAddress = "0x1FA324546678257a150AB53ccB224c35875587E5";
    blacklisterAddress = "0x791DC4B3bd0918ec710035aDe7fd637ad74C13B5";
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
    "DYCLUDE TOKEN",
    "DYNGN",
    "NGN",
    6,
    masterMinterAddress,
    pauserAddress,
    blacklisterAddress,
    ownerAddress
  );
};

