var chai    = require( 'chai' ),
    expect  = chai.expect,
    request = require( 'supertest' ),
    index   = require( './../index' );

describe( '/api/playlists', function()
{
  var dummyData1, dummyData2;

  before( function( done )
  {
    this.timeout( 10 * 1000 );
    index.onInitComplete.addOnce( done );
  } );

  beforeEach( function()
  {
    dummyData1 = {
      name: 'Mocha Up My Chai',
      description: 'A dummy playlist built by the test runner',
    };

    dummyData2 = {
      name: 'Everyone loves integration testing',
      description: 'A dummy playlist basking in test runner glory',
    }
  } );

  it( 'should `GET /` returning an empty playlist', function( done )
  {
    request( index.app )
        .get( '/api/playlists' )
        .end( function( err, res )
        {
          if( err ) throw err;

          expect( res.headers[ 'content-type' ], 'with json' ).to.contain( 'json' );
          expect( res.body, 'with array' ).to.be.an.instanceof( Array );
          expect( res.status, 'with 200' ).to.equal( 200 );

          done();
        } );
  } );

  it( 'should `POST /` returning a new playlist item', function( done )
  {
    request( index.app )
        .post( '/api/playlists' )
        .send( dummyData1 )
        .end( function( err, res )
        {
          if( err ) throw err;

          expect( res.headers[ 'content-type' ], 'with json' ).to.contain( 'json' );
          expect( res.body, 'with object' ).to.be.an( 'object' );
          expect( res.status, 'with 200' ).to.equal( 200 );
          expect( res.body._id, 'with _id' ).to.exist;
          expect( res.body.modified, 'with modified' ).to.exist;
          expect( res.body.tracks, 'with tracks array' ).to.be.an.instanceof( Array );
          expect( res.body.name, 'with correct name' ).to.equal( dummyData1.name );
          expect( res.body.description, 'with correct description' ).to.equal( dummyData1.description );

          done();
        } );
  } );

  it( 'should `GET /` returning 1 playlist', function( done )
  {
    request( index.app )
        .get( '/api/playlists' )
        .end( function( err, res )
        {
          if( err ) throw err;

          expect( res.headers[ 'content-type' ], 'with json' ).to.contain( 'json' );
          expect( res.body, 'with array' ).to.be.an( 'array' );
          expect( res.status, 'with 200' ).to.equal( 200 );

          // Sequence critical: We're relying on presence of data from previous `POST /` test
          expect( res.body.length, 'with items' ).to.equal( 1 );

          // Verify item's data
          expect( res.body[ 0 ]._id, 'with _id' ).to.exist;
          expect( res.body[ 0 ].modified, 'with modified' ).to.exist;
          expect( res.body[ 0 ].tracks, 'with tracks array' ).to.be.an.instanceof( Array );
          expect( res.body[ 0 ].name, 'with correct name' ).to.equal( dummyData1.name );
          expect( res.body[ 0 ].description, 'with correct description' ).to.equal( dummyData1.description );

          done();
        } );
  } );

  it( 'should `POST /` returning another new playlist item', function( done )
  {
    request( index.app )
        .post( '/api/playlists' )
        .send( dummyData1 )
        .end( function( err, res )
        {
          if( err ) throw err;

          expect( res.headers[ 'content-type' ], 'with json' ).to.contain( 'json' );
          expect( res.body, 'with object' ).to.be.an( 'object' );
          expect( res.status, 'with 200' ).to.equal( 200 );
          expect( res.body._id, 'with _id' ).to.exist;
          expect( res.body.modified, 'with modified' ).to.exist;
          expect( res.body.tracks, 'with tracks array' ).to.be.an.instanceof( Array );
          expect( res.body.name, 'with correct name' ).to.equal( dummyData2.name );
          expect( res.body.description, 'with correct description' ).to.equal( dummyData2.description );

          done();
        } );
  } );

  it( 'should `GET /` returning 2 playlists', function( done )
  {
    request( index.app )
        .get( '/api/playlists' )
        .end( function( err, res )
        {
          if( err ) throw err;

          expect( res.headers[ 'content-type' ], 'with json' ).to.contain( 'json' );
          expect( res.body, 'with array' ).to.be.an( 'array' );
          expect( res.status, 'with 200' ).to.equal( 200 );

          // Sequence critical: We're relying on presence of data from previous `POST /` test
          expect( res.body.length, 'with items' ).to.equal( 2 );

          // Verify 1st item's data
          expect( res.body[ 0 ]._id, 'with _id' ).to.exist;
          expect( res.body[ 0 ].modified, 'with modified' ).to.exist;
          expect( res.body[ 0 ].tracks, 'with tracks array' ).to.be.an.instanceof( Array );
          expect( res.body[ 0 ].name, 'with correct name' ).to.equal( dummyData1.name );
          expect( res.body[ 0 ].description, 'with correct description' ).to.equal( dummyData1.description );

          // Verify 2nd item's data
          expect( res.body[ 1 ]._id, 'with _id' ).to.exist;
          expect( res.body[ 1 ].modified, 'with modified' ).to.exist;
          expect( res.body[ 1 ].tracks, 'with tracks array' ).to.be.an.instanceof( Array );
          expect( res.body[ 1 ].name, 'with correct name' ).to.equal( dummyData2.name );
          expect( res.body[ 1 ].description, 'with correct description' ).to.equal( dummyData2.description );

          done();
        } );
  } );

  // TODO: GET /:playlist_id
  // TODO: PATCH /:playlist_id
  // TODO: PUT /:playlist_id
  // TODO: DELETE /:playlist_id

  // TODO: POST /:playlist_id/tracks

  // TODO: GET /:playlist_id/tracks/:track_id
  // TODO: DELETE /:playlist_id/tracks/:track_id

  // TODO: POST /:playlist_id/tracks/:track_id/upvote
  // TODO: DELETE /:playlist_id/tracks/:track_id/upvote

} );