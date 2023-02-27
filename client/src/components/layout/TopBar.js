import React from "react";
import { Link, useLocation } from "react-router-dom";
import SignOutButton from "../authentication/SignOutButton";

const TopBar = ({ user }) => {
  const location = useLocation();
  const unauthenticatedListItems = [
      <li key="sign-in">
        <Link to="/user-sessions/new">Sign In</Link>
      </li>,
      <li key="sign-up">
        <Link to="/users/new" className="button">
          Sign Up
        </Link>
      </li>,
  ];

  const authenticatedListItems = [
    <li key="sign-out">
      <SignOutButton />
    </li>,
  ];

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <ul className="menu">
          <li className="menu-text">PokéBuilder</li>
          {location.pathname !== "/pokemon-team-builder/pokedex" && (
            <li>
              <Link to="/pokemon-team-builder/pokedex">Pokédex</Link>
            </li>
          )}
          {location.pathname !== "/pokemon-team-builder/" && (
            <li>
              <Link to="/pokemon-team-builder/">Back to Search</Link>
            </li>
          )}
          {location.pathname !== "/pokemon-team-builder/team" && (
            <li>
              <Link to="/pokemon-team-builder/team">My Team</Link>
            </li>
          )}
        </ul>
      </div>
      <div className="top-bar-right">
        <ul className="menu">
          {user ? authenticatedListItems : unauthenticatedListItems}
        </ul>
      </div>
    </div>
  );
};

export default TopBar;

