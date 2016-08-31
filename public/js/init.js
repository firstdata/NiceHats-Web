$(document).ready(function() {

var hat = {
    quantity:0,
    price:0,
    color:"",
};
var hatsArray = [];
var hatsDict = {
    "red": 5,
    "blue": 6,
    "green": 7
}

var total = 0;
var quantity = 0;
var state = '';
var cardType = '';

$('#checkout').hide();
$('#cart-section').hide();
$('#thankyou').hide();

$('#redhat').hide();
$('#bluehat').hide();
$('#greenhat').hide();

$('.ccInfo').hide();

$( "a:contains('Add to Cart')" ).click(function() {
  if (typeof(Storage) !== "undefined") {
    hat.quantity = 1;
    hat.price = $(this).attr('value');
    hat.color = $(this).attr('title');
    hatsArray.push(hat);

    updateCartAmount();

    localStorage.setItem("hats", hatsArray);
    showCart();
  }
});

$('#continue').click(function() {
  showHome();
});

function showHome() {
  $('#checkout').fadeOut();
  $('#cart-section').hide();
  $('#shop').show();
  $('#thankyou').hide();
}

function showCart() {
  $('#shop').fadeOut();
  $('#checkout').fadeOut();
  $('#cart-section').show();
  $('#thankyou').hide();

  var hats = localStorage.getItem('hats');
  for (i = 0; i < hatsArray.length; i++) {
    displayPrice(hatsArray[i]);
    $('#'+hatsArray[i].color+"hat").show();
  }
}

function showCheckout() {
  state = 'checkout';

  $('#checkout').show();
  $('#cart-section').fadeOut();
  $('#shop').fadeOut();
  $('#thankyou').hide();
}

function displayPrice(hat) {
  $('#'+hat.color+'price').text('$'+hat.price * hat.quantity);
}

function updatePrice(hatColor, quantity) {
  for (i = 0; i < hatsArray.length; i++) {
    if (hatsArray[i].color == hatColor) {
      hatsArray[i].quantity = quantity;
      displayPrice(hatsArray[i]);
    }
  }
}

function removeItem(hatColor) {
  for (i = 0; i < hatsArray.length; i++) {
    if (hatsArray[i].color == hatColor) {
      hatsArray.splice(i,1);
      console.log('after removed it is ' + hatsArray);
      $('#'+hatColor+'hat').fadeOut();
      updateCartAmount();
      if (hatsArray.length == 0) {
          showHome();
      }
    }
  }
}

function updateCartAmount() {
  $('#cartcount').text('('+hatsArray.length+')');
}

$( "a:contains('Check Out')" ).click(function() {
  total = 0;

  $('#cartcount').text('('+hatsArray.length+')');
    console.log('checking out '+ hatsArray);
    for (i = 0; i < hatsArray.length; i++) {
      hatsArray[i].quantity = $(hatsArray[i].color).val();
      quantity = parseInt(hatsArray[i].quantity) + parseInt(quantity);


      if ($('#redprice').text() != '') {
        total = total + parseInt($('#redprice').text().replace('$',''));
      }

      if ($('#blueprice').text() != '') {
        total = total + parseInt($('#blueprice').text().replace('$',''));
      }

      if ($('#greenprice').text() != '') {
        total = total + parseInt($('#greenprice').text().replace('$',''));
      }

      console.log('total is ' + total);
      showCheckout();
    }
});

$('#logo').click(function(){
  if (state == 'checkout') {
    showCart();
  }
});

$('#cart-btn').click(function() {
    showCart();
});

$('#shop-btn').click(function() {
  showHome();
});

// validate card type using an external library
$(function() {
    $('#cc_number').validateCreditCard(function(result) {
        cardType = result.card_type.name;
    });
});

$('#order').click(function() {
  // tokenize card using payeezy.js
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
});

  var responseHandler = function(status, response) {
    var $form = $('#checkout-form');
    $('#someHiddenDiv').hide();
    if (status != 201) {
         if (response.error && status != 400) {
           var error = response["error"];
           var errormsg = error["messages"];
           var errorcode = JSON.stringify(errormsg[0].code, null, 4);
           var errorMessages = JSON.stringify(errormsg[0].description, null, 4);
           $('#payment-errors').html( 'Error Code:' + errorcode + ', Error Messages:'
                            + errorMessages);
        }
        if (status == 400 || status == 500) {
           $('#payment-errors').html('');
           var errormsg = response.Error.messages;
           var errorMessages = "";
           for(var i in errormsg){
            var ecode = errormsg[i].code;
            var eMessage = errormsg[i].description;
            errorMessages = errorMessages + 'Error Code:' + ecode + ', Error Messages:'
                            + eMessage;
            }
           $('#payment-errors').html( errorMessages);
        }
        $form.find('button').prop('disabled', false);
    } else {
        $('#payment-errors').html('');
        var result = response.token.value;
        console.log(result);

        $('#response_msg').html('Payeezy response - Token value:' + result);
    }

    var expDate = $('#exp_month').val() + $('#exp_year').val();
    console.log('exp ' + expDate);

    console.log(cardType);
    
    $.post("http://nicehatsdemo.herokuapp.com/charge", {
          amount: total,
          cardType: cardType, //$('#card_type').val(),
          token: result,
          cardName: $('#cardholder_name').val(),
          expDate: expDate
      },
      function(data){
        if(data==='done') {
            alert("payment success");
          }
      });
      $('#checkout').hide();
      $('#thankyou').fadeIn();
  };

  $( "a:contains('Remove')" ).click(function() {
    removeItem($(this).attr('value'));
  });

  $('#redselect').change(function() {
    updatePrice('red', $(this).val());
  });
  $('#blueselect').change(function() {
    updatePrice('blue', $(this).val());
  });
  $('#greenselect').change(function() {
    updatePrice('green', $(this).val());
  });

});
