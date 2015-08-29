function DateFields(schema, options) {

  schema.add({modified: Date, created: Date});
  schema.pre('save', function (next) {

    this.modified = new Date;

    if(typeof this.created === 'undefined'){
      this.created = this.modified;
    }

    next();
  });

  // findOneAndUpdate hook was added in Mongoose 4
  schema.pre('findOneAndUpdate', function () {
    this.findOneAndUpdate({}, {modified: new Date});
  });

  if (options && options.index){
    schema.path('modified').index(options.index);
    schema.path('created').index(options.index);
  }
}

module.exports = DateFields;
