var cornflix = angular.module( 'cornflix', [ 'ui.router' ] );

var cornflix = angular.module( 'cornflix', [ 'ui.router' ] )
    .config( function( $httpProvider, $stateProvider, $urlRouterProvider, $routeProvider, $locationProvider ) {

        // Route 404
        // Si l'URL demandé n'est pas présent dans le stateProvider,
        // on retourne sur l'URL 404
        $urlRouterProvider.otherwise( '/home' );

        $stateProvider
          //navigation states
            //show meals
            .state( 'meals', {
                url: '/meals',
                templateUrl: 'meals.html'
            } )
            //create meals
            .state( 'createMeal', {
                url: '/createMeal',
                templateUrl: 'createMeal.html'
            } )
            //show profile
            .state( 'profile', {
                url: '/profile',
                templateUrl: 'profile.html'
                } )
            //show details
            .state( 'detailsMeal', {
                url: '/detailsMeal',
                templateUrl: 'detailsMeal.html'
            } )
            //user feedback
            .state( 'feedback', {
                url: '/feedback',
                templateUrl: 'feedback.html'
            } )
            //StormPath states
            .state( 'login', {
                url: '/login',
            } )
            .state( 'register', {
                url: '/register'
            } )
            .state( 'logout', {
                url: '/logout'
            } )

        //default state
        .state( 'home', {
            url: '/home',
            templateUrl: 'home.html'
        } );

        // use the HTML5 History API
        //$locationProvider.html5Mode( true );
    } );



