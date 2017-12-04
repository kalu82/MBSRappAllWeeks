// Function for database
// Wait for Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

var currentRow;
// Populate the database
function populateDB(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS tbl_actions (rownum int(100) PRIMARY KEY AUTOINCREMENT, id varchar(11) COLLATE utf8_unicode_ci NOT NULL, username varchar(60) COLLATE utf8_unicode_ci DEFAULT NULL, action varchar(60) COLLATE utf8_unicode_ci DEFAULT NULL, week int(11) DEFAULT NULL, day int(11) DEFAULT NULL, device varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL, date datetime DEFAULT NULL)');
}

// Query the database
function queryDB(tx) {
    tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
}

function searchQueryDB(tx) {
    tx.executeSql("SELECT * FROM DEMO where name like ('%" + document.getElementById("txtName").value + "%')", [], querySuccess, errorCB);
}

// Query the success callback
function querySuccess(tx, results) {
    var tblText = '<table id="t01"><tr><th>ID</th> <th>Name</th> <th>Number</th></tr>';
    var len = results.rows.length;
    for (var i = 0; i < len; i++) {
        var tmpArgs = results.rows.item(i).id + ",'" + results.rows.item(i).name + "','" + results.rows.item(i).number + "'";
        tblText += '<tr onclick="goPopup(' + tmpArgs + ');"><td>' + results.rows.item(i).id + '</td><td>' + results.rows.item(i).name + '</td><td>' + results.rows.item(i).number + '</td></tr>';
    }
    tblText += "</table>";
    document.getElementById("tblDiv").innerHTML = tblText;
}

//Delete query
function deleteRow(tx) {
    tx.executeSql('DELETE FROM DEMO WHERE id = ' + currentRow, [], queryDB, errorCB);
}

// Transaction error callback
function errorCB(err) {
    alert("Error processing SQL: " + err.code);
}

// Transaction success callback
function successCB() {
    var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(queryDB, errorCB);
}

// Cordova is ready
function onDeviceReady() {
    var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(populateDB, errorCB, successCB);
}

//Insert query
function insertDB(tx) {
    tx.executeSql('INSERT INTO DEMO (name,number) VALUES ("' + document.getElementById("txtName").value + '","' + document.getElementById("txtNumber").value + '")');
}

function goInsert() {
    var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(insertDB, errorCB, successCB);
}

function goSearch() {
    var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(searchQueryDB, errorCB);
}

function goDelete() {
    var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(deleteRow, errorCB);
}

//Show the popup after tapping a row in table
function goPopup(row, rowname, rownum) {
    currentRow = row;
    document.getElementById("qrpopup").style.display = "block";
    document.getElementById("editNameBox").value = rowname;
    document.getElementById("editNumberBox").value = rownum;
}

function editRow(tx) {
    tx.executeSql('UPDATE DEMO SET name ="' + document.getElementById("editNameBox").value + '", number= "' + document.getElementById("editNumberBox").value + '" WHERE id = ' + currentRow, [], queryDB, errorCB);
}

function goEdit() {
    var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(editRow, errorCB);
}





function queryDB2(tx) {
    tx.executeSql('SELECT * FROM tbl_actions', [], querySuccess, errorCB);
}

// Query the success callback
function querySuccess2(tx, results) {
    var tblText = '<table id="t01"><tr><th>Row</th> <th>ID</th> <th>Name</th></tr>';
    var len = results.rows.length;
    for (var i = 0; i < len; i++) {
        var tmpArgs = results.rows.item(i).id + ",'" + results.rows.item(i).name + "','" + results.rows.item(i).number + "'";
        tblText += '<tr><td>' + results.rows.item(i).rownum + '</td><td>' + results.rows.item(i).id + '</td><td>' + results.rows.item(i).username + '</td></tr>';
    }
    tblText += "</table>";
    document.getElementById("tblDiv").innerHTML = tblText;
}


function insertDB2(tx) {
    var now = new Date().toString;
    tx.executeSql('INSERT INTO tbl_actions (id,username,action,week,day,device,date) VALUES ("' + document.getElementById("m_id").value + '","' + document.getElementById("m_username").value + '","' + document.getElementById("m_action").value + '","' + document.getElementById("m_week").value + '","' + document.getElementById("m_day").value + '","' + document.getElementById("m_device").value + '","' + now + '")');
}

function deleteRow2(tx) {
    tx.executeSql('DELETE FROM tbl_actions rownum = "' + currentRow);
}

function insertVal() {
    var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(insertDB2, errorCB, successCB);
}

function deleteVal() {
    var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(deleteRow2, errorCB);
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
        document.getElementById("m_sent").value = "0";

        this.insertVal();
        this.queryDB2();
        
        return 0;
    }
}

function setLogText() {
    document.getElementById("log_text").value = document.getElementById("m_sent").value + " \t" + document.getElementById("m_id").value + " \t" + document.getElementById("m_username").value + " \t" + document.getElementById("m_action").value + " \t" + document.getElementById("m_week").value + " \t" + document.getElementById("m_day").value + " \t" + document.getElementById("m_device").value + " \t";    
}
