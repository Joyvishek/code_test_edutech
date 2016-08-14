var mongoose = require('mongoose');
var User = mongoose.model('User');
var discourse_sso = require('discourse-sso');
var sso = new discourse_sso("MY_SECRET");
var Course = mongoose.model('Course');
var Wishlist = mongoose.model('Wishlist');
var Mailer = require('./sendmail');
var crypto = require('crypto');

module.exports.profileRead = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    User
      .findById(req.payload._id)
      .exec(function(err, user) {
	//res.redirect('http://www.google.com');
        //res.status(200).send({redirect_to: 'http://www.google.com'});
	//var sso_payload = req.query.sso; // fetch from incoming request 
	//var sig = req.query.sig; // fetch from incoming request 
	//var redirect_to_url = 'http://54.169.85.240/session/sso_login?';
	//if(sso.validate(sso_payload, sig)) {
		//var nonce = sso.getNonce(sso_payload);
		//var userparams = {
			// Required, will throw exception otherwise 
			//"nonce": nonce,
			//"external_id": user._id,
			//"email": user.email,
			// Optional 
			//"username": "Pat",
		//	//"name": "Gaurab Patra"
		//};
		//var q = sso.buildLoginString(userparams);
		//res.status(200).json({redirect_to: redirect_to_url+q});
	//}
	res.status(200).json(user);
      });
  }

};

module.exports.toggleWishlist = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {

    Course
      .findById(req.query.id)
      .exec(function(err, course) {
	if(course){

	Wishlist.findOne({userId:req.payload._id},function(err, model){
		if(model && model.wishlists.indexOf(req.query.id)!=-1){
		    Wishlist.findOneAndUpdate(
			{userId:req.payload._id},
			{$pull: {"wishlists": req.query.id}},
			{safe: true, upsert: true, new : true},
			function(err, model) {

			    Course.findOneAndUpdate({_id: req.query.id},
				{$inc: {"wishlisted": -1}},
				{safe: true, upsert: true, new : true},
				function(err, model) {
				    res.status(200).json({"message":"Successfully Saved"});
				    console.log(err);
				}
			    );
			    console.log(err);
			}
		    );
		}
		else{
		    Wishlist.findOneAndUpdate(
			{userId:req.payload._id},
			{$push: {"wishlists": req.query.id}},
			{safe: true, upsert: true, new : true},
			function(err, model) {
			    Course.findOneAndUpdate({_id: req.query.id},
				{$inc: {"wishlisted": 1}},
				{safe: true, upsert: true, new : true},
				function(err, model) {
				    res.status(200).json({"message":"Successfully Saved"});
				    console.log(err);
				}
			    );
			    console.log(err);
			}
		    );
		}

	});

	    /*Wishlist.findOneAndUpdate(
		{userId:req.payload._id},
		{$push: {"wishlists": req.query.id}},
		{safe: true, upsert: true, new : true},
		function(err, model) {
		    console.log(err);
		}
	    );
	    res.status(200).json({"message":"Successfully Saved"});*/
	}else{
	    res.status(401).json({
	      "message" : "Course Not Found"
	    });
	}
      });
  }

};

module.exports.isWishlisted = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {

    Course
      .findById(req.query.id)
      .exec(function(err, course) {
	if(course){

	Wishlist.findOne({userId:req.payload._id},function(err, model){
		if(model && model.wishlists.indexOf(req.query.id)!=-1){
		    res.status(200).json({isWishlisted:true});
		}
		else{
		    res.status(200).json({isWishlisted:false});
		}

	});

	}else{
	    res.status(401).json({
	      "message" : "Course Not Found"
	    });
	}
      });
  }

};

