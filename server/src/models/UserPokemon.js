const Model = require("./Model")

class UserPokemon extends Model {
  static get tableName() {
    return "userPokemons"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["userId", "pokemonId"],
      properties: {
        userId: { type: ["integer", "string"] },
        pokemonId: { type: ["integer", "string"] },
      }
    }
  }

  static get relationMappings() {
    const { User, Pokemon } = require("./index.js")

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "userPokemons.userId",
          to: "users.id"
        }
      },
      pokemon: {
        relation: Model.BelongsToOneRelation,
        modelClass: Pokemon,
        join: {
          from: "userPokemons.pokemonId",
          to: "pokemons.id"
        }
      }
    }
  }
}

module.exports = UserPokemon