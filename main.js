const {MongoClient} = require("mongodb");
var http = require('http');
const fs = require("fs");
var qs = require('querystring');
// Connection URI
const uri = "mongodb+srv://user:ZqP6eA$4qv6y5MA@equities.lx3addr.mongodb.net/?retryWrites=true&w=majority";
// Create a new MongoClient
const client = new MongoClient(uri);

http.createServer(function (req, res) {
    if (req.url == "/") {
        await connect();
        file = 'index.html';
        fs.readFile(file, function(err, txt) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(txt);
            res.end();
        });
    }
    else if (req.url == "/process") {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write (txt);
        pdata = "";
        req.on('data', data => {
            pdata += data.toString();
        });

        // when complete POST data is received
        req.on('end', () => {
            pdata = qs.parse(pdata);
            searchdata(pdata['the_name'], res, pdata['user'] === "company");
        });

    }
    else {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write ("Unknown page request");
        res.end();
    }
}).listen(8080);

function searchdata(query, res, comp) {
    const database = client.db("stoker");
    const equities = database.collection("equities");

}

async function connect() {
    await client.connect();
    await client.db("stoker").command({ping: 1});
    console.log("Connected successfully to server");
}