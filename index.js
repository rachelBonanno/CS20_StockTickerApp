//connects to database
const {MongoClient} = require('mongodb');
const url_connect = 'mongodb+srv://user:ZqP6eA$4qv6y5MA@equities.lx3addr.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url_connect);


async function database_collection() {
    try {
        await data_reading();
    }
    catch(error) {
        console.log("Database error: " + error);
    }
    finally {
        await client.close();
    }
}

async function data_reading() {
    await client.connect();

    var readline = require('readline');
    var fs = require('fs');
    const { connect } = require ('http');

    var myFile = readline.createInterface({
        input: fs.readFile('./companies.csv')
    });

    // sets a counter to read the top of the file
    var amount = 0;

    // bool says if it is a name or stock ticker by making
    // the company name a false value and the stock ticker
    // the true value
    var name_or_ticker = false;

    //reads file line by line
    myFile.on('line', function (line) {
        var company_name = "";
        var stock_ticker = "";

        //iterates through the file
        if (amount > 0) {
            for (let i = 0; i < line.length; i++) {
                if (line[i] === ',') {
                    name_or_ticker = true;
                    continue;
                }
                if (name_or_ticker === false) {
                    company_name += name_or_ticker[i];
                } else {
                    stock_ticker += name_or_ticker[i];
                }
            }
            var json_data = {"company name" : company_name, "stock ticker" : stock_ticker};
            adddbdata(json_data, client);

            // reset the data holders
            company_name = "";
            stock_ticker = "";
            name_or_ticker = false;
        }
        amount++;
    });
}

async function adddbdata(json_data, client) {
    const collection = client.db('stoker').collection('equities');
    await collection.insertOne(json_data, function(error) {
        if (error) {
            throw error;
        }
    });

}

database_collection().catch(console.error);

