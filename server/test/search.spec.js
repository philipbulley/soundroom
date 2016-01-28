process.env.MONGO_CONNECT = 'mongodb://testuser:dEjVVRCDuTP56Fyh@ds051534.mongolab.com:51534/spotidrop-test';
process.env.NODE_ENV = 'dev';
process.env.NO_AUTH = true;

var chai = require('chai'),
  request = require('supertest'),
  expect = chai.expect,
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
          expect(res.body[0], 'with artist').to.have.property('artist');
          expect(res.body[0], 'with title').to.have.property('title');
          expect(res.body[0], 'with link').to.have.property('link');
          expect(res.body[0], 'with album').to.have.property('album');

          done();
        });
    });
  });
});
