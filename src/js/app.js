const getDB = getDatabase();
const setuapp = document.getElementById('setupapp');
const convart = document.getElementById('convart');

// Registering Service Worker
if(navigator.serviceWorker){
  navigator.serviceWorker.register('sw.js')
  .then(reg => console.log('Service Worker Resistered!'))
}

setuapp.addEventListener('click', event => {
  closeSplash();
  // console.log(event.target);
  getDB.then( db => {

    // If db is populated, get from db
    if(db){
                      
      const tx = db.transaction(['currencies'], 'readwrite');
      const currencyStore = tx.objectStore('currencies');

      return currencyStore.getAll().then(currencies => {
          for (const currency of currencies) {
            createSelectOptions(currency);
          }
        }
      ).then(results => {
        if (!results) {
          
          // or, fetch from network
          fetch('https://free.currencyconverterapi.com/api/v5/currencies')
            .then( res => {
              console.log('We are setting up your App!');
              res.json().then(data => {
                for(const results in data){
                  if(data.hasOwnProperty(results)){
                    const currencies = data[results];
                    for (const currency in currencies) {
                      
                      if (currencies.hasOwnProperty(currency)) {
                        // console.log(data);
                        const data = currencies[currency];
      
                        // Saving curencies to idb
                        const tranx = db.transaction(['currencies'], 'readwrite');
                        const currencyStore = tranx.objectStore('currencies');
      
                          currencyStore.put(data, currency);
                          
                          createSelectOptions(data);
                          
                        }
                        
                      }
                      
                      console.log('All Good AppData Setup Complete! Enjoy');
                      
                      return;
                    }
                  }
                });
              })
              .catch(err => {
                console.log(err);
                appSetup();
                closeLoader();
          });
        }
      });

    
    }
    
    
  }).then(e => closeLoader())

});

convart.addEventListener('click', event => {
  convartNow();
});

// Animation
function closeSplash() {
  const welcome = document.getElementById('welcome');
  welcome.classList.add('fadeOutUp');
}

// Animation
function closeLoader() {
  const loader = document.getElementById('loader');
  loader.classList.add('fadeOut');
}

// Creating a idb connection
function getDatabase() {
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }

  return idb.open('appDataBase', 1, upgradeDb => {
    const curencies = upgradeDb.createObjectStore('currencies');
    const rates = upgradeDb.createObjectStore('rates');
  });
}



// Initial App SetUp
function appSetup() {
  
  fetch('https://free.currencyconverterapi.com/api/v5/currencies')
    .then( res => {
      console.log('We Are Ready To Setup Your App!');
      res.json().then(data => {
        for(const results in data){
          if(data.hasOwnProperty(results)){
            const currencies = data[results];
            for (const currency in currencies) {
              
              if (currencies.hasOwnProperty(currency)) {
                const data = currencies[currency];

                // Backup Currencies
                getDB.then( db => {
                  if(!db) return;

                  const tranx = db.transaction(['currencies'], 'readwrite');
                  const currencyStore = tranx.objectStore('currencies');

                  currencyStore.put(data, currency);
                  
                  createSelectOptions(data);
                }).then(e => closeLoader())

              }
              
            }

            console.log('All Good AppData Setup Complete! Enjoy');
            
            return;
          }
        }
      });
  })
  .catch(err => {
    console.log('Something went wrong!');
    closeLoader();
  });

}



// Populate to select
function createSelectOptions({ id, currencyName, currencySymbol = id}) {
  const selectFrom = document.getElementById('selectFrom');
  const selectTo = document.getElementById('selectTo');
  const option = document.createElement('option');
  const innerText = document.createTextNode(`(${currencySymbol}) ${currencyName}`);
  option.value = id;
  option.appendChild(innerText);
  selectFrom.appendChild(option.cloneNode(true));
  selectTo.appendChild(option);
  return;
}

function convartNow() {
  const fromId = document.getElementById('selectFrom').value;
  const toId = document.getElementById('selectTo').value;
  const results = document.getElementById('results');
  const amount = document.getElementById('amount').value;

  getDB.then(db => {
    if(db){
      return db.transaction('rates').objectStore('rates').get(`${fromId}_${toId}`);
    }
    
  }).then(foundData => {
    if(foundData){
      
      results.textContent = `${amount * foundData.val} ${toId}`;
      return;
    }


    fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${fromId}_${toId}&compact=y`)
    .then(res => {
      res.json().then( result => {
        for(const data in result){
          if(result.hasOwnProperty(data)){
            const rate = result[data];
            
            // Create db backup
            getDB.then(db => {
            const tranx = db.transaction(['rates'], 'readwrite');
            tranx.objectStore('rates').put(rate,`${fromId}_${toId}` );
            })

            results.textContent = `${amount * rate.val} ${toId}`;
            return;
          }
        }
      })
    });

  });
}