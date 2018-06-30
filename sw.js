const convartAppStaticCache = 'static-AppCache';
const convartAppCoreCache = 'core-AppCache';
const currencyData = 'currencyData';
// const openDB = openDatabase();

self.addEventListener('install', event => {

  // Caching App Pages
  event.waitUntil(
    caches.open(convartAppStaticCache).then(cache => {
      return cache.addAll([
        '/',
        'src/js/idb.js',
        'src/js/app.js',
        'src/css/app.css'
      ]);
    })
  )
    
});


function saveDataRequest(request) {

  // Save request in cache and return response
  const saveRequestRes = fetch(request).then(res => {
    caches.open(convartAppCoreCache).then(cache => cache.put(request, res));
    return res;
  });

  return caches.match(request).then(response => response || saveRequestRes);
}

function getData(request){

    const currencyResponseData = fetch(request).then(res => {
      caches.open(currencyData).then(cache => cache.put(request, res));

      return res;
    });

    return caches.match(request).then(response => response ||  currencyResponseData);

}