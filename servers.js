/**
 * Handles server management for various tasks such as purchasing, upgrading, and renaming servers.
 * @param {*} ns - The Bitburner Netscript environment.
 * @argument {string} ns.args[0] - The action to take ("purchase", "purchase-price", "upgrade", "upgrade-cost", "rename").
 * @argument {string} [ns.args[1] - The name of the server for actions like purchase, upgrade, and rename.
 * @argument {number} [ns.args[2] - The amount of RAM to purchase or upgrade to.
 * @argument {string} [ns.args[3] - The name of the server to rename.
 * @argument {string} [ns.args[4] - The new name of the server to rename.
 * @example "run servers.js upgrade-cost myServer 2048"
 */
export async function main(ns) {
  let name = ns.args[1];
  let ram = ns.args[2];
  let serverToRename = ns.args[3];
  let newServerName = ns.args[4];

  switch (ns.args[0]) {
    case "purchase":
      ns.purchaseServer(name, ram);
      break;
    case "purchase-price":
      const serverCost = ns.getPurchasedServerCost(ram);
      ns.tprint(`The cost to purchase a new server with ${ram}GB of RAM is: \$${formatNumber(serverCost)}`);
      break;
    case "upgrade":
      ns.upgradePurchasedServer(name, ram);
      break;
    case "upgrade-cost":
      const upgradeCost = ns.getPurchasedServerUpgradeCost(name, ram);
      const curRam = ns.getServerMaxRam(name);
      ns.tprint(`Cost to upgrade server [${name}] from ${curRam}GB to ${ram}GB: \$${formatNumber(upgradeCost)}`);
      break;
    case "rename":
      ns.renamePurchasedServer(serverToRename, newServerName);
      ns.tprint(`Renaming server [${serverToRename}] to [${newServerName}]`);
      break;
    case "help":
      ns.tprint(
        `\nUsage:\n` +
          `  purchase [name] [ram] - Purchase a server with the specified name and amount of RAM.\n` +
          `  purchase-price [ram] - Display the cost to purchase a server with the specified amount of RAM.\n` +
          `  upgrade [name] [ram] - Upgrade a server with the specified name to the specified amount of RAM.\n` +
          `  upgrade-cost [name] [ram] - Display the cost to upgrade a server to the specified amount of RAM.\n` +
          `  rename [null] [null] [oldName] [newName] - Rename a server from oldName to newName.`
      );
      break;
    default:
      ns.tprint("No arguments supplied, or invalid argument. Type 'run servers.js help' for arguments.");
      break;
  }
}

// hoisted fn
/**
 * Formats a number to a friendly version and round to two decimal places.
 * @param {number} num - The number to format.
 */
function formatNumber(num) {
  if (num < 1e3) return num.toFixed(2);
  const units = ["k", "M", "B", "T", "q"];
  let unitIndex = -1;
  do {
    num /= 1e3;
    unitIndex++;
  } while (num >= 1e3 && unitIndex < units.length - 1);
  return `${num.toFixed(2)}${units[unitIndex]}`;
}
