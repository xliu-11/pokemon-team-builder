Pokémon Team Builder

The Pokémon Team Builder app allows users to create and manage their own Pokemon teams. Users can search for Pokemon in either the Search page or the Pokédex page, view their details, and add them to their team. The team page displays the user's current team and allows them to remove Pokémon from it.

Technologies Used:

React
Node.js
Express
PostgreSQL


Installation

Clone the repository to your local machine.

Install Node.js and PostgreSQL if you haven't already.

Navigate to the project directory in your terminal and run npm install to install the necessary dependencies.

Create a PostgreSQL database and add the necessary tables using the SQL files in the database directory.

Create a .env file in the root directory and add your PostgreSQL database URL and a secret key for JSON Web Tokens.

Example:

DATABASE_URL=postgres://user:password@localhost:5432/pokemon_team_builder

SECRET_KEY=mysecretkey

Start the server by running npm start in your terminal.
In a separate terminal window, navigate to the client directory and run npm start to start the client.

Usage
Once the app is running, start by either registering or signing in. Here is an sample sign in that you can use:

Email: red@pokemon.com
Password: charizard

You can search for a Pokémon by name from the homepage or navigate to the Pokédex page in the top bar to search for a Pokémon. This will take you to the details page, where it will display the relevant details of the Pokémon.You have the option to add the Pokémon to your team from the details page by clicking the "Add to Team" button to add it to your team.

You can view your current team at any time by clicking the "Team" link in the navigation bar. Click the "Remove" button next to a Pokémon to remove it from your team.

Contributing

If you'd like to contribute to this project, feel free to submit a pull request. Please make sure to follow the existing code style and add tests for any new functionality.