//functions here
function mainController( $scope, $http ) {
    $scope.userId = 0; /////////    A SUPPRIMER
    $scope.userData = 0;
    $scope.formData = {};
    $scope.formCreateMeal = {};
    $scope.formIngredientSearch = {};
    $scope.formMealSearch = {};
    $scope.addedIngredients = [];
    $scope.addedMeals = [];
    $scope.addedDetailsMeal = {};
    $scope.publicMeal = "true";
    $scope.formFeedback = {};

    $scope.bilan = {};

    //receives the user data
    $http.post( '/api/userData' )
        .success( function( data ) {
          //adding user data
          $scope.userData = data;
          //unique ID is users email
            $scope.userId = $scope.userData.email;
            console.log( $scope.userData );
        } )
        .error( function( data ) {
            console.log( "Error : " + data );
        } );



    $http.get( '/api/home' )
        .success( function( data ) {
            $scope.meals = data;
        } )
        .error( function( data ) {
            console.log( "Error : " + data );
        } );

    $http.get( '/api/meals' )
        .success( function( data ) {
            $scope.meals = data;
        } )
        .error( function( data ) {
            console.log( "Error : " + data );
        } );

    //  when submitting the add form, send meal to the node api
    $scope.createMeal = function() {

        var ingredientIds = [];
        var ingredientQty = [];
        for (var i in $scope.addedIngredients ) {
            ingredientIds.push($scope.addedIngredients[i]._id);
            ingredientQty.push($scope.addedIngredients[i].weight);
        }
        var meal = {
            user_id: $scope.userId,
            public: $scope.publicMeal,
            name: $scope.formCreateMeal.name,
            description: $scope.formCreateMeal.description,
            ingredients: ingredientIds,
            quantity_g: ingredientQty
        }
        $http.post( '/api/meals', JSON.stringify( meal ) )
            .success( function( data ) {
                alert( "________   Meal created !   ________" );
                //console.log(data);
            } )
            .error( function( data ) {
                console.log( 'Error: ' + data );
            } );
    };

    //  delete a meal
    $scope.deleteMeal = function( id ) {
        $http.delete( '/api/meals/' + id )
            .success( function( data ) {
                $scope.meals = data;
            } )
            .error( function( data ) {
                console.log( 'Error: ' + data );
            } );
    };

    $scope.searchMealByName = function() {
        //if field empty get all
        if ( $scope.formMealSearch == "undefined" || $scope.formMealSearch.name == null || $scope.formMealSearch.name == "" ) $scope.formMealSearch.name = "";

        $http.post( '/api/meals/searchByName', $scope.formMealSearch )
            .success( function( data ) {
                $scope.formMealSearch = {};
                $scope.mealSearchResult = data;
            } )
            .error( function( data ) {
                console.log( 'Error: ' + data );
            } );
    }

    //search a meal by the users email
    $scope.searchMealByEmail = function() {

        //if email field is empty or undifined
        if ($scope.userData.email == "null" || $scope.userData.email == "undefined"){
          return;
        }
        //request to server
        else{
          console.log($scope.userData.email);
          $http.post( '/api/profile/searchByEmail', $scope.userData.email)
              .success( function( data ) {
                  //store research meal list
                  console.log("pre requete");
                  $scope.mealSearchResult = data;
                  console.log("post requete");
              } )
              .error( function( data ) {
                  console.log( 'Error: ' + data );
              } );
        }
    }

    $scope.addMeal = function( id ) {
        //cancel if their is already 2 meal
        if ( $scope.addedMeals.length > 1 ) return;

        //Check if the meal is already added
        for ( i in $scope.addedMeals ) {
            if ( $scope.addedMeals[ i ]._id == id ) {
                return; //cancel insertion
            }
        }
        //else
        for ( i in $scope.mealSearchResult ) {
            if ( $scope.mealSearchResult[ i ]._id == id ) {
                var meal = $scope.mealSearchResult[ i ];
                getMealBilan( meal.ingredients, function( data ) {
                    meal.bilan = data;
                    $scope.addedMeals.push( meal );
                } );
            }
        }
    }

    $scope.addDetailsMeal = function( id ) {
        for ( i in $scope.mealSearchResult ) {
            if ( $scope.mealSearchResult[ i ]._id == id ) {
                var meal = $scope.mealSearchResult[ i ];
                getMealBilan(meal.ingredients, meal.quantity_g, function( data ) {
                    meal.bilan = data;
                    $scope.addedDetailsMeal = meal;
                } );
            }
        }
    }

    function getMealBilan(ingredients, quantities, callback ) {
        var bilan = {};
        var weight = 0;
    
        // Iterating through all nutrients
        Object.keys(ingredients[0]).forEach(function(key, index) {
            bilan[key] = 0; // set the bilan for this nutrient to 0
            console.log("Bilan " + key + " set to " + bilan[key]);
            // Iterating through all ingredients
            ingredients.forEach(function(element, index, array) {
                console.log(index);
                bilan[key] += Math.round((bilan[key] + ingredients[index][key] ) * 100 / 100 * quantities[index] / 100 );
            })
        })
        callback(bilan);
/*        $http.post( '/api/ingredients/searchById', ingredients)
            .success(function(data) {
                data.forEach(function(element, index, array ) {
                    element.weight = ingredients[ index ].weight;
                } )
                Object.keys( data[ 0 ] ).forEach( function( key, index ) {
                    //reset the property first
                    bilan[ key ] = 0;

                    //add every ingredients property by a ratio of its weight
                    for ( i in data ) {
                        bilan[ key ] += Math.round( ( bilan[ key ] + data[ i ][ key ] ) * 100 / 100 * data[ i ].weight / 100 );
                    }
                } );
                callback( bilan );
            } )
            .error( function( data ) {
                console.log( 'Error : ' + data );
            } )*/
    };

    $scope.deleteAddedMeal = function( id ) {
        //cycle through the ingredients
        for ( i in $scope.addedMeals ) {
            //if the selected ingredient corresponds to the lookup id
            if ( $scope.addedMeals[ i ]._id == id ) {
                $scope.addedMeals.splice( i, 1 );
                //$scope.refreshBilan();
            }
        }
    };

    //modifies the weight of an ingredient and refreshes the bilan
    $scope.setWeight = function( id, weight ) {
        //looking for the ingredient with the passed id
        for ( i in $scope.addedIngredients ) {
            if ( $scope.addedIngredients[ i ]._id == id ) {
                //setting new property
                $scope.addedIngredients[ i ].weight = weight;
            }
        }
        //refreshes the bilan
        $scope.refreshBilan();
    };

    //refreshes the interface and updates the bilan
    $scope.refreshBilan = function() {
        //if the list of added ingredients is empty, clear the bilan
        if ( $scope.addedIngredients[ 0 ] == null ) {
            //for each property of the bilan
            Object.keys( $scope.bilan ).forEach( function( key, index ) {

                //reset the property first
                $scope.bilan[ key ] = 0;
            } );
        }
        //normal refresh
        else {
            //for each property of the bilan
            Object.keys( $scope.addedIngredients[ 0 ] ).forEach( function( key, index ) {

                //reset the property first
                $scope.bilan[ key ] = 0;
                //add every ingredients property by a ratio of its weight
                for ( i in $scope.addedIngredients ) {
                    //DEBUG
                    //console.log(key + $scope.bilan[key] + " <- " + $scope.addedIngredients[i][key]);
                    $scope.bilan[ key ] += Math.round( ( $scope.bilan[ key ] + $scope.addedIngredients[ i ][ key ] ) * 100 / 100 * $scope.addedIngredients[ i ].weight / 100 );
                }
            } );
        }
    };

    //  get ingredients by name
    $scope.searchIngredientByName = function() {
        //if field empty get all
        if ( $scope.formIngredientSearch == "undefined" || $scope.formIngredientSearch.name == null || $scope.formIngredientSearch.name == "" ) $scope.formIngredientSearch.name = "";

        $http.post( '/api/ingredients/searchByName', $scope.formIngredientSearch )
            .success( function( data ) {
                $scope.formIngredientSearch = {};
                $scope.ingredientSearchResult = data;
            } )
            .error( function( data ) {
                console.log( 'Error: ' + data );
            } );
    };

    //adds the ingredient : from ingredientSearchResult to addedIngredients
    $scope.addIngredient = function( id ) {
        //DEBUG
        console.log( "add ingredient" );
        //check if ingredient is already in the array
        for ( i in $scope.addedIngredients ) {
            if ( $scope.addedIngredients[ i ]._id == id ) {
                return; //cancel insertion
            }
        }
        for ( i in $scope.ingredientSearchResult ) {
            if ( $scope.ingredientSearchResult[ i ]._id == id ) {
                //if there is no weight, set it to 100g by default
                if ( $scope.ingredientSearchResult[ i ].weight == null ) {
                    $scope.ingredientSearchResult[ i ].weight = 100;
                }

                //add to the array of added ingredients
                $scope.addedIngredients.push( $scope.ingredientSearchResult[ i ] );
                //refresh interface
                $scope.refreshBilan();
            }
        }
    };

    //removes an ingredient from the addedingredients array and refresh display
    $scope.deleteAddedIngredient = function( id ) {
        //cycle through the ingredients
        for ( i in $scope.addedIngredients ) {
            //if the selected ingredient corresponds to the lookup id
            if ( $scope.addedIngredients[ i ]._id == id ) {
                $scope.addedIngredients.splice( i, 1 );
                $scope.refreshBilan();
            }
        }
    };


    //sets the scope to public
    $scope.setPublic = function() {
        if ( $scope.publicMeal == "true" ) $scope.publicMeal = "false";
        else $scope.publicMeal = "true";
    };

    $scope.sendFeedback = function() {
        $http.post( '/api/feedbacks', $scope.formFeedback )
            .success( function( data ) {
                alert( 'Feedback sended, THANKS YOU !' );
            } )
            .error( function( data ) {
                console.log( 'Error : ' + data );
            } );
    }

}
