//var page = require('webpage').create();
const fetch = require("node-fetch");
var request = require('sync-request');

function FormInfo() {
  url = null;
  method = null;
  inputs = [];
}

function FormInputInfo() {
  name = null;
  type = null;
}

var mainURL = 'http://maciejadamski.pl';

console.log('Start testing');

//fetchData = fetch('http://slopnice.pl/pl/790/0/wyszukiwarka.html?q="><script>alert("aaa");</script>');

allUrls = [];
toVisit = [];

allUrls.push(mainURL);
toVisit.push(mainURL);

while (toVisit.length > 0) {
  link = toVisit[0];
  toVisit.shift();
  html = request('GET', link)
  if(html.statusCode != 200) continue;
  html = html.getBody('utf8');
  links = getAllLinksFromPage(html);
  links.forEach(function (item) {
    if(!contain(allUrls, item)){
      allUrls.push(item);
      toVisit.push(item);
    }
  });
}

console.log(allUrls);

//#################################################################################################################

function contain(array, item) {
  var exist = false;
  array.forEach(function (element) {
    if (item == element) {
      exist = true;
      return;
    }
  });

  return exist;
}

function getAllLinksFromPage(html) {
  links = [];

  var regex = /<\s*a[^>]*>/g;
  var foundATags = html.match(regex);

  if(foundATags == null) return links;

  foundATags.forEach(function (item) {
    startPosition = item.indexOf('href="', 0);
    if (startPosition < 0) return;
    endPosition = item.indexOf('"', startPosition + 6);
    link = item.substring(startPosition + 5, endPosition);
    
    link = link.replace('\n', '').replace('\t', '').replace('\t', '');
    if (link.indexOf(mainURL) < 0) {
      link = link.replace("./", "");
      if (link[0] != '.') {
        link = link.substring(1, link.length);
      }
      if (link[0] != '/') {
        link = "/" + link;
      }
      link = mainURL + link;
    }
    links.push(link);
  });
  return links;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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