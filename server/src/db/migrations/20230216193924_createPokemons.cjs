/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  return knex.schema.createTable("pokemons", (table) => {
    table.bigIncrements("id")
    table.string("name").notNullable()
    table.string("type").notNullable()
    table.string("secondaryType")
    table.string("image").notNullable()
    table.json("abilities").notNullable()
    table.string("hiddenAbility")
    table.json("stats").notNullable()
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now())
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now())
  })
}

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
  return knex.schema.dropTableIfExists("pokemons")
}
