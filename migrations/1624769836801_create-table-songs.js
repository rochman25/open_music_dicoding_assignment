/* eslint-disable linebreak-style */
/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },

    title: {
      type: 'TEXT',
      notNull: true,
    },

    year: {
      type: 'NUMERIC',
      notNull: true,
    },

    performer: {
      type: 'TEXT',
      notNull: true,
    },

    genre: {
      type: 'TEXT',
      notNull: true,
    },

    duration: {
      type: 'NUMERIC',
      notNull: true,
    },

    insertedAt: {
      type: 'TEXT',
      notNull: true,
    },

    updatedAt: {
      type: 'TEXT',
      notNull: true,
    },

  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
