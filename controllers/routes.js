const REQUEST = require('request');
const CHEERIO = require("cheerio");
const MOMENT = require("moment");
const Article = require("../models/Article.js");
const Comment = require("../models/Comment.js");


module.exports = function(app){

	app.get('/', function(req, res){
		
		Article.find()
		.populate("comments")
		.exec(function(err, docs){

			let hbsObject ={
				article: docs,
				helpers: {
            		formatDate: function (date) { 
            			return MOMENT(date).format("MM/DD/YYYY").toString(); 
            		}
        		}
			};

			res.render("index", hbsObject);
		})
		
	});

	
	app.get("/api/scrape", function(req, res) {
	
	  
	  REQUEST("www.cointelegraph.com", function(error, response, html) {
	    
	    var $ = CHEERIO.load(html);
	  
	    $('div.js-streamItem').each(function(i, element){

	    
	    	let result ={};

	    	
      		result.title = $(element).find('h3').text().replace(/\n/g, "").trim();
      		result.link = $(element).find('div.side-post-read a').attr('href');
      		result.date = new Date($(element).find('time').attr("datetime"));
      		result.author =$(element).find('div.postMetaInline-authorLockup').children('a:first-child').text();
    	
	      
	      	let entry = new Article(result);

	  
	      	entry.save(function(err, doc) {
	        
	        	if (err) {
	          		console.log(err);
	          		
	        	}
	        
	        	else {	        	
	          		console.log(doc);
	        	}
	      	});
	    });	   
	  });
	  
	 	  setTimeout(function() {res.redirect("/")}, 2000);
	});



	app.get("/api/article", function(req, res) {
	  
	  Article.find({}, function(error, doc) {
	    
	    if (error) {
	      console.log(error);
	    }
	    
	    else {
	      res.json(doc);
	    }
	  });
	});

	
	app.get("api/article/:id", function(req, res) {
	 
	  Article.findOne({ "_id": req.params.id })

	  .populate("comments")
	  
	  .exec(function(error, doc) {
	   
	    if (error) {
	      console.log(error);
	    }
	    
	    else {
	      res.json(doc);
	    }
	  });
	});


	
	app.post("/api/article/:id", function(req, res) {
	 	
	  
	  var newComment = new Comment(req.body);


	  newComment.save(function(error, doc) {
	    
	    if (error) {
	      console.log(error);
	    }
	    
	    else {     		
	     
	      Article.findOneAndUpdate({ "_id": req.params.id }, {$push:{ "comments": doc._id }},  { new: true })
	      
	      .exec(function(err, doc) {
	        
	        if (err) {
	          console.log(err);
	        }
	        else {
	          
	          res.redirect('/');
	        }
	      });
	    }
	  });
	});

	
	
	app.post("/api/delete-comment", function(req, res){

		let commentID = req.body.commentID;
		let	articleID = req.body.articleID;
		
		Comment.remove({"_id": commentID}, function(error, doc) {
	    
	    if (error) 
	    {
	      console.log(error);
	    }
	    
	    else 
	    {     		
	      
	      Article.findOneAndUpdate({ "_id": articleID }, {$pull:{ "comments": commentID }},  { new: true })
	      
	      .exec(function(err, doc) {
	        
	        if (err) {
	          console.log(err);
	        }
	        else {
	          
	          res.json({complete:true});
	        }
	      });
	    }
	  });
	});

}