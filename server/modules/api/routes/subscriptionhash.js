/*Modify const before start
 * POST  API : http://localhost:2036/subscriptionhash
 * BODY
 *  {
  "txhash": "a1d6b0683af51cde18f095429e359f3f0b837e097d13bc49438c85e69f537bc3",
  "callbackurl": "http://localhost:2037/querytx/?txhash=a1d6b0683af51cde18f095429e359f3f0b837e097d13bc49438c85e69f537bc3"
} 
* http://localhost:2037/querytx/?txhash=a1d6b0683af51cde18f095429e359f3f0b837e097d13bc49438c85e69f537bc2
 */

/*jshint esversion: 6 */

const fetch = require("node-fetch");
var MongoClient = require('mongodb').MongoClient;
const  mongoURL = "mongodb://52.15.131.100:27017/";
const  dbName = "elaPay";
const  callbackhashCN = "callbackhashdb";

//const elaHostURL  = "https://blockchain.elastos.org";
//const txLocation = "/api/v1/tx/";
//const elatxPageLocation = "/tx/";

exports.details = function(req, res){
	console.log("Request came in");
	 //var txHashUrl = elaHostURL+txLocation+req.query.txhash;
	 if(typeof req.body.txhash == 'undefined' || typeof req.body.callbackurl == 'undefined'){
		    res.status(404);
		    res.setHeader('Content-Type', 'application/json');
		    res.send(JSON.stringify({ status: "Required value such as TX hash or callbackURL Missing in body"}));
	 }else{
			MongoClient.connect(mongoURL, function(err, db) {
				  if (err){
					  throw err;
				  }else{
					  //console.log("Connected to db")
					  var dbo = db.db(dbName);	
				      var currenttimestamp = Math.floor(Date.now() / 1000);
					  var elasubhashObj = { txhash: req.body.txhash, callbackurl: req.body.callbackurl, timestamp: currenttimestamp,status: "new"};
					  dbo.collection(callbackhashCN).insertOne(elasubhashObj, function(err, result) {
						  if (err){
							  console.log("Error with connection 3")
							  throw err;
						  } else{
							    db.close();
							    res.status(200);
							    res.setHeader('Content-Type', 'application/json');
							    res.send(JSON.stringify({ status: "success",details:"A callback request will be sent if there is a change is status of transaction hash provided."}));
						  }
					  });
				  }		  
				});
			

	}
};