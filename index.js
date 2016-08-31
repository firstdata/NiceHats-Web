var express = require('express');
var bodyParser = require("body-parser");
var app = express();

var cardName, cardCvv,cardMonth, cardYear, street, city, state, zip, amount;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var apikey = 'LRKG8eV5UMIdQZJVF8Or3Nkvr8ccFIAl';
var apisecret = 'de8bb87482a18e6db9b7a0f4de6e2a1fd6927ec48a7f171a3b26bbc18f13a77d';
var merchant_token = 'fdoa-52fb2c64d62fefa26792a4853b6245b052fb2c64d62fefa2';

var payeezy = require('payeezy')(apikey, apisecret, merchant_token);
payeezy.version = "v1";

app.post('/charge',function(req,res){
	var amount = req.body.amount;
	var cardType = req.body.cardType;
	var token = req.body.token;
	var cardName = req.body.cardName;
	var expDate = req.body.expDate;

	console.log(amount  + ' ' + cardType + ' ' + token + ' ' + cardName + expDate);
	payeezy.transaction.tokenAuthorize({
        merchant_ref: "1234",
        method: "token",
        amount: amount,
        currency_code: "USD",
        token: {
            token_type: "FDToken",
            token_data: {
                type: cardType,
                value: token,
                cardholder_name: cardName,
                exp_date: '1030'
            }
        }
    }, function(error, response) {
        if (error) {
            console.log('Authorize Token Failed\n' + error);
        }
        if (response) {
            console.log('Authorize Token -  Success.\nTransaction Tag: ' + response.transaction_tag);
        }
    });
});

app.get('/', function (req, res) {
  res.send('Hello World!');
  // performAuthorizeTransaction('capture');
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
