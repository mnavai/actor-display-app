### How to download and run the app in your local machine:

To download and run the app on your local machine:

1. Start by making a copy of the project on your local machine. You can do this by running the following command in your terminal or command prompt:

git clone https://github.com/mnavai/actor-display-app/tree/main

2. Once you open Visual Studio Code, create a .env file in the root directory of the app. In the .env file, assign the provided access token to REACT_APP_ACCESS_KEY. For example: REACT_APP_ACCESS_KEY='<access_token>'.

3. In the terminal, navigate to the project directory and run the following commands one by one:

npm install
npm start

4. This will start the app in development mode. Open your browser and visit http://localhost:3000 to view the application.
5. Once the app is open in the browser, you can click on the "Load actors" button to retrieve the list of actors who have worked with both Keanu Reeves and Nicolas Cage.
6. To see the POST request, simply click on the "Post" button. You can inspect the page in Chrome and view the results under the network tab.






