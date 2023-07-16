How to download and run the app in your local machine:
First make a copy of the project into your local machine to run in VS Code:

git clone https://github.com/mnavai/actor-display-app/tree/main
once you open VS code, create .env file in the root directory of the app and assign the access token provided to REACT_APP_ACCESS_KEY in the .env file. for instance REACT_APP_ACCESS_KEY='<access_token>'

In terminal type the following steps one by one

npm install
npm start
Runs the app in the development mode.
Open http://localhost:3000 to view it in your browser.

Once the app is open in the browser, you may click on Load actors button to get the list of actors whom have played with both Keanu Reeves and Nicolas Cage.

to see the POST request, simply click on the Post button and in chrome inspect the page and view the results under the network tab.