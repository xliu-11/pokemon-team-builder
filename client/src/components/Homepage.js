import React, { useState, useEffect } from "react"
import { Redirect } from "react-router-dom"

const Homepage = props => {
  const [pokemonName, setPokemonName] = useState("")
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleInputChange = event => {
    setPokemonName(event.target.value)
  }

  const searchPokemon = async event => {
    event.preventDefault()
    try {
      if (!pokemonName) {
        setErrorMessage("Please enter a Pokémon name.")
        return
      }
      setErrorMessage("")
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      if (!response.ok) {
        if (response.status === 404) {
          setErrorMessage("Could not find a Pokémon with that name.")
          return
        }
        const errorMessage = `${response.status} (${response.statusText})`
        const error = new Error(errorMessage)
        throw(error)
      }
      setShouldRedirect(true)
    } catch(err) {
        console.error(`Error in fetch: ${err.message}`)
    }
  }

  if (shouldRedirect) {
    return <Redirect push to={{pathname: "/pokemon-team-builder/details", state: { pokemonName: pokemonName }}} />
  }

  return (
    <div className="text-center" style={{backgroundColor: "lightblue"}}>
      <h1>Welcome to Simple Pokemon Team Builder</h1>
      <h5>Please enter the name of a Pokémon that you would like to know more about:</h5>
      <form onSubmit={searchPokemon}>
        <input 
          type="text"
          style={{ width: "20%", margin: "20px auto", padding: "10px", borderRadius: "10px", border: "1px solid #ccc" }}
          onChange={handleInputChange}
          value={pokemonName}
        />
      </form>

      { errorMessage && 
        <div className="error-message">{errorMessage}</div>
      }

      <div>
        <input 
          className="button" 
          type="submit" 
          value="Search Pokémon!" 
          onClick={searchPokemon} 
          style={{ width: "20%", padding: "10px", borderRadius: "10px", border: "1px solid #ccc", backgroundColor: "dodgerblue", color: "white", marginTop: "20px" }}
        />
      </div>
    </div>
  )   
}

export default Homepage
