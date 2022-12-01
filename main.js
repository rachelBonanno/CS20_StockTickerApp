var http = require('http');
const fs = require("fs");
var qs = require('querystring');
const {MongoClient} = require("mongodb");
const uri = "mongodb+srv://user:ZqP6eA$4qv6y5MA@equities.lx3addr.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

http.createServer(async function (req, res) {
    console.log("made it into create server");
    if (req.url == "/") {
        file = 'index.html';
        fs.readFile(file, function(err, txt) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(txt);
            res.end();
        });
    } else if (req.url == "/process") {
        await connect();
        file = 'output.html';
        fs.readFile(file, async function (err, txt) {
            res.writeHead(200, {'Content-Type':'text/html'});
            res.write (txt);
            pdata = "";
            req.on('data', data => {
                pdata += data.toString();
            });

            // when complete POST data is received
            req.on('end', () => {
                pdata = qs.parse(pdata);
                searchdata(pdata['theinput'], res, pdata['p_or_d'] === "company");
            });
        });

    } else {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write ("Unknown page request");
        res.end();
    }
}).listen(8080);

function searchdata(query, res, comp) {
    const database = client.db("stoker");
    const equities = database.collection("equities");

    equities.find(comp ? {"name": query} : {"ticker": query + "\r"}).toArray(async function (err, result) {
        if (err) {
            throw err;
        }

        console.log(result);

        if (result.length === 0) {
            res.write("No results for: " + query);
        }

        await client.close();
        for (let i = 0; i < result.length; i++) {
            res.write("Name: " + result[i].name);
            res.write("-----Ticker: " + result[i].ticker);
            res.write("<br>");
        }

        res.end();
    });
}

async function connect() {
    await client.connect();
    await client.db("stoker").command({ping: 1});
    console.log("Connected successfully to server");
}