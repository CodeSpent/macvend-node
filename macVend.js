// Dependencies
const readline = require('readline-sync');
const request = require("request");
const figlet = require('figlet');
const colors = require('colors');
const chalk = require('chalk');
const ping = require('ping');

// Get ENV config
require('dotenv').config();

// Use our keys
const macVendorKey_Primary = process.env.MACVENDOR_KEY1;
const macVendorKey_Fallback = process.env.MACVENDOR_KEY2;


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
            figlet.textSync('macVend', { horizontalLayout: 'full' })
        )
    );
    console.log(chalk.yellow('macVend is a light nodejs CLI tool for gathering information based on MAC Address input. \nYou may use this tool from SSH2 as a quick reference with arguments or as a standalone tool. \nTo see a list of arguments use --help'))
    console.log('\r\n');
    console.log(chalk.blue('Author: Patrick Hanford (CodeSpent)'))
    console.log(chalk.blue('Repository: https://localhost/macvend-node'))
    console.log(chalk.blue('Copyright: Patrick Hanford (c) 2018'))
    console.log('\r\n');
    // Start app flow
    macTest();
}

// Verify connectivity of vendor database
function macTest() {
    console.log("Running tests on APIs and fallbacks..".green);
    // Ping hosts in layers. Verify client, host, then API
    var hosts = ['https://api.macvendors.com/'];
    hosts.forEach(function(host) {
        ping.sys.probe(host, function(isAlive) {
            var msg = isAlive ? '### API at '.green + host.blue + ' is online. ###'.green : '### API at  '.red + host.blue + ' is offline. Results may be innaccurrate. ###'.red;
            console.log(msg);
            getMac();
        });
    });



}
// Get MAC Address input from user
function getMac() {

    var mac = readline.question("Enter MAC Address: ".blue);
    var confirmation =
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
            console.error("Sorry, ".red + mac + " does not seem to be a valid MAC Address. Please check again, and verify there are no empty spaces if you copied this from the device.".red);

            // Loop back to allow another request to be made
            getMac();
        }
        // If no errors, parse the JSON
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);


            // Retreive data objects
            var resData = info.data;
            var assignment = resData.assignment;
            var org = resData.organization_name
            var address = resData.organization_address;
            var registry = resData.registry;

            // Write the requested data to the console
            console.log("The MAC Address you provided: " + mac.green);
            console.log("The Manufacturer for this device is " + org.green);
            console.log("The Manufacturer Location is " + address.green);
            console.log("The registry value for this device is " + registry.green);

            getMac();

        }
    }

    request(options, callback);
}


macVend();
