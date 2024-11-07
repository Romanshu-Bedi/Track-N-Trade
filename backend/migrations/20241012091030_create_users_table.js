/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('user_id').primary(); // Auto-incrementing primary key
    table.string('clerk_id').unique().notNullable(); // Unique Clerk ID from Clerk
    table.string('email').notNullable();
    table.string('first_name');
    table.string('last_name');
    // table.timestamp('created_at').notNullable(); // Clerk's created_at timestamp
    // table.timestamp('updated_at').notNullable(); // Clerk's updated_at timestamp
    // table.string('profile_image_url'); // URL to the user's profile image
    // table.string('primary_email_address_id').unique(); // ID of the primary email address
    // table.boolean('two_factor_enabled').defaultTo(false); // Boolean for two-factor authentication status
    // table.string('external_id').unique().nullable(); // Optional external ID if provided
  });
};

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
