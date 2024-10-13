/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
      .createTable('categories', (table) => {
        table.increments('category_id').primary();
        table.string('name', 100).unique().notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
      })
      .createTable('inventory', (table) => {
        table.increments('item_id').primary();
        table.string('name', 100).notNullable();
        table.string('sku', 50).unique().notNullable();
        table.decimal('price', 10, 2).notNullable();
        table.integer('quantity').defaultTo(0);
        table.integer('category_id').unsigned().references('category_id').inTable('categories');
        table.string('supplier', 100);
        table.timestamp('created_at').defaultTo(knex.fn.now());
      })
      .createTable('sales', (table) => {
        table.increments('sale_id').primary();
        table.integer('item_id').unsigned().references('item_id').inTable('inventory');
        table.integer('quantity').notNullable();
        table.decimal('sale_price', 10, 2).notNullable();
        table.timestamp('sale_date').defaultTo(knex.fn.now());
        table.text('remarks');
      });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema
      .dropTableIfExists('sales')
      .dropTableIfExists('inventory')
      .dropTableIfExists('categories');
  };
  