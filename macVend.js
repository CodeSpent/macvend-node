#!/usr/bin/env node

// Dependencies
const readline = require('readline-sync');
const request = require("request");
const figlet = require('figlet');
const chalk = require('chalk');
const ping = require('ping');
const program = require('commander');

// Get ENV config
require('dotenv').config();

// Use our keys
const macVendorKey_Primary = process.env.MACVENDOR_KEY1;
const macVendorKey_Fallback = process.env.MACVENDOR_KEY2;

// Declare logic options 
const arg1 = process.argv[1];
const arg2 = process.argv[2];
const arg3 = process.argv[3];
const arg4 = process.argv[4];

program
    .version('0.1.0')
    .description('Any option with an *(asterick) next to it is considered incomplete, unadded, or not yet stable.')
    .option('-s, --start', 'start macVend with default options')
    .option('-e, --exclusive', '*exclusively get <attribute> of vendor | macvend -e [name, org, address, assignment]')
    .option('-m, --mac', 'specify the mac address for lookup | macvend -m [mac-address]')
    .option('-t, --test', '*runs a series of tests')
    .option('-p, --ping', '*pings a host if new data sources are added')
    .option('-d, --dev', '*opens a dev sandbox to test new functions')
    .option('-S, --stats', 'displays information about application and system')
    .option('-os, --override-styles', '*overrides all terminal styles')
    .option('-r, --reverse', '*allows you to search for prefixes by vendor | macvend -r [samsung, xerox, cisco]')
    .option('-u, --update', '*performs update on application and databases')
    .option('-l, --log', '*forces all output to be written to a log file you specifiy | macvend -l my-log.txt')
    .option('-b, --batch', '*allows input of multiple mac addresses | macvend -b [mac1, mac2, mac3, mac4]')

program.parse(process.argv);
if (program.test) macTest();

// Write logic
if (program.start) macVend();
if (program.mac) hasMac();
if (program.dev) devSession();
if (program.exclusive) excMode();
if(program.stats) stats();




// Init functions and log process
// IMPORTANT: This should only be on initial run to prevent clearing of data received
function macVend() {
    // Clear console first
    var lines = process.stdout.getWindowSize()[1];
    for (var i = 0; i < lines; i++) {
        console.log('\r\n');
    }
    // Write headings
    console.log(
        chalk.blue(
            figlet.textSync('macVend', {
                horizontalLayout: 'full'
            })
        )
    );
    console.log(chalk.yellow('macVend is a light nodejs CLI tool for gathering information based on MAC Address input. \nYou may use this tool from SSH2 as a quick reference with arguments or as a standalone tool. \nTo see a list of arguments use --help'))
    console.log('\r\n');
    console.log(chalk.blue('Author: Patrick Hanford (CodeSpent)'))
    console.log(chalk.blue('Repository: https://github.com/CodeSpent/macvend-node'))
    console.log('\r\n');
    // Start app flow
    getMac();
}

// Verify connectivity of vendor database
function macTest() {
    console.log.chalk.blue("Running tests on APIs and fallbacks..");
    console.log("\n");
    var hosts = ['https://api.macvendors.com/'];
    hosts.forEach(function (host) {
        ping.sys.probe(host, function (isAlive) {
            var msg = isAlive ? '### API at ' + host + ' is online. ###' : '### API at  ' + host + ' is offline. Results may be innaccurrate. ###';
            console.log(chalk.green(msg));
        });
    });

}
// Has MAC Address
function hasMac() {
    var mac = arg3;
    getVend(mac, arg3);
}

// Get MAC Address input from user
function getMac() {

    var mac = readline.question(chalk.green("Enter MAC Address: "));
    getVend(mac);
}

// Send MAC Address to database for query
function getVend(mac) {
    var options = {
        url: 'https://api.macvendors.com/v1/lookup/' + mac,
        headers: {
            'User-Agent': 'request',
            'Authorization': 'Bearer ' + macVendorKey_Primary
        }
    };

    // Use the response
    function callback(error, response, body) {
        // Get the HTTP Status Code from response
        console.log("HTTP Status: " + response.statusCode);

        // If 404, we know the MAC Address is not listed in the DB.
        if (!error && response.statusCode == 404) {
            console.error(chalk.red("Sorry, " + mac + " does not seem to be a valid MAC Address. Please check again, and verify there are no empty spaces if you copied this from the device."));

            // Loop back only if mac was not provided from an option arg
            if (arg3 === undefined) {
                getMac();
            }
        }
        // If no errors, parse the JSON
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);


            // Retreive data objects
            var resData = info.data;
            var org = resData.organization_name
            var address = resData.organization_address;
            var registry = resData.registry;

            // Write the requested data to the console
            console.log(chalk.green("The MAC Address you provided: ") + mac);
            console.log(chalk.green("The Manufacturer for this device is ") + org);
            console.log(chalk.green("The Manufacturer Location is ") + address);
            console.log(chalk.green("The registry value for this device is ") + registry);

            // Loop back if entered through readline
            if (arg3 === undefined) {
                getMac();
            }
        }
    }

    request(options, callback);
}


// Open Dev session, add new functions below
function devSession() {
    var pjson = require('./package.json');
    console.log(chalk.underline.blue('### Dev Session Open ###'));
    console.log('\n\r');

    console.dir(pjson);
}

function stats() {
    var pjson = require('./package.json');
    console.log(chalk.underline.blue('####### macVend Statistics #######'));
    console.log('macVend Version: '+ pjson.version);
    console.log('Author: '+ pjson.author);
    console.log('\n\r');
    console.log(chalk.blue('Application Information:'));
    console.log('bin: '+ pjson.bin);
    console.log('preferGlobal: ' + pjson.preferGlobal);
    console.log('Dependencies: ');
    console.dir(pjson.dependencies);
    console.log('\n\r');

    console.log(chalk.blue('Current System Information:'));
    console.log('NodeJS Version: '+ process.version);
    console.log('Current Platform: '+ process.platform);
    console.log('Environment Variables: '+ process.env);
    console.log('Process Uptime: '+ process.uptime());
    console.log('\n\r');
    console.log('All Versions');
    console.log(process.versions);
}