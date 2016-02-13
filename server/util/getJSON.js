import https from 'https';
import Q from 'q';

const getJSON = (url) => {
  const deferred = Q.defer();

  https.get(url, (res) => {
    res.setEncoding('utf8');

    let body = '';

    res.on('data', (chunk) => {
      body += chunk;
    });

    res.on('end', () => {
      deferred.resolve(JSON.parse(body));
    });

  }).on('error', (err) => {
    console.error(err);
    deferred.reject(err);
  });

  return deferred.promise;
};

export default getJSON;
