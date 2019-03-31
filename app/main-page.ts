import {Page} from 'tns-core-modules/ui/page';
import {WebView, LoadEventData} from 'tns-core-modules//ui/web-view';
import {webViewInterfaceDemoVM} from './main-view-model';
import {TextField} from 'tns-core-modules/ui/text-field';
import {alert} from 'tns-core-modules/ui/dialogs';
import {topmost} from 'tns-core-modules/ui/frame';
import { WebViewInterface } from 'nativescript-webview-interface';
var page: Page;
var oLangWebViewInterface: WebViewInterface;

export function pageLoaded(args){
    page = <Page>args.object;
    page.bindingContext = webViewInterfaceDemoVM;
}

/**
 * Initializing webview only ater page navigation.
 */
export function navigatedTo(args){
    setupWebViewInterface(page); 
}

/**
 * Clearing resource attached with webviewInterface on navigated from 
 * this page to avoid memory leak.
 */
export function navigatedFrom(){
     oLangWebViewInterface.destroy(); 
}

/**
 * Initializes webViewInterface for communication between webview and android/ios
 */
function setupWebViewInterface(page: Page){
    var webView = <WebView>page.getViewById('webView');
    oLangWebViewInterface = new WebViewInterface(webView, '~/www/index.html');
    listenLangWebViewEvents();
}

/**
 * Sends intial list of languages to webView, once it is loaded 
 */
function loadLanguagesInWebView(){
    oLangWebViewInterface.emit('loadLanguages', webViewInterfaceDemoVM.lstLanguages);
}

/**
 * Handles any event/command emitted by language webview.
 */
function listenLangWebViewEvents(){  
    // handles language selectionChange event.
    oLangWebViewInterface.on('languageSelection', (selectedLanguage) => {
        webViewInterfaceDemoVM.selectedLanguage = selectedLanguage;
    });

    // loading languages in dropdown, on load of webView content.
    oLangWebViewInterface.on('onload', () => {
        loadLanguagesInWebView();
    });
}

/**
 * Adds language to webView dropdown
 */
export function addLanguage(){
    var txtField = <TextField>page.getViewById('txtLanguage');
    oLangWebViewInterface.callJSFunction('addNewLanguage', [txtField.text]);
}

/**
 * Fetches currently selected language of dropdown in webView.
 */
export function getSelectedLanguage(){
   oLangWebViewInterface.callJSFunction('getSelectedLanguage', null, (oSelectedLang) => {
        alert(`Selected Language is ${oSelectedLang.text}`);
    });
}

/**
 * Fetches currently selected language of dropdown in webview.
 * The result will come after 2s. This function is written to show the support of deferred result.
 */
export function getSelectedLanguageDeferred(){
   oLangWebViewInterface.callJSFunction('getSelectedLanguageDeferred', null, (oSelectedLang) => {
        alert(`Deferred Selected Language is ${oSelectedLang.text}`);
    });     
}

/**
 * Navigates to second page.
 */
export function goToPage2(){
    topmost().navigate('page2');
}