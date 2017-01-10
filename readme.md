#Cornflix

Nutrional web app developed for Node.js school project

##Installation

- Clone this repository:
`
git clone git@github.com:bmo-code/Cornflix.git
`   
- Install npm dependencies:
`
npm install
`
- Install mongodb:
`
apt-get install mongo-org
`

##Running the app

- Import database: 
`
mongoimport --db food --collection ingredients ingredients.json --jsonArray
`
- Launch app:
`
node server.js
`

##Git flow

###Master branch

Never push on master. Only accept pull requests on master if the build succeeds.

###Develop branch

Create a new branch from develop to create your new features! Merge the new features on develop once your code is stable.

###Manuel Utilisateur 

- CreateMeal: permet de créer un menu en effectuant une recherche dans la BDD ingrédients. Pour retrouver ce menu, sauvegardez le avec un titre et une description
- Home : page d'accueil, pas d'instructions nécessaires
- FeedBack : permet de faire remonter une demande, une question, ou un bug observé. Pour cela, il faut joindre son mail, préciser les catégories concernées, et entrer un message
-CreatedMeals (ou meals.html) : permet de voir tous les menus crées à l'aide d'une recherche permet de comparer le bilan nutritionnel de 2 menus
- DetailMeals : permet de voir le détail d'un menu (liste d'ingrédients et poids)
- MyAccount (profile.html) : permet de voir quelques données utilisateur

Pour se connecter ou s'enregistrer, deux boutons sont disponibles dans la barre de navigation. Pour la déconnexion, ils sont remplacés par un bouton "logout"