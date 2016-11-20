var express = require('express')
var cookieParser = require('cookie-parser');
var app = express();

//cookieparser안에 키를 넣어주면 쿠키가 좀 더 보안이 좋아짐!, 그리고 signedCookies로 해주면 좀 더 암호화가 됩니다!
app.use(cookieParser('sadkfjhkjfheudhf83dsfjh1'));

app.get('/count',function(req,res){
	if(req.signedCookies.count) {
		var count = parseInt(req.signedCookies.count);	
	} else {
		var count = 0;
	}
	
	count= count+1;
	res.cookie('count', count, {signed:true})
	res.send('count : '+count);

})

var products = {
  1:{title:'The history of web 1'},
  2:{title:'The next web'}
};

app.get('/products', function(req, res){
  var output = '';
  for(var name in products) {
    output += `
      <li>
        <a href="/cart/${name}">${products[name].title}</a>
      </li>`
  }
  res.send(`<h1>Products</h1><ul>${output}</ul><a href="/cart">Cart</a>`);
});

app.get('/cart/:id', function(req,res){
	var id = req.params.id ;
	if (req.cookies.cart) {
		var cart = req.cookies.cart
	} else {
		var cart = {};	
	}
	if (!cart[id]) {
		cart[id] = 0;
	}
	cart[id] =  parseInt(cart[id]) + 1
	res.cookie('cart', cart);
	res.redirect('/cart');
})


app.get('/cart',function(req,res){
	var cart = req.cookies.cart;
	if(!cart) {
		res.send("empty!");
	} else {
		var output = '';
		for (var id in cart){
			output += `<li>${products[id].title} (${cart[id]})</li>`;
		}
	}
	res.send(`<h1>Cart</h1><ul>${output}</ul><a href="/products">Products list</a>`)
})


app.listen(3003,function(){
	console.log('connected 3003 port!!!')
})