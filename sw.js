const convartAppStaticCache = 'static-AppCache';
const rates = 'rates';
// const openDB = openDatabase();


self.addEventListener('install', event => {

  // Caching App Pages
  event.waitUntil(
    caches.open(convartAppStaticCache).then(cache => cache.addAll([
        '/convartapp',
        '/convartapp/index.html',
        '/convartapp/src/js/idb.js',
        '/convartapp/src/js/app.js',
        '/convartapp/src/css/app.css',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
        'https://code.getmdl.io/1.3.0/material.indigo-pink.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css',
        'https://code.getmdl.io/1.3.0/material.min.js'
      ]))
  )
    
});

// Hijacking fetch request
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  console.log('I\'m here New Fetch');
  
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || getData(event.request);
    })
  );

});

// Getting Request Data
function getData(request){
  return caches.open(rates).then(cache => {
    return caches.match(request).then(response => {
      
      const rateResponse = fetch(request).then(res => {
        cache.put(request, res.clone());
        return res;
      });

      return response || rateResponse;
    });
  });

}
