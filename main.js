/**
 * Server side code using the express framework running on a Node.js server.
 * 
 * Load the express framework and create an app.
 */
const express = require('express');
const app = express();
/** 
 * Host all files in the client folder as static resources.
 * That means: localhost:8080/someFileName.js corresponds to client/someFileName.js.
 */
app.use(express.static('client'));

/**
 * Allow express to understand json serialization.
 */
app.use(express.json());

/**
 * Our code starts here.
 */

var ordersDone = []

const attractions = [
    { 
        name: "De Efteling",
        description: "The Dutch fairy tale themed park. In high demand!",
        adultPrice: 32,
        kidsPrice: 32,
        minimumNumberOfAdults: 2,
        minimumNumberOfKids: 1,
        discount: 15,
        available: 1,
        location: { lon: 5.043689, lat: 51.649718, },
    },

    { 
        name: "Madurodam",
        description: "The Netherlands smallest theme park.",
        adultPrice: 25,
        kidsPrice: 20,
        minimumNumberOfAdults: 1,
        minimumNumberOfKids: 2,
        discount: 25,
        available: 5,
        location: { lat: 52.0994779, lon: 4.299619900000039 },
    },

    { 
        name: "Toverland",
        description: "Experience magic and wonder.",
        adultPrice: 30,
        kidsPrice: 30,
        minimumNumberOfAdults: 2,
        minimumNumberOfKids: 2,
        discount: 33,
        available: 3,
        location: { lat: 52.0994779, lon: 4.299619900000039 },
    },

    { 
        name: "Walibi Holland",
        description: "Need an Adrenaline Rush?",
        adultPrice: 37,
        kidsPrice: 37,
        minimumNumberOfAdults: 4,
        minimumNumberOfKids: 0,
        discount: 10,
        available: 20,
        location: { lon: 5.766986, lat: 52.438554, },
    },
    
    { 
        name: "Duinrell",
        description: "From the Kikkerbaan to the Tikibad.",
        adultPrice: 22,
        kidsPrice: 19,
        minimumNumberOfAdults: 1,
        minimumNumberOfKids: 3,
        discount: 7,
        available: 20,
        location: { lon: 4.383922, lat: 52.147433, },
    }, 

    { 
        name: "Slagharen",
        description: "Fun for the whole family in a true western style.",
        adultPrice: 28,
        kidsPrice: 20,
        minimumNumberOfAdults: 2,
        minimumNumberOfKids: 2,
        discount: 50,
        available: 2,
        location: { lat: 52.6249522, lon: 6.563149500000009 },
    }, 

    { 
        name: "Drievliet",
        description: "Come and experience our wonderful attractions.",
        adultPrice: 26,
        kidsPrice: 24,
        minimumNumberOfAdults: 1,
        minimumNumberOfKids: 2,
        discount: 25,
        available: 0,
        location: { lon: 4.352633, lat: 52.052608, },
    }, 
]

/**
 * A route is like a method call. It has a name, some parameters and some return value.
 * 
 * Name: /api/attractions
 * Parameters: the request as made by the browser
 * Return value: the list of attractions defined above as JSON
 * 
 * In addition to this, it has a HTTP method: GET, POST, PUT, DELETE
 * 
 * Whenever we make a request to our server,
 * the Express framework will call one of the methods defined here.
 * These are just regular functions. You can edit, expand or rewrite the code here as needed.
 */
app.get("/api/attractions", function (request, response) {
    console.log("Api call received for /attractions");

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "xxxx",
        database : 'sogyoAdventure'
      });
      
    con.query("SELECT * FROM Parks Where available > 0", 
    function(err, results, fields) {
        response.json(results);
    })

    
});

async function orderTickets(parkname, tickets, orderNR) {

    let totalTickets = tickets[0] + tickets [1];
    let totalprice = tickets[2]
    
    const connection = await mysql.createConnection(
        {host: "localhost",
        user: "root",
        password: "xxxx",
        database : 'sogyoAdventure'});
    
    const [parkids, fields] = await connection.execute("SELECT parkid and  FROM Parks Where available > ? and parkname = ?", 
    [totalTickets, parkname]);

    let parkID = parkids[0].parkid

    await connection.execute("UPDATE Parks SET available = available - ? WHERE parkname = ?",
    [totalTickets, parkname]);
    
    await connection.execute("INSERT INTO Orderlines (OrderNR, PARKID, adults, kids) Values(?, ?, ?, ?)",
    [orderNR, parkID, tickets[0],tickets[1]]);
    connection.close();
  }


app.post("/api/placeorder", function (request, response) {
    console.log("Api call received for /placeorder");

    let orderNR;

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "xxxx",
        database : 'sogyoAdventure'
      });

      con.query("INSERT INTO Orders (workersID) values (2)", 
      function(err, results) {
        if (err) throw err;
        orderNR = results.insertId; 
        orders = request.body
    
        for (parkname in orders){
            if (parkname != "nrOfOrders"){
                totalTickets = JSON.parse(orders[parkname])
                orderTickets(parkname, totalTickets, orderNR)
            }
        }
        response.sendStatus(200)
      })
});


app.get("/api/myorders", function (request, response) {
    console.log("Api call received for /myorders");

    response.sendStatus(200);
});

app.get("/api/admin/edit", function (request, response) {
    console.log("Api call received for /admin/edit");

    response.sendStatus(200);
});


/**
 * Make our webserver available on port 8000.
 * Visit localhost:8000 in any browser to see your site!
 */

app.listen(8000, () => console.log('Example app listening on port 8000!'));

const mysql = require('mysql2/promise');