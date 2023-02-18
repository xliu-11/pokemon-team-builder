/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  return knex.schema.createTable("teams", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.bigInteger("userId")
         .unsigned()
         .notNullable()
         .index()
         .references("users.id")
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now())
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now())
  });
};

exports.down = async (knex) => {
  return knex.schema.dropTableIfExists("teams");
};

