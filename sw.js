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
  console.log('I\'m here New Fetch');
  
  event.respondWith(
    caches.match(event.request).then(function(response) {
      console.log('I\'m here New IN origin');
      return response || getData(event.request);
    })
  );

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

  console.log('I\'m here');
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
