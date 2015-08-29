function Modified(schema, options) {


  schema.add({modified: Date});
  schema.pre('save', function (next) {
    this.modified = new Date;
    next();
  });

  // findOneAndUpdate hook was added in Mongoose 4
  schema.pre('findOneAndUpdate', function () {
    this.findOneAndUpdate({}, {modified: new Date});
  });

  if (options && options.index)
    schema.path('modified').index(options.index);
}

module.exports = Modified;
