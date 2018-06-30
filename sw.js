
self.importScripts('/src/js/idb.js');

// 1

// Caching App 
const convartAppStaticCache = 'staticAppCache';
const convartAppCoreCache = 'coreAppCache';
const currencyData = 'currencyData';
const openDB = openDatabase();

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
    .then(function(){

      // Caching curency Data
      fetch('https://free.currencyconverterapi.com/api/v5/currencies')
        .then(res => {
          res.json()
          .then(data => {
            for(const results in data){
              if(data.hasOwnProperty(results)){
                const currencies = data[results];
                for (const currency in currencies) {
                  
                  if (currencies.hasOwnProperty(currency)) {
                    // console.log(data);
                    const data = currencies[currency];
                    const openDB = openDatabase();

                    // Saving curencies to idb
                    openDB.then( db => {
                      if(!db) return;

                      const tranx = db.transaction(['currencies'], 'readwrite');
                      const currencyStore = tranx.objectStore('currencies');

                      currencyStore.put(data, currency);
                      
                    })
                  }
                  
                }
                
              }
            }
          });
        })
      })
    )
});


// self.addEventListener('activate', function(event) {
//   event.waitUntil(
//     // delete old cache
//     // create new cache
//   );
// });

self.addEventListener('fetch', function (event) {
  let requestUrl = new URL(event.request.url);
  console.log(`SW Fetching... ${requestUrl}`);

  if (requestUrl.pathname.endsWith('/currencies')) {
    event.respondWith(getData(event.request));
    return;
  }

  event.respondWith(saveDataRequest(event.request));
});


function saveDataRequest(request) {

  // Save request in cache and 
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




  // const UpdateSetApp = fetch(request)
  //   .then(res => {
  //     res.json()
  //     .then(data => {
  //       for(const results in data){
  //         if(data.hasOwnProperty(results)){
  //           const currencies = data[results];
  //           for (const currency in currencies) {
              
  //             if (currencies.hasOwnProperty(currency)) {
  //               // console.log(data);
  //               const data = currencies[currency];
  //               const openDB = openDatabase();

  //               // Saving curencies to idb
  //               openDB.then( db => {
  //                 if(!db) return;

  //                 const tranx = db.transaction(['currencies'], 'readwrite');
  //                 const currencyStore = tranx.objectStore('currencies');

  //                 currencyStore.put(data, currency);
                  
  //               })
  //             }
              
  //           }
            
  //         }
  //       }
  //     });
  //   });


  // return openDB.then( db => {

  //   if(db){
  //     const tranx = db.transaction(['currencies'], 'readwrite');
  //     const currencyStore = tranx.objectStore('currencies');

  //     return currencyStore.getAll().then(currencies => new Response(currencies) || new Response(UpdateSetApp));

  //   }
  // });
}



function openDatabase() {
  
  return idb.open('appDataBase', 1, upgradeDb => {
    const curencies = upgradeDb.createObjectStore('currencies');
    const rates = upgradeDb.createObjectStore('rates');
  });
}


// saving rates
function populatingRates(currencies) {
  for (const fromCurrency of currencies) {
    const fromCurrency = currency;

    for (const currency of currencies) {
      fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${fromCurrency}_${currency}`)
      .then()
    }
  }
}