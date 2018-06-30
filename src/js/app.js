window.onload = appSetup;
const getDB = getDatabase();

const setuapp = document.getElementById('setupapp');

setuapp.addEventListener('click', appSetup());

// Registering Service Worker
if(navigator.serviceWorker){
  navigator.serviceWorker.register('sw.js')
  .then(function (reg) {
     console.log('Service Worker Resistered!');
  })
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
            
            return;
          }
        }
      });
  })
  .catch(err => appSetup());


  // // Get data from idb
  // getDB.then( db => {
  //   if(db){
  //     // alert('iIm in');
  //     const tranx = db.transaction(['currencies'], 'readwrite');
  //     const currencyStore = tranx.objectStore('currencies');
      
  //     return currencyStore.getAll()
  //     .then(curencies => {
  //       for(const data of curencies){
  //         createSelectOptions(data);
  //       }
  //     });
      
  //   }
    
  // })
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