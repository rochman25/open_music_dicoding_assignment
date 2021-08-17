const routes = (handler) => [
  {
    method: 'POST',
    path: '/exports/playlists/{id}',
    handler: handler.postExportPlaylistHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
];

module.exports = routes;
