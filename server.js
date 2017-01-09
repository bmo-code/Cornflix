//  SET UP
var express = require( 'express' );
var stormpath = require( 'express-stormpath' ); //Gestion des comptes utilisateur
var app = express();
app.use( stormpath.init( app, {
    apiKey: {
        id: '4MIUE5CPOB6KEDF4UM71NAR6Z',
        secret: 'VmkWcyZ3qmfSaInhXIFrz/8Y3sQDi1GV1dTGhoYCsZk'
    },
    application: {
        href: `https://api.stormpath.com/v1/applications/5UuMr81z2fnECInr8cuxUj`
    }
} ) );

app.on( 'stormpath.ready', function() {

    console.log("Application ready on 8080");
} );
var mongoose = require( 'mongoose')
    , Schema = mongoose.Schema;
var morgan = require( 'morgan' ); //log requests to the console
var bodyParser = require( 'body-parser' ); //pull information from HTML POST
var methodeOverride = require( 'method-override' ); //simulate DELETE and PUT
/*
app.get('/email', stormpath.loginRequired, function (req, res) {
  res.send('Your email address is: ' + req.user.email);
});
*/
app.post( '/api/userData',stormpath.getUser, function( req, res ) {
  if (req.hasOwnProperty("user")){
    console.log("POST /userData : " + req.user.fullName + " is connected");
    res.send(JSON.stringify(req.user));
  }
} );


//fin du test Stormpath

//  CONFIGURATION
mongoose.connect( 'mongodb://localhost:27017/food' );

app.use( express.static( __dirname + '/public' ) );
app.use( morgan( 'dev' ) );
app.use( bodyParser.urlencoded( { 'extended': 'true' } ) );
app.use( bodyParser.json() );
app.use( bodyParser.json( { type: 'application/vnd.api+json' } ) );
app.use( methodeOverride() );

// LISTENING PORT
app.listen( 8080 );
console.log( "App listening on port 8080" );

//  ROUTES
app.get( '/api/ingredients', function( req, res ) {
    Ingredient.find( function( err, ingredients ) {
        if ( err ) {
            console.log( err );
            return res.send( err );
        }
        res.json( ingredients );
    } );
} );

app.get( '/api/ingredients/:ingredient_name', function( req, res ) {
    Ingredient.find( {
        name: req.params.ingredient_name
    }, function( err, ingredients ) {
        if ( err ) {
            console.log( err );
            return res.send( err );
        }
            res.json( ingredients );
    } );
} );

app.get( '/api/meals', function( req, res ) {
    /*Meal.find()
        .populate('ingredients', '_id', 'name', 'weight')
        .exec(function(err, meals) {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            res.json(meals);
        });*/
    Meal.find( function( err, meals ) {
        if ( err ) {
            console.log( err );
            return res.send( err );
        }
        res.json( meals );
    } );
} );



app.post( '/api/meals', function( req, res ) {
    Meal.create( req.body,
        function( err, meal ) {
            if ( err ) {
                console.log( err );
                return res.send( err );
            }
            res.send( meal );
        } );
} );

app.delete( '/api/meals/:meal_id', function( req, res ) {
    Meal.remove( {
        _id: req.params.meal_id
    }, function( err, result ) {
        if ( err ) {
            console.log( err );
            return res.send( err );
        }
        Meal.find( function( err, meals ) {
            if ( err ) {
                console.log( err );
                return res.send( err );
            }
            res.json( meals );
        } );
    } );
} );

app.post( '/api/meals/searchByName', function( req, res ) {
/*    Meal.find({
        name: { "$regex": req.body.name, "$options": "i" }
        })
        .populate('ingredients', '_id', 'name', 'weight')
        .exec(function(err, meals) {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            res.json(meals);
        });*/
    Meal.find( {
        name: { "$regex": req.body.name, "$options": "i" }
    }, function( err, meals ) {
        if ( err ) {
            console.log( err );
            return res.send( err );
        }
        res.json( meals );
    } );
} )

app.post( '/api/profile/searchByEmail', function( req, res ) {
    console.log("on est dedans");
    console.log(JSON.parse(req.body.email));
    Meal.find( {
        user_id: { "$regex": JSON.parse(req.body.email), "$options": "i" }
    }, function( err, meals ) {
        if ( err ) res.send( err );
        console.log(meals);
        res.json( meals );
    } );
} )

app.post( '/api/ingredients/searchById', function( req, res ) {
    var ingredients = [];
    var i = 0;
    for ( var j = 0; j < req.body.length; j++ ) {
        Ingredient.findOne( {
            _id: req.body[ j ]._id
        }, function( err, ingredient ) {
            if ( err ) {
                console.log( err );
            }
            i++;
            ingredients.push( ingredient );
            if ( i >= req.body.length ) {
                res.json( ingredients );
            }
        } );
    }
} )

app.post( '/api/ingredients/searchByName', function( req, res ) {
    Ingredient.find( {
        name: { "$regex": req.body.name, "$options": "i" }
    }, function( err, ingredients ) {
        if ( err ) {
            console.log( err );
            return res.send( err );
        }
        res.json( ingredients );
    } );
} )

app.post( '/api/feedbacks', function( req, res ) {
    Feedback.create( req.body,
        function( err, feedback ) {
            if ( err ) {
                console.log( err );
                return res.send( err );
            }
            res.send( feedback );
        } );
} )

//  FILES ROUTES
/*app.get( '/createMeal', function( req, res ) {
    res.sendfile( './public/createMeal.html' );
} );*/

app.get( '*', function( req, res ) {
    res.sendfile( './public/index.html' );
} );

//  MONGO MODELS

var ingredientSchema = Schema({
    category: String,
    name: String,
    weight: Number,
    sodium_mg: Number,
    magnesium_mg: Number,
    phosphore_mg: Number,
    potassium_mg: Number,
    calcium_mg: Number,
    manganese_mg: Number,
    fer_mg: Number,
    cuivre_mg: Number,
    zinc_mg: Number,
    selenium_microg: Number,
    iode_microg: Number,
    proteine_g: Number,
    proteine_brute_g: Number,
    glucide_g: Number,
    sucre_g: Number,
    energie_kj: Number,
    energie_kcal: Number,
    amidon_g: Number,
    energie_jones_kj: Number,
    energie_jones_kcal: Number,
    polyols_g: Number,
    fibre_g: Number,
    eau_g: Number,
    lipide_g: Number,
    acide_gras_sature_g: Number,
    beta_carotene_microg: Number,
    vitamine_d_microg: Number,
    vitamine_e_mg: Number,
    vitamine_k1_microg: Number,
    vitamine_k2_microg: Number,
    vitamine_c_mg: Number,
    vitamine_b1_mg: Number,
    vitamine_b2_mg: Number,
    vitamine_b3: Number,
    vitamine_b5_mg: Number,
    vitamine_b6_mg: Number,
    vitamine_b12_microg: Number,
    vitamine_b9_microg: Number,
    alcool_g: Number,
    cholesterol_mg: Number
});

var mealSchema = Schema({
    user_id: String,
    public: Boolean,
    name: String,
    description: String,
    //ingredients: [{ type: Schema.Types.ObjectId, ref: 'Ingredient'}]
    ingredients: [ { _id: String, name: String, weight: Number } ]
});

var Ingredient = mongoose.model( 'ingredients', ingredientSchema);

var Meal = mongoose.model( 'meals', mealSchema);

var Feedback = mongoose.model( 'feedbacks', {
    mail: String,
    category: String,
    type: String,
    comment: String
} );