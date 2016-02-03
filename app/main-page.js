var web_view_1 = require('ui/web-view');
var main_view_model_1 = require('./main-view-model');
var dialogs_1 = require('ui/dialogs');
var webViewInterfaceModule = require('nativescript-webview-interface');
var page;
var oLangWebViewInterface;
function pageLoaded(args) {
    page = args.object;
    page.bindingContext = main_view_model_1.webViewInterfaceDemoVM;
    setupWebViewInterface(page);
}
exports.pageLoaded = pageLoaded;
/**
 * Initializes webViewInterface for communication between webview and android/ios
 */
function setupWebViewInterface(page) {
    var webView = page.getViewById('webView');
    oLangWebViewInterface = new webViewInterfaceModule.WebViewInterface(webView);
    // loading languages in dropdown, on load of webView.
    webView.on(web_view_1.WebView.loadFinishedEvent, function (args) {
        if (!args.error) {
            loadLanguagesInWebView();
        }
    });
    listenLangWebViewEvents();
}
/**
 * Sends intial list of languages to webView, once it is loaded
 */
function loadLanguagesInWebView() {
    oLangWebViewInterface.emit('loadLanguages', main_view_model_1.webViewInterfaceDemoVM.lstLanguages);
}
/**
 * Handles any event/command emitted by language webview.
 */
function listenLangWebViewEvents() {
    // handles language selectionChange event.
    oLangWebViewInterface.on('languageSelection', function (selectedLanguage) {
        main_view_model_1.webViewInterfaceDemoVM.selectedLanguage = selectedLanguage;
    });
}
/**
 * Adds language to webView dropdown
 */
function addLanguage() {
    var txtField = page.getViewById('txtLanguage');
    oLangWebViewInterface.callJSFunction('addNewLanguage', [txtField.text]);
}
exports.addLanguage = addLanguage;
/**
 * Fetches currently selected language of dropdown in webView.
 */
function getSelectedLanguage() {
    oLangWebViewInterface.callJSFunction('getSelectedLanguage', null, function (oSelectedLang) {
        dialogs_1.alert("Selected Language is " + oSelectedLang.text);
    });
}
exports.getSelectedLanguage = getSelectedLanguage;
/**
 * Fetches currently selected language of dropdown in webview.
 * The result will come after 2s. This function is written to show the support of deferred result.
 */
function getSelectedLanguageDeferred() {
    oLangWebViewInterface.callJSFunction('getSelectedLanguageDeferred', null, function (oSelectedLang) {
        dialogs_1.alert("Deferred Selected Language is " + oSelectedLang.text);
    });
}
exports.getSelectedLanguageDeferred = getSelectedLanguageDeferred;
