function DateFields(schema, options) {

  schema.add({modified: Date, created: Date});

  schema.pre('save', function (next) {
    const date = new Date;

    if (this.isModified()) {
      this.modified = date;
    }

    if (typeof this.created === 'undefined') {
      this.created = this.modified = date;
    }

    next();
  });

  // findOneAndUpdate hook was added in Mongoose 4
  schema.pre('findOneAndUpdate', function () {
    this.findOneAndUpdate({}, {modified: new Date});
  });

  if (options && options.index) {
    schema.path('modified').index(options.index);
    schema.path('created').index(options.index);
  }
}

export default DateFields;
