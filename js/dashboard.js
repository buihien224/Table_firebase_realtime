var firebaseConfig = {
    apiKey: "AIzaSyCUiUQb4WWqhiqbe5nqDKs_-oJh09PcgH4",
    authDomain: "final-iot-d3c05.firebaseapp.com",
    projectId: "final-iot-d3c05",
    storageBucket: "final-iot-d3c05.appspot.com",
    messagingSenderId: "322798547495",
    appId: "1:322798547495:web:c36aad546181f0e7865402",
    measurementId: "G-PCBEQPPQT3"
  };

firebase.initializeApp(firebaseConfig) ;
var auth = firebase.auth()
var itemsRef = firebase.database().ref().child("Items");

firebase.database().ref().child("sensor").child("temp").on('value', function(snap) {
document.getElementById("temp").innerHTML = snap.val(); });
firebase.database().ref().child("sensor").child("humi").on('value', function(snap) {
document.getElementById("humi").innerHTML = snap.val(); });



async function readData() {
    const value = await itemsRef.get();
    return value;
}


// sign out button
let signOutButton = document.getElementById("signout")
signOutButton.addEventListener("click", (e) => {
  //Prevent Default Form Submission Behavior
  e.preventDefault()
  console.log("clicked")
  
  auth.signOut()
  alert("Signed Out")
  window.location = "index.html";
})


// clear data button
let clearButton = document.getElementById("clear")
clearButton.addEventListener("click", (e) => {
  //Prevent Default Form Submission Behavior
  e.preventDefault()
  console.log("clear")
  firebase.database().ref("Items").set(null);
  alert("Clear data")
})

// Initializing variables
window.tableData = {};

window.onload = function() {
  syncCron()
};

async function syncCron() {
  const tempData = {};
  const Entries = await readData();

  Entries.forEach(entry => {
    tempData[entry.key] = entry.toJSON();
  });

  if (!deepEqual(tableData, tempData)) {
    // Clones tempData into tableData and render if data has updated
    tableData = JSON.parse(JSON.stringify(tempData));
    render();
  }

  // Re-sync every 5 secs
  setTimeout(syncCron, 1000);
}

function render() {
  var tableBody = document.querySelector('#table tbody');

  // Clears table
  tableBody.innerHTML = '';

  // Adding fields
  for (const key in window.tableData) {
    // Creating elements
    var row = document.createElement("tr");
    var col1 = document.createElement("td");
    var col2 = document.createElement("td");
    var col3 = document.createElement("td");

    // Add data to the new elements.
    col1.innerText = key;
    col2.innerText = window.tableData[key].user;
    col3.innerText = window.tableData[key].card;

    //Append the cells into the row and the row into the table body.
    row.appendChild(col1);
    row.appendChild(col2);
    row.appendChild(col3);
    tableBody.appendChild(row);
  }
}

// stackOverflow
function deepEqual(x, y) {
  if (x === y) {
    return true;
  }
  else if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) {
    if (Object.keys(x).length != Object.keys(y).length)
      return false;

    for (var prop in x) {
      if (y.hasOwnProperty(prop))
      {  
        if (! deepEqual(x[prop], y[prop]))
          return false;
      }
      else
        return false;
    }
    
    return true;
  }
  else 
    return false;
}