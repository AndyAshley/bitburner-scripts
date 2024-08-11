/**
 * @param {NS} ns
 * Attacks a server by hacking, growing, or weakening it based on its current state.
 * @argument {string} ns.args[0] - The target server to hack.
 * @argument {number} ns.args[1] - The number of threads to use.
 * @example "run subServerHack.js -t 12000 foodnstuff 12000"
 */
export async function main(ns) {
  const target = ns.args[0];
  const availableThreads = ns.args[1];
  const serverMaxMoney = ns.getServerMaxMoney(target);
  const minSecLvl = ns.getServerMinSecurityLevel(target);
  const moneyThresh = serverMaxMoney * 0.75; // 75% of max money
  const secThresh = minSecLvl + 5; // 5 above min security level
  const now = new Date();
  const fileName = `Log_${now.getUTCDate()}.txt`;

  if (availableThreads === null || availableThreads === undefined) {
    ns.tprint("You must input the servers max threads as a second argument.");
    return;
  }

  while (true) {
    const serverCurMoney = ns.getServerMoneyAvailable(target);
    const secLvl = ns.getServerSecurityLevel(target);

    ns.printf("Server Current Money: %s | Security Level: %s", serverCurMoney, secLvl);

    try {
      switch (true) {
        case secLvl > secThresh:
          // Weaken the server if the security level is higher than the threshold
          ns.print(`Current Security Level: ${secLvl}. Executing Weaken.`);
          await ns.weaken(target);
          break;

        case serverCurMoney < moneyThresh:
          // Grow the server if the money is less than the threshold
          // If the server has 0 money the multiplier would be infinite, so we set it to 1 to avoid errors
          let multiplier = serverCurMoney === 0 ? 1 : Math.ceil(moneyThresh / serverCurMoney);
          let growThreads = ns.growthAnalyze(target, multiplier);
          ns.write(fileName, `${(multiplier, growThreads)}`, "a");

          // If the optimal threads are greater than the available threads, we need to adjust the multiplier
          if (growThreads > availableThreads) {
            multiplier = serverCurMoney === 0 ? 1 : (availableThreads / growThreads) * multiplier;
            growThreads = availableThreads;
          }

          const growData = { threads: Math.ceil(growThreads) };
          ns.print(
            `Current Money: ${serverCurMoney}. Executing Grow with a multiplier of ${multiplier} @ ${growThreads} threads.`
          );
          await ns.grow(target, growData);
          break;

        default:
          // Hack the server
          const hackThreads = ns.hackAnalyzeThreads(target, moneyThresh);
          const hackData = { threads: Math.ceil(hackThreads) };
          ns.print(
            `Current Money: ${serverCurMoney}, Security Level: ${secLvl}. Executing Hack with ${hackThreads} threads.`
          );
          await ns.hack(target, hackData);
          break;
      }

      // Wait a bit between actions to allow server status updates
      await ns.sleep(2000);
    } catch (e) {
      // Log any errors to the file
      ns.write(fileName, e, "a");
      break;
    }
  }
}
