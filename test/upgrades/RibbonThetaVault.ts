import { assert } from "chai";
import { ethers, network } from "hardhat";
import { parseLog } from "../helpers/utils";

const { parseEther } = ethers.utils;

const UPGRADE_ADMIN = "0x223d59FA315D7693dF4238d1a5748c964E615923";
const ADMIN_SLOT =
  "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103";
const IMPLEMENTATION_SLOT =
  "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";

// UPDATE THESE VALUES BEFORE WE ATTEMPT AN UPGRADE
const FORK_BLOCK = 13280723;
const NEW_IMPLEMENTATION = "0xc4d1009dFF06a63a5548eCFEaf0942D45CF027c5";

interface StorageValues {
  totalSupply: string;
  name: string;
  symbol: string;
  vaultParams1: string;
  vaultParams2: string;
  cap: string;
  vaultState1: string;
  vaultState2: string;
  optionState: string;
  feeRecipient: string;
  keeper: string;
  performanceFee: string;
  managementFee: string;
  optionsPremiumPricer: string;
  strikeSelection: string;
  premiumDiscount: string;
  currentOtokenPremium: string;
  lastStrikeOverrideRound: string;
  overriddenStrikePrice: string;
  auctionDuration: string;
  optionAuctionID: string;
}

describe("RibbonThetaVault upgrade", () => {
  before(async function () {
    // We need to checkpoint the contract on mainnet to a past block before the upgrade happens
    // This means the `implementation` is pointing to an old contract
    await network.provider.request({
      method: "hardhat_reset",
      params: [
        {
          forking: {
            jsonRpcUrl: process.env.TEST_URI,
            blockNumber: FORK_BLOCK,
          },
        },
      ],
    });

    // Fund & impersonate the admin account
    const [userSigner] = await ethers.getSigners();

    await userSigner.sendTransaction({
      to: UPGRADE_ADMIN,
      value: parseEther("3"),
    });

    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [UPGRADE_ADMIN],
    });
  });

  checkIfStorageNotCorrupted("0x25751853Eab4D0eB3652B5eB6ecB102A2789644B", {
    totalSupply:
      "0x00000000000000000000000000000000000000000000001032666f9c7ded91ad",
    name: "0x526962626f6e20455448205468657461205661756c740000000000000000002c", // Ribbon ETH Theta Vault
    symbol:
      "0x724554482d544845544100000000000000000000000000000000000000000014", // symbol - rETH-THETA
    vaultParams1:
      "0x00000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc21200",
    vaultParams2:
      "0x0000000000000002540be400c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    cap: "0x00000000000000000000000000000000000000000000001043561a8829300000",
    vaultState1:
      "0x00000000000000000029a2241af62c0000000000001041977f5dffc4591e0003",
    vaultState2:
      "0x00000000000000043b326bbc98632b9800000000000000000000000000000000",
    optionState:
      "0x0000000000000000614478adddf0a15cf01b92fbfb0bc5ef91e4c52a28d11c43",
    feeRecipient:
      "0x000000000000000000000000daeada3d210d2f45874724beea03c7d4bbd41674",
    keeper:
      "0x000000000000000000000000a4290c9eae274c7a8fbc57a1e68adc3e95e7c67e",
    performanceFee:
      "0x0000000000000000000000000000000000000000000000000000000000989680",
    managementFee:
      "0x00000000000000000000000000000000000000000000000000000000000095d4",
    optionsPremiumPricer:
      "0x000000000000000000000000ec58c11aa55836c896b80a9d8032e39eeb525cbc",
    strikeSelection:
      "0x00000000000000000000000039d3799b8abefc3d05db5ba3b3b2770146475000",
    premiumDiscount:
      "0x00000000000000000000000000000000000000000000000000000000000000c8",
    currentOtokenPremium:
      "0x0000000000000000000000000000000000000000000000000009afba6bef0400",
    lastStrikeOverrideRound:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    overriddenStrikePrice:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    auctionDuration:
      "0x0000000000000000000000000000000000000000000000000000000000000e10",
    optionAuctionID:
      "0x0000000000000000000000000000000000000000000000000000000000000035",
  });

  checkIfStorageNotCorrupted("0x65a833afDc250D9d38f8CD9bC2B1E3132dB13B2F", {
    totalSupply:
      "0x0000000000000000000000000000000000000000000000000000000093dfa673",
    name: "0x526962626f6e20425443205468657461205661756c740000000000000000002c", // Ribbon BTC Theta Vault
    symbol:
      "0x724254432d544845544100000000000000000000000000000000000000000014", // symbol - rBTC-THETA
    vaultParams1:
      "0x000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c5990800",
    vaultParams2:
      "0x0000000000000000000003e82260fac5e5542a773aa44fbcfedf7c193bc2c599",
    cap: "0x000000000000000000000000000000000000000000000000000000009502f900",
    vaultState1:
      "0x0000000000000000000000000001509570000000000000000000946b89070003",
    vaultState2:
      "0x0000000000000000000000001da5394f000000000000000000000000002bcbca",
    optionState:
      "0x0000000000000000614478adeec7e166d6f36f6f690b86738ebd60dfc3c92548",
    feeRecipient:
      "0x000000000000000000000000daeada3d210d2f45874724beea03c7d4bbd41674",
    keeper:
      "0x000000000000000000000000a4290c9eae274c7a8fbc57a1e68adc3e95e7c67e",
    performanceFee:
      "0x0000000000000000000000000000000000000000000000000000000000989680",
    managementFee:
      "0x00000000000000000000000000000000000000000000000000000000000095d4",
    optionsPremiumPricer:
      "0x000000000000000000000000d8bb660a8fcaeadb7a7aef73e57a3a989065dacc",
    strikeSelection:
      "0x0000000000000000000000005e68b6f5c82fc5f3711541ca4a12e01b967fc641",
    premiumDiscount:
      "0x00000000000000000000000000000000000000000000000000000000000000c8",
    currentOtokenPremium:
      "0x000000000000000000000000000000000000000000000000000a0dfdebbc9c00",
    lastStrikeOverrideRound:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    overriddenStrikePrice:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    auctionDuration:
      "0x0000000000000000000000000000000000000000000000000000000000000e10",
    optionAuctionID:
      "0x0000000000000000000000000000000000000000000000000000000000000036",
  });
});

