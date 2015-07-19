var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var nota = new Schema({
	title: String,
	description: String,
	type: String,
	body: String
});

var Notas = mongoose.model('Nota', nota);

module.exports = Notas

//PUT to update a blob by ID
/*router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var name = req.body.name;
    var badge = req.body.badge;
    var dob = req.body.dob;
    var company = req.body.company;
    var isloved = req.body.isloved;

   	//find the document by ID
    mongoose.model('Blob').findById(req.id, function (err, blob) {
        //update it
        blob.update({
            name : name,
            badge : badge,
            dob : dob,
            isloved : isloved
        }, function (err, blobID) {
          if (err) {
              res.send("There was a problem updating the information to the database: " + err);
          } 
          else {
                  //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                  res.format({
                      html: function(){
                           res.redirect("/blobs/" + blob._id);
                     },
                     //JSON responds showing the updated values
                    json: function(){
                           res.json(blob);
                     }
                  });
           }
        })
    });
});*/