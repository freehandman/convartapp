// window.onload = appSetup;
const getDB = getDatabase();

const setuapp = document.getElementById('setupapp');

// console.log(setuapp);

// Registering Service Worker
if(navigator.serviceWorker){
  navigator.serviceWorker.register('sw.js')
  .then(reg => console.log('Service Worker Resistered!'))
}

setuapp.addEventListener('click', event => {
  launchLoad();
  fetch('https://free.currencyconverterapi.com/api/v5/currencies')
    .then( res => {
      console.log('We Are Ready To Setup Your App!');
      res.json().then(data => {
        for(const results in data){
          if(data.hasOwnProperty(results)){
            const currencies = data[results];
            for (const currency in currencies) {
              
              if (currencies.hasOwnProperty(currency)) {
                // console.log(data);
                const data = currencies[currency];

                // Saving curencies to idb
                getDB.then( db => {
                  if(!db) return;

                  const tranx = db.transaction(['currencies'], 'readwrite');
                  const currencyStore = tranx.objectStore('currencies');

                  currencyStore.put(data, currency);
                  
                  createSelectOptions(data);
                })

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
  });
});


function launchLoad() {
  const welcome = document.getElementById('welcome');
  welcome.style.display = 'none';
}

// Creating a idb
function getDatabase() {
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }

  return idb.open('appDataBase', 1, upgradeDb => {
    const curencies = upgradeDb.createObjectStore('currencies');
    const rates = upgradeDb.createObjectStore('rates');
  });
}



// App SetUp

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
                // console.log(data);
                const data = currencies[currency];

                // Saving curencies to idb
                getDB.then( db => {
                  if(!db) return;

                  const tranx = db.transaction(['currencies'], 'readwrite');
                  const currencyStore = tranx.objectStore('currencies');

                  currencyStore.put(data, currency);
                  
                  createSelectOptions(data);
                })

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
    // appSetup();
  });

}



// Recieves data and populates to select
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




  // Save all combinations and rates

  // Create template