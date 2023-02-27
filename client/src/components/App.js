import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { hot } from "react-hot-loader/root";
import getCurrentUser from "../services/getCurrentUser";
import "../assets/scss/main.scss";
import RegistrationForm from "./registration/RegistrationForm";
import SignInForm from "./authentication/SignInForm";
import TopBar from "./layout/TopBar";

import Homepage from "./Homepage";
import PokemonShow from "./PokemonShow";
import PokemonTeam from "./PokemonTeam";
import Pokedex from "./Pokedex";

const App = (props) => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser()
      setCurrentUser(user)
    } catch(err) {
      setCurrentUser(null)
    }
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  return (
    <Router>
      <TopBar user={currentUser} />
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/pokemon-team-builder/pokedex" component={Pokedex} />
        <Route exact path="/pokemon-team-builder/team" component={PokemonTeam} />
        <Route exact path="/pokemon-team-builder/details/:name" component={PokemonShow} />
        <Route exact path="/pokemon-team-builder" component={Homepage} />
        <Route exact path="/users/new" component={RegistrationForm} />
        <Route exact path="/user-sessions/new" component={SignInForm} />
      </Switch>
    </Router>
  );
};

export default hot(App);
