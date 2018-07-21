# macVend

macVend is a small CLI focused tool for referencing Mac Address vendor information for the purpose of identifying devices on a given network or determing origin of internal components. This tool does not save requests or input, and retrieves data from the MAC Vendor Lookup API located at https://macvendors.com/.

![Imgur](https://i.imgur.com/47hFoxB.png)

## Getting Started

# Accepted MAC Address Formats

Send your MAC address in any shape or form. Generally, MAC addresses will come in the following shape or form:

    00-11-22-33-44-55
    00:11:22:33:44:55
    00.11.22.33.44.55
    001122334455
    0011.2233.4455


### Prerequisites

* [NodeJS](https://nodejs.org/en/download/)
* [DotEnv](https://www.npmjs.com/package/dotenv)

##### For Terminal Styles
* [Chalk](https://www.npmjs.com/package/chalk)
* [Colors](https://www.npmjs.com/package/colors)
* [Figlet](https://www.npmjs.com/package/figlet)

##### For Host Status Checks
* [Ping](https://www.npmjs.com/package/ping)

##### For Request Handling
* [Request](https://www.npmjs.com/package/request)
* [Querystring](https://www.npmjs.com/package/querystring)

### Terminal Stlying & Conditionals
*Will go over styling examples upon deciding between Chalk or Colors for terminal styling.*

## Installing
```
git clone https://github.com/CodeSpent/macvend-node.git
cd macvend-node
npm install
node macVend.js
```

## Built With

* [NodeJS](https://nodejs.org/en/) - Runtime used
* [SecureCRT](https://www.vandyke.com/products/securecrt/) - Telnet/SSH client initially designed for


## Authors

* **Patrick Hanford** - *Initial Development* - [CodeSpent](https://github.com/CodeSpent)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

*This readme is incomplete in its current state. Please considering watching this repository to keep up with changes to features, documentation, and updates to dependencies.*

