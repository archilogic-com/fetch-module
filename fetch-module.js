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

  // return module if it has been loaded already
  if (window.___modules[url]) {
    return Promise.resolve(window.___modules[url])

  } else {
  // load code and use module wrapper
    return fetch(url).then(function(response){
      return response.text()
    }).then(function(code){

      var moduleWrapper
      // check module type (i know this can be improved. help is welcome)
      if (code.indexOf('define(function()') > -1) {
        // AMD
        moduleWrapper = code+'\nfunction define(cb){ window.___modules["'+url+'"] = cb(); };'
      } else {
        // CommonJS
        moduleWrapper = 'window.___modules["'+url+'"] = (function(){ var exports = {}, module = {exports:exports};'+code+'\nreturn module.exports\n})()'
      }

      var script = document.createElement('script')
      try {
        script.appendChild(document.createTextNode(moduleWrapper))
        document.body.appendChild(script)
      } catch (e) {
        script.text = moduleWrapper
        document.body.appendChild(script)
      }
      
      return window.___modules[url]
    })
  }
  
  if (module) module.exports = fetchModule
  window.fetchModule = fetchModule
  
})( window, typeof module !== 'undefined' && module.exports ? module : null );
