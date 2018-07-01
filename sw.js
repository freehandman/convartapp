const convartAppCache = 'static-AppCache';

self.addEventListener('install', event => {

  // Caching App Pages
  // /convartapp
  event.waitUntil(
    caches.open(convartAppStaticCache).then(cache => cache.addAll([
        '/convartapp/',
        '/convartapp/index.html',
        '/convartapp/src/js/idb.js',
        '/convartapp/src/js/app.js',
        '/convartapp/src/css/app.css',
        'https://code.jquery.com/jquery-3.3.1.min.js',
      ]))
  )
    
});

// Hijacking fetch request
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || getData(event.request);
    })
  );

});

// Getting Request Data
function getData(request){
  return caches.open(convartAppCache).then(cache => {
    return caches.match(request).then(response => {
      
      const rateResponse = fetch(request).then(res => {
        cache.put(request, res.clone());
        return res;
      });

      return response || rateResponse;
    });
  });

}
