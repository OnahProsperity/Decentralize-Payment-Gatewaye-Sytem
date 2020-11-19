// Address of the FiatToken Implementation
const fiatTokenAddress = "0x42398FE431aEa841c244995028f5cA0D3b87FF40"; //account 9

// Address of the FiatToken Proxy
const fiatTokenProxyAddress = "0xb0445e74FceED044CEA7d6676900751057f0F7C8"; // account 10

// role addresses
const MASTER_MINTER = 0x7A6e7A18142004Dd8bED03d151423eCE235715BF; //account 5
const PAUSER = 0x7035c255212Dc048095420A361E67b0448Ca876e; // account 7
const UPGRADER = 0x3c296a9D81f43009c51D91a581E358FFd2Eaa8B3; // account 8
const OWNER = 0xE742F01A2a121791d90e07c04911e7f943dcC8b1; // account 2
const BLACKLISTER = 0x2BCd4A0405E865f9A061F32d0Df96A093B1F9BE9; //account 3

// Addresses of known minters - currently fake minters
// If replacing with real minters need to modify printMinterInfo
const minters = ["0x0000", "0x0001"];

const name = "DYCLUDE COIN";
const symbol = "DYNGN";
const currency = "NGN";
const DECIMALS = 6;
const TOTALSUPPLY = 0;
const PAUSED = false;

// Name of current implementation artifact as stored in ./build/contracts/*.json
const FiatTokenV1 = artifacts.require("FiatTokenV1");

// Name of current proxy artifact as stored in ./build/contracts/*.json
artifacts.require("FiatTokenProxy");

//
//
// Validation code
//
//

const adminSlot =
  "a59e5e54223e8d6f7d3c7746862af9c81cd0a23af04979013df99e97862cd181"; //account 9
const implSlot =
  "6132e6ae7cceb6b831df6b2d4feb99ea54e505fe27743e21e4e19e4543ff1e77"; //ACOUNTS [10]

const asyncGetStorageAt = (address, slot) =>
  new Promise((resolve, reject) => {
    web3.eth.getStorageAt(address, slot, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });

async function printMinterInfo(proxiedToken) {
  for (const minter of minters) {
    console.log("\nMinter: " + minter);

    const isMinter = await proxiedToken.isMinter.call(minter);
    print("isMinter", isMinter, false);

    const minterAllowance = await proxiedToken.minterAllowance.call(minter);
    print("mintAllowance", minterAllowance, 0);

    const balanceOf = await proxiedToken.balanceOf.call(minter);
    print("balanceOf", balanceOf, 0);

    const isBlacklisted = await proxiedToken.isBlacklisted.call(minter);
    print("isBlacklisted", isBlacklisted, false);
  }
}

function getAddressFromSlotData(slotData) {
  const rawAddress = slotData.substring(26, 86);
  return "0x" + rawAddress;
}

function compare(actual, expected) {
  if (actual === expected) {
    return "(ok)";
  } else {
    return "(expect " + expected + ")";
  }
}

function print(name, actual, expected) {
  console.log(name + "\t" + actual + "\t" + compare(actual, expected));
}

async function Validate() {
  console.log("Connecting to contract...");
  await FiatTokenV1.at(fiatTokenAddress);
  console.log("Token found.");
  const proxiedToken = await FiatTokenV1.at(fiatTokenProxyAddress);
  console.log("Proxied token created.");

  // initialized needs to retrieved manually
  let slot8Data = await asyncGetStorageAt(proxiedToken.address, 8);
  let initialized = slot8Data.substring(24, 26);
  print("init proxy", initialized, "01");

  slot8Data = await asyncGetStorageAt(fiatTokenAddress, 8);
  initialized = slot8Data.substring(24, 26);
  print("init logic", initialized, "01");

  const name = await proxiedToken.name.call();
  print("name     ", name, NAME);

  const symbol = await proxiedToken.symbol.call();
  print("symbol   ", symbol, SYMBOL);

  const decimals = await proxiedToken.decimals.call();
  print("decimals", decimals, DECIMALS);

  const currency = await proxiedToken.currency.call();
  print("currency", currency, CURRENCY);

  const totalSupply = await proxiedToken.totalSupply.call();
  print("totalSupply", totalSupply, TOTALSUPPLY);

  const paused = await proxiedToken.paused.call();
  print("paused  ", paused, PAUSED);

  // implementation
  const implementation = await asyncGetStorageAt(
    proxiedToken.address,
    implSlot
  );
  print("implement", getAddressFromSlotData(implementation), fiatTokenAddress);

  const admin = await asyncGetStorageAt(proxiedToken.address, adminSlot);
  print("upgrader", getAddressFromSlotData(admin), UPGRADER);

  const owner = await proxiedToken.owner.call();
  print("owner   ", owner, OWNER);

  const masterMinter = await proxiedToken.masterMinter.call();
  print("masterMinter", masterMinter, MASTER_MINTER);

  const pauser = await proxiedToken.pauser.call();
  print("pauser  ", pauser, PAUSER);

  const blacklister = await proxiedToken.blacklister.call();
  print("blacklister", blacklister, BLACKLISTER);

  await printMinterInfo(proxiedToken);
}

module.exports = async (callback) => {
  try {
    await Validate();
  } catch (e) {
    // continue
  }
  callback();
};
