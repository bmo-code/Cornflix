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

