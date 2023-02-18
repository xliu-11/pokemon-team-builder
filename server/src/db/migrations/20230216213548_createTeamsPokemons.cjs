/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  await knex.schema.createTable('teams_pokemons', (table) => {
    table.bigInteger('teamId')
         .unsigned()
         .notNullable()
         .index()
         .references('teams.id')
         .onDelete('CASCADE')
    table.bigInteger('pokemonId')
         .unsigned()
         .notNullable()
         .index()
         .references('pokemons.id')
         .onDelete('CASCADE')
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now())
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now())
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('teams_pokemons');
};

