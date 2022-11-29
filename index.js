async function database_collection() {
    //connects to database
    const url_connect = "mongodb+srv://user:ZqP6eA$4qv6y5MA@equities.lx3addr.mongodb.net/?retryWrites=true&w=majority";
    const {MongoClient} = require('mongodb');
    const client = new MongoClient(url_connect,{ useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await data_reading(client);
    }
    catch(err) {
        console.log("Database error: " + err);
    }
    finally {
        client.close();
    }
}

async function data_reading(client) {
    var readline = require('readline');
    var fs = require('fs');
    const {connect} = require ('http');

    var myFile = readline.createInterface({
        input: fs.createReadStream('companies.csv')
    });
    // sets a counter to read the top of the file
    var amount = 0;

    //reads file line by line
    myFile.on('line', function (line) {
        var company_name = "";
        var stock_ticker = "";

        //iterates through the file
        if (amount > 0) {

        } else {

        }
        console.log('"' +  line + '" has ' + line.length + ' characters');
    });

}