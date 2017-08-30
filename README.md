# fetchModule(url)

Load JS Modules in browser on demand (basic AMD and CommonJS support)

* keeps your codebase small by loading rarely used libraries only when needed
* simplyfies on demand loading using a decentralized approach
* modules will be loaded only once

## Basic Usage:
```html
<head>
  <script src="https://rawgit.com/archilogic-com/fetch-module/master/fetch-module.js"></script>
</head>
<script>
  var pakoDeflateUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.5/pako_deflate.min.js'
  
  fetchModule(pakoDeflateUrl).then(function(pakoDeflate){
    console.log(pakoDeflate)
  })
</script>
```
[Run Example](https://jsfiddle.net/3dio/o1xz594y/)

## Example: Gzip a file using PAKO deflate library (loaded on demand)
```html
<head>
  <script src="https://rawgit.com/archilogic-com/fetch-module/master/fetch-module.js"></script>
</head>
<script>
  var pakoDeflateUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.5/pako_deflate.min.js'

  function gzipFile (blob) {
    return fetchModule(pakoDeflateUrl).then(function(pakoDeflate){
      return readFileAsBuffer(blob).then(pakoDeflate.gzip).then(createFileFromBuffer)   
    }
  }

  function readFileAsBuffer(file) {
    return new Promise(function(resolve, reject){
      var fileReader = new window.FileReader()
      fileReader.onload = function (e) {
        // IE 11 requires this
        // http://stackoverflow.com/a/32665193/2835973
        resolve(fileReader.content || fileReader.result)
      }
      fileReader.onerror = function (error){
        reject(error)
      }
      // start reading file
      fileReader.readAsArrayBuffer(blob)
      })
    })
  }

  function createFileFromBuffer(arrayBuffer) {
    return new Blob([ arrayBuffer ], { type: 'application/x-gzip' })
  })
  
</script>
```
[Run Example](https://jsfiddle.net/3dio/39sq5vvy/)
