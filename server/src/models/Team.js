const Model = require("./Model");
const Pokemon = require("./Pokemon")
const User = require("./User")

class Team extends Model {
  static get tableName() {
    return "teams";
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "teams.userId",
          to: "users.id",
        },
      },
      pokemons: {
        relation: Model.ManyToManyRelation,
        modelClass: Pokemon,
        join: {
          from: "teams.id",
          through: {
            from: "teams_pokemons.teamId",
            to: "teams_pokemons.pokemonId",
          },
          to: "pokemons.id",
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        name: { type: "string" },
      },
    };
  }
}

module.exports = Team;
