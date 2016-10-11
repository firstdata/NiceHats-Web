var app = angular.module("shop", []);
app.controller("shopCtrl", ['$scope', '$http', function($scope, $http) {

    $scope.homeSection = true;
    $scope.cartSection = false;
    $scope.checkoutSection = false;
    $scope.thankyouSection = false;

    $scope.hats = [];
    $scope.checked = [];

    $scope.shoppingcart = {
     items: []
   };

    $scope.addHat = function(a) {
      $scope.homeSection = !$scope.homeSection;
      $scope.cartSection = !$scope.cartSection;

      angular.forEach($scope.records, function(value, key){
        var color = value.color;
        if (a === color) {
          if (color == "red") {
            $scope.shoppingcart.items.push({
                color: "red",
                qty: 1,
                description: "Are you a Red Sox fan but don't want to pay for an offical hat? Then this one is for you!",
                cost: 5
              });
          }

          if (color == "blue") {
            $scope.shoppingcart.items.push({
                color: "blue",
                qty: 1,
                description: "Our classic blue for the Dodgers and Blue Jays fans on a budget.",
                cost: 6
              });
          }

          if (color == "green") {
            $scope.shoppingcart.items.push({
                color: a,
                qty: 1,
                description: "Show your A's pride without spending an arm and a leg with our Green Hat!",
                cost: 7
                });
            }
          }
      });
      }

     $scope.removeItem = function(index) {
        $scope.showCart = !$scope.showCart;
        $scope.showHome = !$scope.showHome;

        $scope.shoppingcart.items.splice(index, 1);
    }

    $scope.continueShopping = function() {
        $scope.homeSection = !$scope.homeSection;
        $scope.cartSection = !$scope.cartSection;
    }

    $scope.cart = function() {
      $scope.homeSection = false;
      $scope.cartSection = true;
      $scope.checkoutSection = false;
    }

    $scope.checkout = function() {
      $scope.cartSection = !$scope.cartSection;
      $scope.checkoutSection = !$scope.checkoutSection;
    }

    $scope.showThankyou = function() {
      $scope.checkoutSection = !$scope.checkoutSection;
      $scope.thankyouSection = !$scope.thankyouSection;

        var apiKey = 'LRKG8eV5UMIdQZJVF8Or3Nkvr8ccFIAl';
        var js_security_key = 'js-e9ecc1dc5792e99bbf19b5544379ad73e9ecc1dc5792e99b';
        var auth = 'true';
        var ta_token = 'NOIW';

        Payeezy.setApiKey(apiKey);
        Payeezy.setJs_Security_Key(js_security_key);
        Payeezy.setTa_token(ta_token);
        Payeezy.setAuth(auth);
        Payeezy.setcurrency('USD');
        Payeezy.createToken(responseHandler);
    }

    var responseHandler = function(status, response) {
      if (status != 201) {
         if (response.error && status != 400) {
           var error = response["error"];
           var errormsg = error["messages"];
           var errorcode = JSON.stringify(errormsg[0].code, null, 4);
           var errorMessages = JSON.stringify(errormsg[0].description, null, 4);
        }
        if (status == 400 || status == 500) {
           var errormsg = response.Error.messages;
           var errorMessages = "";
           for(var i in errormsg) {
            var ecode = errormsg[i].code;
            var eMessage = errormsg[i].description;
            errorMessages = errorMessages + 'Error Code:' + ecode + ', Error Messages:'
                            + eMessage;
            }
        }
      } else {
        var result = response.token.value;
        var req = {
         method: 'POST',
         url: 'http://localhost:3000/charge',

         data: {
           amount: parseInt($scope.total()),
           token: response.token.value,
           cardName: response.token.cardholder_name,
           expDate: response.token.exp_date,
           cardType: response.token.type
         }
        }
        $http(req).then(function(){ }, function(){ });
      }
    }

   $scope.total = function() {
      var total = 0;
      angular.forEach($scope.shoppingcart.items, function(item) {
          total += item.qty * item.cost;
      })
      return total;
  }

  $scope.cartLength = function() {
    return $scope.shoppingcart.items.length;
  }

  $scope.records = [
    {color:"red", price:"5", description:"Are you a Red Sox fan but don't want to pay for an offical hat? Then this one is for you!"},
    {color:"blue", price:"6", description:"Our classic blue for the Dodgers and Blue Jays fans on a budget."},
    {color:"green", price:"7", description:"Show your A's pride without spending an arm and a leg with our Green Hat!"},
    ]
  }]);

app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
