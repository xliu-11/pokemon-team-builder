const Model = require("./Model")

class Pokemon extends Model {
  static get tableName() {
    return "pokemons"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string" },
      }
    }
  }

  static get relationMappings() {
    const { User, UserPokemon } = require("./index.js")

    return {
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: "pokemons.id",
          through: {
            from: "userPokemons.pokemonId",
            to: "userPokemons.userId"
          },
          to: "users.id"
        }
      },
      userPokemons: {
        relation: Model.HasManyRelation,
        modelClass: UserPokemon,
        join: {
          from: "pokemons.id",
          to: "userPokemons.pokemonId"
        }
      }
    }
  }
}

module.exports = Pokemon