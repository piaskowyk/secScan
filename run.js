var page = require('webpage').create();

function FormInfo() {
  url = null;
  method = null;
  input = [];
}

function FormInputInfo(){
  name = null;
  type = null;
}

var testingUrl = 'http://slopnice.pl';

console.log('Start testing');

page.open('http://slopnice.pl/pl/790/0/wyszukiwarka.html?q="><script>alert("aaa");</script>', 
function(status) {
  console.log("Status: " + status);
  if(status === "success") {
    page.render('example.png');
    var html = page.content;
    var htmlForms = getAllFormsHtml(html); 
    console.log(getInfoAboutForms(htmlForms));
    
  }
  phantom.exit();
});

page.onAlert = function(msg) {
  console.log('DETECT ALERT: ' + msg);
};

function getAllFormsHtml(html) {
  var formsHtml = [];
  var indexStart = 0;
  while (true) {
    var formStartPosition = html.indexOf("<form", indexStart);
    if (formStartPosition < 0) break;
    var formEndPosition = html.indexOf('</form>', formStartPosition);
    var formHtml = html.substring(formStartPosition, formEndPosition);
    indexStart = formEndPosition + 6;
    formsHtml.push(formHtml);
  }

  return formsHtml;
} FormInputInfo

function getInfoAboutForms(formsHtml) {
  var infoTab = [];
  formsHtml.forEach(function (item) {
    var info = getInfoAboutForm(item);
    if (info != null) infoTab.push(info);
  });

  return infoTab;
}

function getInfoAboutForm(item) {

  formInfo = new FormInfo();
  indexStart = item.indexOf("action=\"", 0);
  if (indexStart < 0) return null; // co zrobić jeśli formulaż nie ma określonego action w htamlu? sorawdzić w jsku xd
  indexEnd = item.indexOf("\"", indexStart + 8);
  info = item.substring(indexStart + 8, indexEnd);
  formInfo.url = info;

  indexStart = item.indexOf("method=\"", 0);
  if (indexStart < 0) {
    formInfo.method = 'get';
  }
  else {
    indexEnd = item.indexOf("\"", indexStart + 8);
    info = item.substring(indexStart + 8, indexEnd);
    formInfo.method = info;
  }

  //get name
  inputs = [];
  indexStart = 0;
  while (true) {
    inputInfo = new FormInputInfo();

    inputStartPosition = item.indexOf("<input", indexStart);
    if (inputStartPosition < 0) break;
    inputEndPosition = item.indexOf('>', inputStartPosition);
    inputHtml = item.substring(inputStartPosition, inputEndPosition);

    startPosition = inputHtml.indexOf("name=\"", indexStart);
    if (startPosition < 0) continue;
    else {
      endPosition = item.indexOf('"', startPosition);
      inputInfo.name = item.substring(startPosition, endPosition);
    }

    startPosition = inputHtml.indexOf("type=\"", indexStart);
    if (startPosition >= 0) {
      endPosition = item.indexOf('"', startPosition);
      inputInfo.type = item.substring(startPosition, endPosition);
    }

    indexStart = inputEndPosition;
    inputs.push(inputInfo);
  }
  formInfo.inputs = inputs;

  return formInfo;
}