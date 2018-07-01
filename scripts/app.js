navigator.serviceWorker.register('service-worker.js').then(function() {
  console.log('Service Worker registered!');
}).catch(function(){
  console.log('Registration Failed');
});

function getCurrencies() {  
  const url = `https://free.currencyconverterapi.com/api/v5/currencies`;

  fetch(url).then(function(response) {
    return response.json();
  }).then(function(data) {      
    const values = data.results;    
    let options = `<option value="0">Select Currency</option>`;
 
      for(var key in values){
      const currencyId = key;
      const currencyItem = values[key].currencyName;      
      options += `<option value="${currencyId}">${currencyItem}</option>`;                 
    } 
 
  document.getElementById("fromcur").innerHTML = options;
  document.getElementById("tocur").innerHTML = options;

  }).catch(function() {
    console.log("Couldn't get currencies");
  });
}

getCurrencies();

let query;


function saveToIdb(data){
	  let request = window.indexedDB.open("curcon", 1),
	  db,
	  tx,
	  store,
	  index;
	  request.onupgradeneeded = function(e) {
		let db = request.result,
			store = db.createObjectStore("curconstore", {
			  keyPath: "query"})          
	  };
	  request.onerror = function(e) {
		console.log("Error: " + e.target.errorCode);
	  }
	  request.onsuccess = function(e) {
		db = request.result;
		tx = db.transaction("curconstore", "readwrite");
		store = tx.objectStore("curconstore");

		db.onerror = function(e) {
		  console.log("Error: " + e.target.errorCode);
		}
		let putData = {"query" : query, "ratio":data[query]};
		store.add(putData);
	  }

}



document.getElementById("tocur").addEventListener('change', (e) => {
	
	const fromcur = document.getElementById("fromcur").value;
	const tocur = document.getElementById("tocur").value;
	const amount = document.getElementById("amount").value;
	
	if(amount == "" || amount == 0 || fromcur == 0){
		console.log("Enter a valid Amount and FROM Currency to Convert.")	
	} else{
		query = `${fromcur}_${tocur}`;
		const url = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`;
		
		fetch(url).then(function(response) {
		return response.json();
		}).then(function(data) {
		saveToIdb(data);
		const ratio = data[query];
		document.getElementById("resultamount").setAttribute('value',(amount * ratio).toFixed(2));
		}).catch(function(){
			console.log("Application offline")     
			let req = indexedDB.open("curcon", 1);
			req.onsuccess = function (e) {
			let db = e.target.result;
			let tx = db.transaction("curconstore", "readwrite");
			let store = tx.objectStore("curconstore");
			let dbData = store.get(query);
			dbData.onerror = function () {
			document.getElementById("resultamount").setAttribute('value',"There is no Internet connection");
			}

			dbData.onsuccess = function () {
			let dbRatio = dbData.result.ratio;
			document.getElementById("resultamount").setAttribute('value',(amount * dbRatio).toFixed(2));
			}
		  }    
	  })  
	}	
});
