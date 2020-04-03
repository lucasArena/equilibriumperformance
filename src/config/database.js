module.exports = {
  dialect: 'postgres',
  host: '127.0.0.1',
  username: 'postgres',
  password: 'docker',
  database: 'equilibriumperfomance',
  define: {
    underscored: true,
    underscoredAll: true,
    timestamps: true,
  },
};
