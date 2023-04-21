const ganache = require("ganache-cli");

const options = {
  default_balance_ether: 100, // Initial ether balance for each account (in ether)
  total_accounts: 10, // Number of accounts to generate
  network_id: 0, // INSERT YOUR Network ID
  mnemonic: "INSERT YOUR LOCAL GANACHE MNEMOIC PHRASE", // Mnemonic for generating accounts
};

const server = ganache.server(options);
server.listen(7545, "127.0.0.0", (err, blockchain) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("Ganache is running on http://127.0.0.0:7545");
});
