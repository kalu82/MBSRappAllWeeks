document.addEventListener('deviceready', onDeviceReady, false);

var logOb;

function fail(e) {
    console.log("FileSystem Error");
    console.dir(e);
}

function onDeviceReady() {

    window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, function (dir) {
        console.log("got main dir", dir);
        dir.getFile("log.txt", { create: true }, function (file) {
            console.log("got the file", file);
            logOb = file;
            //writeLog("App started");
        });
    });

    document.querySelector("#log_btn").addEventListener("click", function (e) {
        writeLog(document.querySelector("#log_text").value);
    }, false);

}

function writeLog(str) {
    if (!logOb) return;
    var log = str + " [" + (new Date()) + "]\n";
    console.log("going to log " + log);
    logOb.createWriter(function (fileWriter) {

        fileWriter.seek(fileWriter.length);

        var blob = new Blob([log], { type: 'text/plain' });
        fileWriter.write(blob);
        console.log("ok, in theory i worked");
    }, fail);
}

function justForTesting() {
    logOb.file(function (file) {
        var reader = new FileReader();

        reader.onloadend = function (e) {
            console.log(this.result);
        };

        reader.readAsText(file);
    }, fail);

}

