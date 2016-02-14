const model = Object.create(null, {
  isConnected: {
    value: false,
    writable: true
  },
  currentPlaylistId: {
    value: null,
    writable: true
  },
  currentPlaylistTrack: {
    value: null,
    writable: true
  }
});

export default model;
