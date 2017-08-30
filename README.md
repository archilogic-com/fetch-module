# fetchModule(url)

Load JS modules in browser on demand transparently (basic AMD and CommonJS support)

* modules will be loaded only once when your actual function needs them
* later calls to your function will reuse loaded modules automatically
* keeps your codebase small by loading rarely used libraries only when needed
* simplyfies on demand loading using a decentralized approach

## Basic Usage:
```html
<head>
  <script src="https://rawgit.com/archilogic-com/fetch-module/master/fetch-module.js"></script>
</head>
<body>
  <script>
    var moduleUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.5/pako_deflate.min.js'

    function compressBuffer (buffer) {
      return fetchModule(moduleUrl).then(function(compress){
        return compress.gzip(buffer)
      })
    }
    
  </script>
</body>
```
[Run Example](https://jsfiddle.net/3dio/o1xz594y/)

## Example: Gzip a text file using deflate module loaded on demand

Using `gzipFile` function will load the `deflate` module from [pako library](https://www.npmjs.com/package/pako) loaded from [cloudflare CDN](https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.5/pako_deflate.min.js) once. Calling `gzipFile` again will reuse the previously loaded module by reference from a promise based caching mechanism.

```html
<head>
  <script src="https://rawgit.com/archilogic-com/fetch-module/master/fetch-module.js"></script>
</head>
<body>
  <p>
    Loads a <a target="_blank" href="https://storage.3d.io/archilogic/test.txt">text file</a> and creates a gzipped version for download.
  </p>

  <p>
    <span id="loading">Loading ...</span>
    <a id="download-link" download="compressed-text-file.gz" style="display:none;">Download compressed file</a>
  </p>

  <script>

    // demo

    fetch('https://storage.3d.io/archilogic/test.txt')
      .then(function(response){
        return response.blob()
      })
      .then(gzipFile)
      .then(function(compressedBlob){
        var objectUrl = window.URL.createObjectURL(compressedBlob)
        var loading = document.querySelector('#loading')
        loading.style.display = 'none'
        var downloadLink = document.querySelector('#download-link')
        downloadLink.setAttribute('href', objectUrl)
        downloadLink.style.display = 'inline'
      })

    // methods

    var pakoDeflateUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.5/pako_deflate.min.js'

    function gzipFile (blob) {
      return fetchModule(pakoDeflateUrl).then(function(pakoDeflate){
        return readFileAsBuffer(blob).then(pakoDeflate.gzip).then(createFileFromBuffer)   
      })
    }

    function readFileAsBuffer(blob) {
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
    }

    function createFileFromBuffer(arrayBuffer) {
      return new Blob([ arrayBuffer ], { type: 'application/x-gzip' })
    }

  </script>
</body>
```
[Run Example](https://jsfiddle.net/3dio/39sq5vvy/)
