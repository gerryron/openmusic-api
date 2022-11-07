/* eslint-disable comma-dangle */
const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'Albums',
  version: '1.0.0',
  register: async (server, { albumsService, songsService, validator }) => {
    const albumsHandler = new AlbumsHandler(
      albumsService,
      songsService,
      validator
    );
    server.route(routes(albumsHandler));
  },
};
