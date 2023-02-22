/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  return knex.schema.createTable("userPokemons", (table) => {
    table.bigIncrements("id")
    table.bigInteger("userId")
         .unsigned()
         .notNullable()
         .index()
         .references("users.id")
    table.bigInteger("pokemonId")
         .unsigned()
         .notNullable()
         .index()
         .references("pokemons.id")    
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now())
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now())
  })
}

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
  return knex.schema.dropTableIfExists("userPokemons")
}
