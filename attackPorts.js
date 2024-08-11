/**
 * @param {NS} ns
 * Attack a target with all owned programs
 * @argument {string} ns.args[0] - The target server to attack.
 * @example "run attackPorts.js n00dles"
 */
export async function main(ns) {
    const target = ns.args[0];
    const programsToRun = []; // Array to store the programs to run
    const allocateRam = []; // Array to store the RAM needed to run the programs
    const success = []; // Array to store the successful programs
    let curProgram; // Current program being checked
  
    // List of all programs
    const programs = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe", "NUKE.exe"];
  
    // Make sure a target was input
    if (target) {
      try {
        // Get the programs available to us, calculate the RAM, and add them to the arrays
        for (let program of programs) {
          if (ns.fileExists(program)) {
            curProgram = program;
  
            // parse the program name to remove the .exe extension
            const func = program.split(".")[0].toLowerCase();
  
            // Get the RAM cost of the program
            const ram = ns.getFunctionRamCost(func);
  
            // Add the program and RAM to the arrays
            programsToRun.push(func);
            allocateRam.push(ram);
          }
        }
      } catch (err) {
        ns.tprint(`Error while calculating script/RAM for [${curProgram}]: ${err}`);
      }
  
      // Override the RAM usage to allocate whats needed to run the owned scripts
      try {
        ns.ramOverride(Math.ceil(allocateRam.reduce((acc, cur) => acc + cur, 0) * 10));
      } catch (err) {
        ns.tprint(`Error overriding RAM: ${err}`);
      }
  
      // Run the scripts on the target server
      runScript(ns, programsToRun, target, success);
  
      ns.tprint(`The following programs: [${success.join(", ")}] were successfully ran on ${target}.`);
    } else {
      ns.tprint("Failed: Please provide a target to attack. (ex. n00dles)");
    }
  }
  
  /**
   * Runs the specified scripts on the target server.
   * @param {NS} ns - Reference to the ns object.
   * @param {string[]} exeArray - Array of scripts to run.
   * @param {string} target - The target server to run the scripts on.
   * @param {string[]} successArray - Array to store the successful scripts.
   */
  function runScript(ns, exeArray, target, successArray) {
    for (let exe of exeArray) {
      try {
        // Using bracket notation here to dynamically call the function
        ns[exe](target);
  
        // Add the successful script to the success array
        successArray.push(exe);
  
        ns.tprint(`Successfully ran script [${exe}.exe] on ${target}.`);
      } catch (err) {
        ns.tprint(`Error running script [${exe}.exe]: ${err}`);
      }
    }
  }
  