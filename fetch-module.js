/**
 *
 * Loads a JS Module in browser on demand
 * 
 * Dependencies: Promises, fetch
 * Supports: AMD and CommonJS modules without nested dependencies
 *
*/

(function(window, module){
  "use strict";
  
  // global module container
  window.___modules = window.___modules || {}

  function fetchModule (url) {
    
    if (!window.___modules[url]) {
    
      // create module container
      window.___modules[url] = { module: { exports: {} } }
      // load code
      window.___modules[url].promise = fetch(url).then(function(response){
        return response.text()
      }).then(function(code){
				var moduleWrapper
        // check module type (i know this can be improved. help is welcome)
        if (code.indexOf('define(function()') > -1) {
          // AMD
          moduleWrapper = code+'\nfunction define(cb){ window.___modules["'+url+'"].module.exports = cb(); };'
        } else {
          // CommonJS
          moduleWrapper = '(function(){ var module = window.___modules["'+url+'"].module, exports = module.exports; '+code+'\n})()'
        }
				// create script element inside head tag
        var script = document.createElement('script')
        try {
          script.appendChild(document.createTextNode(moduleWrapper))
          document.body.appendChild(script)
        } catch (e) {
          script.text = moduleWrapper
          document.body.appendChild(script)
        }
				// return reference to module
        return window.___modules[url].module.exports
      })
    }
    
    return window.___modules[url].promise
  }
  
  if (module) module.exports = fetchModule
  window.fetchModule = fetchModule
  
})(window, typeof module !== 'undefined' && module.exports ? module : null );
