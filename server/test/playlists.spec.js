var chai    = require( 'chai' ),
    expect  = chai.expect,
    request = require( 'supertest' ),
    index   = require( './../index' );

describe( '/api/playlists', function()
{
  var dummyData;

  before( function( done )
  {
    this.timeout( 10 * 1000 );
    index.onInitComplete.addOnce( done );
  } );

  beforeEach( function()
  {
    dummyData = {
      name: 'Mocha Up My Chai',
      description: 'A dummy playlist built by the test runner',
    }
  } );

  it( 'GET / responds', function( done )
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

  it( 'POST / responds', function( done )
  {
    request( index.app )
        .post( '/api/playlists' )
        .send( dummyData )
        .end( function( err, res )
        {
          if( err ) throw err;

          expect( res.headers[ 'content-type' ], 'with json' ).to.contain( 'json' );
          expect( res.body, 'with object' ).to.be.an( 'object' );
          expect( res.status, 'with 200' ).to.equal( 200 );
          expect( res.body._id, 'with _id' ).to.exist;
          expect( res.body.modified, 'with modified' ).to.exist;
          expect( res.body.tracks, 'with tracks array' ).to.be.an.instanceof( Array );
          expect( res.body.name, 'with correct name' ).to.equal( dummyData.name );
          expect( res.body.description, 'with correct description' ).to.equal( dummyData.description );

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