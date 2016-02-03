(function () {
    var oWebViewInterface = window.nsWebViewInterface;
    var languageDD = document.getElementById('knownLanguage');

    /**
     * Registers handlers for native events.
     */
    function addNativeMsgListener() {
        oWebViewInterface.on('loadLanguages', function (arrLanguages) {
            for (var i = 0; i < arrLanguages.length; i++) {
                addLanguageOption(arrLanguages[i]);
            }
        });
    }
    
    /**
     * Defines global functions which will be called from andorid/ios
     */
    function defineNativeInterfaceFunctions(){
        window.addNewLanguage = function(language){
            addLanguageOption(language);
            languageDD.value = language;
            languageDD.onchange();
        };
           
        window.getSelectedLanguage = function(){
            var selectedLangOpt = languageDD.options[languageDD.selectedIndex];
            return {id: selectedLangOpt.value, text: selectedLangOpt.text};
        };
        
        window.getSelectedLanguageDeferred = function(){
            var selectedLangOpt = languageDD.options[languageDD.selectedIndex];
            return new Promise(function(resolve) {
                setTimeout(function(){
                    resolve({id: selectedLangOpt.value, text: selectedLangOpt.text});        
                }, 2000);
            });
        };
    }
    
    function addLanguageOption(language){
        var option = document.createElement('Option');
        option.text = language;
        option.value = language;
        languageDD.appendChild(option);
    }
    
    function sendSelectedValue(selectedLanguage){
        oWebViewInterface.emit('languageSelection', selectedLanguage);
    }
    
    function init() {
        addNativeMsgListener();
        defineNativeInterfaceFunctions();
        
        languageDD.onchange = function(){
            sendSelectedValue(languageDD.value);
        }
    }

    init();
})();