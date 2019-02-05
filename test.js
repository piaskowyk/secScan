var webPage = require('webpage');
const fs = require('fs');

var config = {
    baseUrl: "http://slopnice.pl/pl/790/0/wyszukiwarka.html?q=",
    findOnlyOne: false
}

//-------------------------------------------------------------------------------

var payloads = [
    '"><script>alert("aaa");</script>',
    '"><script>alert("aaa123");</script>',
];

var messegeQueue = [];
var start = 0;
var end = 0;

console.log("Testing in porgress...");

payloads.forEach(function (payloadItem, index) {
    var page = webPage.create();
    var detectXss = false;
    start++;

    page.open(config.baseUrl + payloadItem, function (status) {
        if (status == "success") {
            console.log("Test payload no: " + index + " is end");
        }
        else {
            messegeQueue.push("Unrecognise bahavior. Payload index = " + index + "\n" + config.baseUrl + payloadItem + "\nMore info:\n" + status);
            console.log("Unrecognise bahavior. Payload index = " + index + "\n" + config.baseUrl + payloadItem);
        }
        end++;

        joinTheard();
    });

    page.onAlert = function (msg) {
        if (!detectXss) {
            detectXss = true;
            messegeQueue.push("Detect XSS on test payload index: " + index + "\n" + config.baseUrl + payloadItem);
            console.log("Detect XSS on test payload index: " + index + "\n" + config.baseUrl + payloadItem);
            if(config.findOnlyOne){
                endProgram();
            }
        }
    };
});

function joinTheard() {
    if (start == end) {
        endProgram();
    }
}

function endProgram(){
    var raport = "";
    console.log("\nResults:\n-------------------------------------------------------\n");
    messegeQueue.reverse().forEach(function (message) {
        console.log(message + "\n");
        raport = raport + message + "\n\n";
    });
    console.log("-------------------------------------------------------");
    console.log("Test is end.");

    fs.write("raport.txt", raport, 'w');

    phantom.exit();
}

//----------------------------------------
// var webPage = require('webpage');
// var page = webPage.create();
// var postBody = 'user=username&password=password';

// page.open('http://www.google.com/', 'POST', postBody, function(status) {
//   console.log('Status: ' + status);
//   // Do other things here...
// });

//----------------------------------------
// var webPage = require('webpage');
// var page = webPage.create();
// var settings = {
//   operation: "POST",
//   encoding: "utf8",
//   headers: {
//     "Content-Type": "application/json"
//   },
//   data: JSON.stringify({
//     some: "data",
//     another: ["custom", "data"]
//   })
// };

// page.open('http://your.custom.api', settings, function(status) {
//   console.log('Status: ' + status);
//   // Do other things here...
// });