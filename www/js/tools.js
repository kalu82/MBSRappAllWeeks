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
        return 0;
    }
}

function setLogText() {
    document.getElementById("log_text").value = document.getElementById("m_sent").value + " \t" + document.getElementById("m_id").value + " \t" + document.getElementById("m_username").value + " \t" + document.getElementById("m_action").value + " \t" + document.getElementById("m_week").value + " \t" + document.getElementById("m_day").value + " \t" + document.getElementById("m_device").value + " \t";    
}