module.exports.forumProfileRead = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    User
      .findById(req.payload._id)
      .exec(function(err, user) {
	//res.redirect('http://www.google.com');
        //res.status(200).send({redirect_to: 'http://www.google.com'});
	var sso_payload = req.query.sso; // fetch from incoming request 
	var sig = req.query.sig; // fetch from incoming request 
	var redirect_to_url = 'http://ec2-54-169-87-58.ap-southeast-1.compute.amazonaws.com/session/sso_login?';
	//if(sso.validate(sso_payload, sig)) {
		var nonce = sso.getNonce(sso_payload);
		var userparams = {
			// Required, will throw exception otherwise 
			"nonce": nonce,
			"external_id": JSON.stringify(user._id),
			"email": user.email,
			// Optional 
			"username": user.name
			//"name": "Gaurab Patra"
		};
		var q = sso.buildLoginString(userparams);
		res.status(200).json({redirect_to: redirect_to_url+q});
	//}
	//res.status(200).json({redirect_to: sig});
      });
  }

};

module.exports.isUsernameUnique = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
	//res.status(200).json({is_unique: true});
	User.findOne({ 'username' : req.query.username }, function(err, user) {
		if(err){
			res.status(401).json({
		          "message" : "UnauthorizedError: private profile"
		        });
		}
		if(user){
			res.status(200).json({is_unique: false});
		}else{
			res.status(200).json({is_unique: true});
		}

        });
  }

};

module.exports.saveUsername = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
	//res.status(200).json({is_unique: true});

	User.findOneAndUpdate({ _id : req.payload._id }, { 'username' : req.body.params.username }, {upsert:true}, function(err, doc){
	    if (err) return res.send(500, { error: err });
	    return res.send("succesfully saved");
	});
  }

};

module.exports.connectToUser= function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
	User.findOne({'username':req.body.params.username},function(err,data){
		if(data){
			var requested_id = data._id;

		Connection_request.findOne({userId:requested_id},function(err, model){
			if(model && model.connection_requests.indexOf(req.payload._id)!=-1){
				    res.status(200).json({"message":"Already Requested For Connection"});
			}
			else{
			    Connection_request.findOneAndUpdate(
				{userId:requested_id},
				{$push: {"connection_requests": req.payload._id}},
				{safe: true, upsert: true, new : true},
				function(err, model) {
				    res.status(200).json({"message":"Connection Request Sent"});
				    console.log(err);
				}
			    );
			}

		});


		}	
	}
	);

  }

};

module.exports.acceptConnect= function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {

			var requested_id = req.body.params.userId;

		Connection_request.findOne({userId:req.payload._id},function(err, model){
			if(model && model.connection_requests.indexOf(requested_id)!=-1){

			    Connection.findOne({userId:req.payload._id},function(err, user){
				if(user && user.connection.indexOf(requested_id)!=-1){
			    		res.status(200).json({"message":"Already A Connection"});
				}else{
				    Connection_request.findOneAndUpdate(
					{userId:req.payload._id},
					{$pull: {"connection_requests": requested_id}},
					{safe: true, upsert: true, new : true},
					function(err, model) {
					    console.log(err);
					}
				    );	

				    Connection.findOneAndUpdate(
					{userId:req.payload._id},
					{$push: {"connections": requested_id}},
					{safe: true, upsert: true, new : true},
					function(err, model) {
					    console.log(err);
					    Connection.findOneAndUpdate(
						{userId:requested_id},
						{$push: {"connections": req.payload._id}},
						{safe: true, upsert: true, new : true},
						function(err, model) {
				    		    res.status(200).json({"message":"Connection Accepted."});
						    console.log(err);
						}
					    );
					}
				    );

			        }
			    });
			   
			}
			else{
			    res.status(200).json({"message":"Invalid Request"});

			}

		});

  }

};

module.exports.isEmailUnique = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
	//res.status(200).json({is_unique: true});
	User.findOne({ 'email' : req.query.setemail }, function(err, user) {
		if(err){
			res.status(401).json({
		          "message" : "UnauthorizedError: private profile"
		        });
		}
		if(user){
			res.status(200).json({is_unique: false});
		}else{
			res.status(200).json({is_unique: true});
		}

        });
  }

};

