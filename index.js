const {MongoClient} = require("mongodb");

// Connection URI
const uri =
    "mongodb+srv://user:ZqP6eA$4qv6y5MA@equities.lx3addr.mongodb.net/?retryWrites=true&w=majority";

// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Establish and verify connection
    await client.db("stocks").command({ping: 1});
    console.log("Connected successfully to server");
}


async function insert(name, ticker) {

    const database = client.db("stoker");
    const equities = database.collection("equities");
    const doc = {
        name: name,
        ticker: ticker,
    }
    const result = await equities.insertOne(doc);

    console.log(`A document was inserted with the _id: ${result.insertedId}`);

}


async function readData() {
    await run()

    var fs = require('fs'),
        path = './companies.csv';

    await fs.readFile(path, {encoding: 'utf-8'}, async function (err, data) {
        var array = data.split("\n");
        for (let i = 1; i < array.length; i++) {
            var line = array[i].split(",")
            console.log(line)
            await insert(line[0], line[1])
        }
        await client.close();

    });
}

readData()



