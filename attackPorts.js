/**
 * @param {NS} ns
 * Attack a target with all owned programs
 * @argument {string} ns.args[0] - The target to attack.
 * @example "run attackPorts.js n00dles"
 */
export async function main(ns) {
  const target = ns.args[0];

  /* Unfortunately, we have to input each function here so BitBurner can allocate ram.  If we try doing
    something like parsing the name to remove the .exe and calling ns[parsedName](target) dynamically, 
    BitBurner will error because of static RAM allocation */
  const programs = [
    { name: "BruteSSH.exe", func: ns.brutessh },
    { name: "FTPCrack.exe", func: ns.ftpcrack },
    { name: "relaySMTP.exe", func: ns.relaysmtp },
    { name: "HTTPWorm.exe", func: ns.httpworm },
    { name: "SQLInject.exe", func: ns.sqlinject },
    { name: "NUKE.exe", func: ns.nuke },
  ];

  const success = [];

  // Make sure a target was input
  if (target) {
    for (let program of programs) {
      // If we own the file, run it and add it to the success array
      if (ns.fileExists(program.name)) {
        program.func(target);
        success.push(program.name);
      }
    }

    ns.tprint(`The following programs: [${success.join(", ")}] were successfully ran on ${target}.`);
  } else {
    ns.tprint("Failed: Please provide a target to attack. (ex. n00dles)");
  }

  return;
}
