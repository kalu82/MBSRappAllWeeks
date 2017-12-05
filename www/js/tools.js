// Wait for Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready
function onDeviceReady() {
    var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(populateDB, errorCB);
}

function populateDB(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS tbl_actions (rownum INTEGER PRIMARY KEY AUTOINCREMENT, id, username, action, week, day, device, date)');
}

function errorCB(err) {
    alert("Error processing SQL: " + err.code);
}

function insertDB(tx) {
    tx.executeSql('INSERT INTO tbl_actions (id, username, action, week, day, device, date) VALUES ("' + document.getElementById("m_id").value + '","' + document.getElementById("m_username").value + '","' + document.getElementById("m_action").value + '","' + document.getElementById("m_week").value + '","' + document.getElementById("m_day").value + '","' + document.getElementById("m_device").value + '","' + new Date().toString + '")');
}

function goInsert() {
    var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(insertDB, errorCB);
}

function sendDB() {
    var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(queryDB, errorCB);
}

function queryDB(tx) {
    tx.executeSql('SELECT * FROM tbl_actions', [], querySuccess, errorCB);
}

function querySuccess(tx, results) {
    var len = results.rows.length;
    for (var i = 0; i < len; i++) {
        document.getElementById("m_sent").value = "1"
        document.getElementById("m_id").value = results.rows.item(i).id
        document.getElementById("m_username").value = results.rows.item(i).username
        document.getElementById("m_action").value = results.rows.item(i).action
        document.getElementById("m_week").value = results.rows.item(i).week
        document.getElementById("m_day").value = results.rows.item(i).day
        document.getElementById("m_device").value = results.rows.item(i).device
        document.getElementById("m_date").value = results.rows.item(i).device
        
        var form_data = new FormData(document.getElementById("action_form"));
        $.ajax({
            url: "http://mbsr.x10host.com/php_scripts/setActionDB.php",
            type: "POST",
            data: form_data,
            processData: false,  // tell jQuery not to process the data
            contentType: false   // tell jQuery not to set contentType
        });

        // Send also on a secondary db
        $.ajax({
            url: "http://mbsr-server.000webhostapp.com/php_scripts/sendActionDB.php",
            type: "POST",
            data: form_data,
            processData: false,  // tell jQuery not to process the data
            contentType: false   // tell jQuery not to set contentType
        });

        document.getElementById("m_sent").value = "1";

        // Remove the line after upload
        tx.executeSql('DELETE FROM tbl_actions WHERE rownum = ' + results.rows.item(i).rownum, [], , errorCB);
    }
}


// Function for logging information
var storage = window.localStorage;

function checkLogin() {
    if (storage.getItem("username") != null) {
        document.getElementById("i_username").value = storage.getItem("username");
        document.getElementById("i_id").value = storage.getItem("id");
    }
}

// function to logout
function functionLogout() {
    // Log the logout action
    document.getElementById("m_action").value = "logout";

    // Log on text file
    this.setLogText();
    document.getElementById("log_btn").click();

    // Try to send info to the server
    sendAction();

    // Empty local ans session storage
    window.localStorage.clear();
    window.sessionStorage.clear();

    location.reload();
}

function sendAction() {
    // Check if browser is connected, otherwise don't send the data
    if (navigator.onLine) {
        var form_data = new FormData(document.getElementById("action_form"));
        $.ajax({
            url: "http://mbsr.x10host.com/php_scripts/setAction.php",
            type: "POST",
            data: form_data,
            processData: false,  // tell jQuery not to process the data
            contentType: false   // tell jQuery not to set contentType
        });
        document.getElementById("m_sent").value = "1";

        // Send also on a secondary db
        $.ajax({
            url: "http://mbsr-server.000webhostapp.com/php_scripts/sendAction.php",
            type: "POST",
            data: form_data,
            processData: false,  // tell jQuery not to process the data
            contentType: false   // tell jQuery not to set contentType
        });

        return 1;
    } else {
        // write data on the internal DB
        this.insertDB();

        document.getElementById("m_sent").value = "0";
        return 0;
    }
}

function setLogText() {
    document.getElementById("log_text").value = document.getElementById("m_sent").value + " \t" + document.getElementById("m_id").value + " \t" + document.getElementById("m_username").value + " \t" + document.getElementById("m_action").value + " \t" + document.getElementById("m_week").value + " \t" + document.getElementById("m_day").value + " \t" + document.getElementById("m_device").value + " \t";    
}
