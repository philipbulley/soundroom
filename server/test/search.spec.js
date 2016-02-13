require('./helper/env');

const expect = require('chai').expect,
  request = require('supertest'),
  index = require('../index');

describe('/api/search', function () {
  this.timeout(5000);

  describe('GET', function () {

    it('should return empty array', function (done) {
      request(index.app).get('/api/search')
        .end(function (err, res) {
          if (err) {
            throw err;
          }

          expect(res.headers['content-type'], 'with json').to.contain('json');
          expect(res.status, 'with 200').to.equal(200);
          expect(res.body, 'with array').to.be.an.instanceof(Array);
          expect(res.body.length, 'with length zero').to.eql(0);

          done();
        });
    });

    it('should return search results', function (done) {
      request(index.app).get('/api/search/run%20dmc')
        .end(function (err, res) {
          if (err) {
            throw err;
          }

          expect(res.headers['content-type'], 'with json').to.contain('json');
          expect(res.status, 'with 200').to.equal(200);
          expect(res.body, 'with array').to.be.an.instanceof(Array);
          expect(res.body, 'with length').to.have.length.above(0);
          expect(res.body[0], 'with id').to.have.property('id');
          expect(res.body[0], 'with artist').to.have.property('artist');
          expect(res.body[0], 'with name').to.have.property('name');

          done();
        });
    });
  });
});
