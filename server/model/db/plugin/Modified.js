function Modified( schema, options )
{
  schema.add( {modified: Date} );

  schema.pre( 'save', function( next )
  {
    this.modified = new Date;
    next();
  } );

  if( options && options.index )
  {
    schema.path( 'modified' ).index( options.index );
  }
}

module.exports = Modified;