module.exports.saveEmail = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
	//res.status(200).json({is_unique: true});
	var emailHash = crypto.randomBytes(20).toString('hex').concat(req.payload._id);
	User.findOneAndUpdate({ _id : req.payload._id }, { 'email' : req.body.params.setemail, 'emailVerificationHash':emailHash  }, {upsert:true}, function(err, doc){
	    if (err) return res.send(500, { error: err });
	    var sendsubmail = new Mailer({to: req.body.params.setemail, subject: 'Welcome To TheoreX ✔',text: 'Successfully Registered 🐴', html: '<center><table width="700" background="#FFFFFF" style="text-align:left;" cellpadding="0" cellspacing="0"><tr>	<td height="18" width="31" style="border-bottom:1px solid #e4e4e4;">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td>	<td height="18" width="131">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td>	<td height="18" width="466" style="border-bottom:1px solid #e4e4e4;">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td></tr><tr>	<td height="2" width="31" style="border-bottom:1px solid #e4e4e4;">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td>	<td height="2" width="131">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td>	<td height="2" width="466" style="border-bottom:1px solid #e4e4e4;">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td></tr><!--GREEN STRIPE--><tr>	<td background="" width="31" bgcolor="#00a0e3" style="border-top:1px solid #FFF; border-bottom:1px solid #FFF;" height="113">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td>	<!--WHITE TEXT AREA-->	<td width="131" bgcolor="#FFFFFF" style="border-top:1px solid #FFF; text-align:center;" height="113" valign="middle">	<span style="font-size:30px; font-family:Josefin Sans; color:#00a0e3;">Success!</span>	</td>	<!--GREEN TEXT AREA-->	<td background="" bgcolor="#00a0e3" style="border-top:1px solid #FFF; border-bottom:1px solid #FFF; padding-left:15px;" height="113">	<span style="color:#FFFFFF; font-size:25px; font-family:Josefin Sans">Thank you for subscribing to our email newsletter.</span>	</td></tr><!--DOUBLE BORDERS BOTTOM--><tr>	<td height="3" width="31" style="border-top:1px solid #e4e4e4; border-bottom:1px solid #e4e4e4;">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td>	<td height="3" width="131">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td>	<td height="3" style="border-top:1px solid #e4e4e4; border-bottom:1px solid #e4e4e4;">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td></tr><tr>	<center>	<td colspan="3">	<!--CONTENT STARTS HERE-->	<br />	<br />	<table cellpadding="0" cellspacing="0">	<tr>	<td width="200"><div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div></td>	<td width="400" style="padding-right:10px; font-family:Trebuchet MS, Verdana, Arial; font-size:12px;" valign="top">	<span style="font-family:Josefin Sans; font-size:20px; font-weight:bold;">Hey, Welcome to <span style="color:#00a0e3">TheoreX</span></span>	<br />	<p style="font-family:Josefin Sans; font-size:15px;">You have successfully subscribed to our weekly newsletters!</p><br /><p style="font-family:Josefin Sans; font-size:15px;">In the meantime, you can <a href="http://theorex.tech/">return to our website</a> to continue browsing.</p>   <p style="font-family:Josefin Sans;font-size:12px;font-weight:bold;">Best Regards,<br/>   Team TheoreX   <br/></p>	</table><br /><table cellpadding="0" style="border-top:1px solid #e4e4e4; text-align:center; font-family:Trebuchet MS, Verdana, Arial; font-size:12px;" cellspacing="0" width="900"><tr>	<td height="2" style="border-bottom:1px solid #e4e4e4;">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td></tr>	<td style="font-family:Josefin Sans; font-size:12px; font-weight:bold;">	<br />	For more information get back to us at info@theorex.tech	</td></tr></table></center> http://localhost:3000/emailverify/'+emailHash+'' });
	    return res.send("succesfully saved");
	});
  }

};