function checkIfStorageNotCorrupted(
  vaultAddress: string,
  storageValues: StorageValues
) {
  const {
    totalSupply,
    name,
    symbol,
    vaultParams1,
    vaultParams2,
    cap,
    vaultState1,
    vaultState2,
    optionState,
    feeRecipient,
    keeper,
    performanceFee,
    managementFee,
    optionsPremiumPricer,
    strikeSelection,
    premiumDiscount,
    currentOtokenPremium,
    lastStrikeOverrideRound,
    overriddenStrikePrice,
    auctionDuration,
    optionAuctionID,
  } = storageValues;

  const getVaultStorage = async (storageIndex: number | string) => {
    return await ethers.provider.getStorageAt(vaultAddress, storageIndex);
  };

  const storageLayout = [
    [
      ADMIN_SLOT,
      "0x000000000000000000000000223d59fa315d7693df4238d1a5748c964e615923",
    ],
    [
      IMPLEMENTATION_SLOT,
      "0x000000000000000000000000c4d1009dff06a63a5548ecfeaf0942d45cf027c5",
    ],
    [0, "0x0000000000000000000000000000000000000000000000000000000000000001"], // initializable
    [1, "0x0000000000000000000000000000000000000000000000000000000000000001"], // reentrancy
    [101, "0x00000000000000000000000077da011d5314d80be59e939c2f7ec2f702e1dcc4"], // owner
    [153, totalSupply], // totalSupply
    [154, name], // name
    [155, symbol], // symbol
    [204, vaultParams1],
    [205, vaultParams2],
    [206, cap],
    [207, vaultState1],
    [208, vaultState2],
    [209, "0x0000000000000000000000000000000000000000000000000000000000000000"],
    [210, optionState],
    [211, feeRecipient], // feeRecipient
    [212, keeper], // keeper
    [213, performanceFee], // performanceFee
    [214, managementFee], // managementFee
    [245, optionsPremiumPricer], // optionsPremiumPricer
    [246, strikeSelection], // strikeSelection
    [247, premiumDiscount], // premiumDiscount
    [248, currentOtokenPremium], // currentOtokenPremium
    [249, lastStrikeOverrideRound], // lastStrikeOverrideRound
    [250, overriddenStrikePrice], // overriddenStrikePrice
    [251, auctionDuration], // auctionDuration
    [252, optionAuctionID], // optionAuctionID
  ];

  describe(`Vault ${vaultAddress}`, () => {
    it("has the correct initial storage state", async () => {
      const vaultProxy = await ethers.getContractAt(
        "AdminUpgradeabilityProxy",
        vaultAddress
      );
      const adminSigner = await ethers.provider.getSigner(UPGRADE_ADMIN);

      const res = await vaultProxy
        .connect(adminSigner)
        .upgradeTo(NEW_IMPLEMENTATION);

      const receipt = await res.wait();

      const log = await parseLog("AdminUpgradeabilityProxy", receipt.logs[0]);
      assert.equal(log.args.implementation, NEW_IMPLEMENTATION);
      assert.equal(
        await getVaultStorage(IMPLEMENTATION_SLOT),
        "0x000000000000000000000000" + NEW_IMPLEMENTATION.slice(2).toLowerCase()
      );

      // Now we verify that the storage values are not corrupted
      for (let i = 0; i < storageLayout.length; i++) {
        const [index, value] = storageLayout[i];
        assert.equal(
          await getVaultStorage(index),
          value,
          `Mismatched value at index ${index}`
        );
      }
    });
  });
}