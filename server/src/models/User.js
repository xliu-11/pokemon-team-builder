/* eslint-disable import/no-extraneous-dependencies */
const Bcrypt = require("bcrypt");
const unique = require("objection-unique");
const Model = require("./Model");

const saltRounds = 10;

const uniqueFunc = unique({
  fields: ["email", "userName"],
  identifiers: ["id"],
});

class User extends uniqueFunc(Model) {
  static get tableName() {
    return "users";
  }

  set password(newPassword) {
    this.cryptedPassword = Bcrypt.hashSync(newPassword, saltRounds);
  }

  authenticate(password) {
    return Bcrypt.compareSync(password, this.cryptedPassword);
  }

  static get relationMappings() {
    const { UserPokemon, Pokemon } = require("./index.js")

    return {
      pokemons: {
        relation: Model.ManyToManyRelation,
        modelClass: Pokemon,
        join: {
          from: "users.id",
          through: {
            from: "userPokemons.userId",
            to: "userPokemons.pokemonId"
          },
          to: "pokemons.id"
        }
      },
      userPokemons: {
        relation: Model.HasManyRelation,
        modelClass: UserPokemon,
        join: {
          from: "users.id",
          to: "userPokemons.userId"
        }
      }
    }
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["email", "userName"],

      properties: {
        userName: { type: "string" },
        email: { type: "string" },
        cryptedPassword: { type: "string" },
      },
    };
  }

  $formatJson(json) {
    const serializedJson = super.$formatJson(json);

    if (serializedJson.cryptedPassword) {
      delete serializedJson.cryptedPassword;
    }

    return serializedJson;
  }
}

module.exports = User;
