/**
 * @param {NS} ns
 * Attempts to make copies of the specified files to a server
 * @argument {String} ns.args[0] - toServer: The Specified Server.
 * @argument {String} ns.args[1] - files: The files to copy.
 * @argument {String} ns.args[2] - fromServer: The server to copy from. Default is home.
 */
export async function main(ns) {
  const toServer = ns.args[0];
  const files = ns.args[1] ? [ns.args[1]] : ["subServerHack.js", "servers.js"];
  const fromServer = ns.args[2] ? ns.args[2] : "home";

  try {
    ns.scp(files, toServer, fromServer);
    ns.tprint(`Successfully copied files: ${files.join(",")} to Server [${toServer}] from home.`);
  } catch (error) {
    return ns.tprint(`Error copying files: ${error}`);
  }
}
