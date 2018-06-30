const convartAppStaticCache = 'static-AppCache';
const convartAppCoreCache = 'core-AppCache';
const rates = 'rates';
// const openDB = openDatabase();

self.addEventListener('install', event => {

  // Caching App Pages
  event.waitUntil(
    caches.open(convartAppStaticCache).then(cache => cache.addAll([
        '/convartapp/',
        '/convartapp/index.html',
        '/convartapp/src/js/idb.js',
        '/convartapp/src/js/app.js',
        '/convartapp/src/css/app.css'
      ]))
  )
    
});


self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
    
  }


  event.respondWith(getData(event.request));

});

// function saveDataRequest(request) {

//   // Save request in cache and return response
//   const saveRequestRes = fetch(request).then(res => {
//     caches.open(convartAppCoreCache).then(cache => cache.put(request, res));
//     return res;
//   });

//   return caches.match(request).then(response => response || saveRequestRes);
// }

function getData(request){

    const rateResponse = fetch(request).then(res => {
      caches.open(rates).then(cache => cache.put(request, res.clone()));

      return res;
    });

    return caches.match(request).then(response => response ||  rateResponse);

}
