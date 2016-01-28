# Spotidrop Server

Democratic playlist server for Spotify.

Requires node `0.12.x` due to dependency on [node-spotify](https://www.npmjs.com/package/node-spotify). You can use [n](https://www.npmjs.com/package/n) to interactively manage node versions on your development machine.

## Setting up on Mac OSX

1. Install libspotify via homebrew

        $ brew install homebrew/binary/libspotify

1. For the homebrew installation to work with node-spotify, you'll need to remove the file extension from the alias

    $ cd /usr/local/Cellar/libspotify/12.1.51/lib/
    $ mv libspotify.dylib libspotify

1. Assuming you have node.js already installed:

    $ cd ./server
    $ npm install

Now you've installed, see "Running the node app" later on in this document.


## Setting up on Raspberry Pi

1. Download and install [NOOBS](https://www.raspberrypi.org/downloads/) and install Raspbian.

1. Plug in your ethernet cable or wifi dongle. Follow instructions in [How-To: Add WiFi to the Raspberry Pi](http://raspberrypihq.com/how-to-add-wifi-to-the-raspberry-pi/) if using wifi.

1. Install nodejs ([extra info here](http://weworkweplay.com/play/raspberry-pi-nodejs/)):

        $ wget http://node-arm.herokuapp.com/node_latest_armhf.deb
        $ sudo dpkg -i node_latest_armhf.deb

1. Install node-gyp globally

        $ sudo npm install -g node-gyp

1. Check your version of `g++`.

        $ g++ -v

    If < 4.7, you need to update it ([more info here](https://www.youtube.com/watch?v=EabkMaJ-3nk)).

        $ sudo apt-get install gcc-4.7 g++-4.7

        $ sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.6 60 --slave /usr/bin/g++ g++ /usr/bin/g++-4.6

        $ sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.7 40 --slave /usr/bin/g++ g++ /usr/bin/g++-4.7

        $ sudo update-alternatives --config gcc

1. Download the `eabi-armv6hf` version of [libspotify](https://developer.spotify.com/technologies/libspotify/). Extract tarball, open the README and follow instructions:

        $ cd YOUR_LIBSPOTIFY_EXTRACTED_DIR
        $ sudo make install prefix=/usr/local

    Add the following to your `.bashrc`:

        export PKG_CONFIG_PATH=/usr/local/lib
        export LD_LIBRARY_PATH=/usr/local/lib

1. Install libasound2-dev

        $ sudo apt-get install libasound2-dev


1. You can now install and build [node-spotify](https://github.com/FrontierPsychiatrist/node-spotify). Either `sudo npm install` if it's in `package.json` or

        $ sudo npm install node-spotify

    You should see output similar to the following:


        pi@raspberrypi ~/spotifytest $ sudo npm install node-spotify --save
        -
        > node-spotify@0.7.1 install /home/pi/spotifytest/node_modules/node-spotify
        > node-gyp rebuild

        gyp WARN EACCES user "root" does not have permission to access the dev dir "/root/.node-gyp/0.12.1"
        gyp WARN EACCES attempting to reinstall using temporary dev dir "/home/pi/spotifytest/node_modules/node-spotify/.node-gyp"
        child_process: customFds option is deprecated, use stdio instead.
        make: Entering directory '/home/pi/spotifytest/node_modules/node-spotify/build'
          COPY Release/spotify.js
          COPY Release/metadataUpdater.js
          CXX(target) Release/obj.target/nodespotify/src/node-spotify.o
          CC(target) Release/obj.target/nodespotify/src/audio/audio.o
          CXX(target) Release/obj.target/nodespotify/src/audio/AudioHandler.o
          CXX(target) Release/obj.target/nodespotify/src/audio/NodeAudioHandler.o
          CXX(target) Release/obj.target/nodespotify/src/callbacks/PlaylistCallbacksHolder.o
          CXX(target) Release/obj.target/nodespotify/src/callbacks/SessionCallbacks.o
          CXX(target) Release/obj.target/nodespotify/src/callbacks/SessionCallbacks_Audio.o
          CXX(target) Release/obj.target/nodespotify/src/callbacks/SearchCallbacks.o
          CXX(target) Release/obj.target/nodespotify/src/callbacks/AlbumBrowseCallbacks.o
          CXX(target) Release/obj.target/nodespotify/src/callbacks/ArtistBrowseCallbacks.o
          CXX(target) Release/obj.target/nodespotify/src/callbacks/PlaylistContainerCallbacksHolder.o
          CXX(target) Release/obj.target/nodespotify/src/utils/ImageUtils.o
          CXX(target) Release/obj.target/nodespotify/src/utils/V8Utils.o
          CXX(target) Release/obj.target/nodespotify/src/objects/spotify/Track.o
          CXX(target) Release/obj.target/nodespotify/src/objects/spotify/Artist.o
          CXX(target) Release/obj.target/nodespotify/src/objects/spotify/Playlist.o
          CXX(target) Release/obj.target/nodespotify/src/objects/spotify/PlaylistContainer.o
          CXX(target) Release/obj.target/nodespotify/src/objects/spotify/Album.o
          CXX(target) Release/obj.target/nodespotify/src/objects/spotify/Search.o
          CXX(target) Release/obj.target/nodespotify/src/objects/spotify/Spotify.o
          CXX(target) Release/obj.target/nodespotify/src/objects/spotify/Player.o
          CXX(target) Release/obj.target/nodespotify/src/objects/spotify/PlaylistFolder.o
          CXX(target) Release/obj.target/nodespotify/src/objects/spotify/User.o
          CXX(target) Release/obj.target/nodespotify/src/objects/spotify/TrackExtended.o
          CXX(target) Release/obj.target/nodespotify/src/objects/node/NodeTrack.o
          CXX(target) Release/obj.target/nodespotify/src/objects/node/NodeArtist.o
          CXX(target) Release/obj.target/nodespotify/src/objects/node/NodePlaylist.o
          CXX(target) Release/obj.target/nodespotify/src/objects/node/NodeAlbum.o
          CXX(target) Release/obj.target/nodespotify/src/objects/node/NodePlayer.o
          CXX(target) Release/obj.target/nodespotify/src/objects/node/NodeSearch.o
          CXX(target) Release/obj.target/nodespotify/src/objects/node/NodeSpotify.o
          CXX(target) Release/obj.target/nodespotify/src/objects/node/NodePlaylistFolder.o
          CXX(target) Release/obj.target/nodespotify/src/objects/node/NodePlaylistContainer.o
          CXX(target) Release/obj.target/nodespotify/src/objects/node/NodeUser.o
          CXX(target) Release/obj.target/nodespotify/src/objects/node/NodeTrackExtended.o
          CC(target) Release/obj.target/nodespotify/src/audio/alsa-audio.o
          CXX(target) Release/obj.target/nodespotify/src/audio/NativeAudioHandler.o
          SOLINK_MODULE(target) Release/obj.target/nodespotify.node
          SOLINK_MODULE(target) Release/obj.target/nodespotify.node: Finished
          COPY Release/nodespotify.node
        make: Leaving directory '/home/pi/spotifytest/node_modules/node-spotify/build'
        node-spotify@0.7.1 node_modules/node-spotify
        └── nan@1.8.4

1. If all went well, you should be able to connect to spotify via the node app using your premium account and app key. No app key? [Request and download a binary app key here](https://devaccount.spotify.com/my-account/keys/).

1. Optional. If you're on Windows, it's nice to access the Pi via the filesystem. [Install Samba on the Pi](http://raspberrypihq.com/how-to-share-a-folder-with-a-windows-computer-from-a-raspberry-pi/).

1. But you can always SSH

        pi $ ip addr show
        you $ ssh pi@IP_ADDRESS_OF_PI
        pi@IP_ADDRESS_OF_PI's password: raspberry


## Running the node app

The app requires that you've setup certain environment variables. The best way to do this is via a [.env](https://www.npmjs.com/package/dotenv) file. Create a file called `.env` next to `index.js`, add the following:

    NODE_ENV = 'dev'
    PORT = 8123
    
    SPOTIFY_APP_KEY = './spotify_appkey.key'
    SPOTIFY_USERNAME = 'your_spotify_premium_username'
    SPOTIFY_PASSWORD = 'your_spotify_premium_password'
    MOCK_SPOTIFY='false'
    
    MONGO_CONNECT = 'mongodb://your_mongo_username:your_mongo_password@ds123456.mongolab.com:12345/soundroom'
    
    # auth
    GOOGLE_CLIENT_ID = '123456.apps.googleusercontent.com'
    GOOGLE_CLIENT_SECRET = '123456'
    
    TWITTER_CONSUMER_KEY = '123456'
    TWITTER_CONSUMER_SECRET = '123456'
    
    FACEBOOK_APP_ID = '123456'
    FACEBOOK_APP_SECRET = '123456'
    
    SPOTIFY_CLIENT_ID = '123456'
    SPOTIFY_CLIENT_SECRET = '123456'
    
    AUTH_USER = 'postman'
    AUTH_PASS = 'postman1234567890'
    NO_AUTH = true;


* `NODE_ENV` is used primarily to determine if the app is in a dev environment, try not to rely on this and instead use env vars specific to the requirement
* `PORT` is used by the express http server
* `SPOTIFY_APP_KEY` Points to your Spotify binary key. This links libspotify with a Spotify developer account.
* `SPOTIFY_USERNAME` and `SPOTIFY_PASSWORD` specify the user account that libspotify will login using. This must be a paid for Spotify Premium account.
* `MONGO_CONNECT` is the connection string pointing to your mongo instance, ie. `mongodb://username:password@hostname.foo.bar:27017/spotidrop-xxxx`

Start the app like so

    $ npm start

### Can't hear any audio?

If you don't hear audio, you may need to [change the default output](https://www.raspberrypi.org/documentation/configuration/audio-config.md).

    amixer cset numid=3 1

* Here the output is being set to `2`, which is HDMI.
* Setting the output to `1` switches to analogue (headphone jack).
* The default setting is `0` which is automatic.


## node-spotify

* [Github](https://github.com/FrontierPsychiatrist/node-spotify)
* [API Docs](http://www.node-spotify.com/api.html)


## Tests

First install mocha globally:

    $ npm install mocha -g

To run tests:

    $ mocha

This includes integration tests, for which you'll require a connection to the database to be established.
