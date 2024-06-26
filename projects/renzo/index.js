const L1_EZ_ETH_ADDRESS = "0xbf5495Efe5DB9ce00f80364C8B423567e58d2110";
const L2_EZ_ETH_ADDRESS = "0x2416092f143378750bb29b79eD961ab195CcEea5";
const L1_LOCKBOX_ADDRESS = "0xC8140dA31E6bCa19b287cC35531c2212763C2059";

async function L2Tvl(_, _b, _cb, { api, }) {
  return {
    [L1_EZ_ETH_ADDRESS]: await api.call({ target: L2_EZ_ETH_ADDRESS, abi: "erc20:totalSupply" })
  }
}

async function ethTvl(_, _b, _cb, { api, }) {
  const totalTvl = await api.call({ target: L1_EZ_ETH_ADDRESS, abi: "erc20:totalSupply" });
  const lockBoxBalance = await api.call({ target: L1_EZ_ETH_ADDRESS, abi: "erc20:balanceOf", params: [L1_LOCKBOX_ADDRESS] })
  api.add(L1_EZ_ETH_ADDRESS, totalTvl - lockBoxBalance)
}

const chains = ["mode", "blast", "bsc", "linea", "arbitrum"]

module.exports = {
  doublecounted: true,
  ethereum: {
    tvl: ethTvl,
  }
}

chains.forEach(chain => {
  module.exports[chain] = { tvl: L2Tvl }
})