var os = 0;
chrome.browserAction.onClicked.addListener(function(activeTab)
{
  if (navigator.userAgent.indexOf ('Windows') != -1) os = 1;
  if (navigator.userAgent.indexOf ('Linux')!= -1) os = 2;
  if (navigator.userAgent.indexOf ('Mac')!= -1) os = 3;
  if (navigator.userAgent.indexOf ('FreeBSD')!= -1) os = 4;
// alert(navigator.userAgent);
  switch (os) {
    case 1:
      var newURL = "index.html";
      chrome.tabs.create({ url: newURL });
      if (window.location.hash == '#window') {
        this.displayAsTab = true;
      }
      break;
    case 2:
      alert(navigator.platform, 'К сожалению, Ваша ОС не поддерживается. Приложение находится на этапе разработки');
      break;
    case 3:
      var newURL = "index.html";
      chrome.tabs.create({ url: newURL });
      if (window.location.hash == '#window') {
        this.displayAsTab = true;
      }
      //alert(navigator.platform, 'К сожалению, Ваша ОС не поддерживается. Приложение находится на этапе разработки');
      break;
    case 4:
      alert('К сожалению, Ваша ОС не поддерживается. Приложение находится на этапе разработки');
      break;
    default:
      alert('К сожалению, Ваша ОС не поддерживается. ');
      break;
  }

});