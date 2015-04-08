
!function(global) { 'use strict';

  window.URL || (window.URL = window.webkitURL);

  function $glitch(buffer, type) {

    var
       img = new Image()
      ,mimetype = type
      ,blob
      ,blobUrl
      ,originalBuffer
      ,modifiedBuffer
    ;

    function change(offset, val) {
      // create a copy of the original ArrayBuffer
      modifiedBuffer = new Uint8Array(originalBuffer.slice(0));
      if (typeof offset === 'number' || typeof offset === 'string') {
        modifiedBuffer[offset] = val;
      } else {
        for (var key in offset) {
          if (offset.hasOwnProperty(key)) {
            modifiedBuffer[key*1] = offset[key]*1;
          }
        }
      }
      return new Promise(function(resolve, reject) {
        process(resolve, reject)
      });
    }

    function process(resolve, reject) {

      // https://developer.mozilla.org/en-US/docs/Web/API/Blob
      blob = new Blob([modifiedBuffer], {type: mimetype});
      // destroy any previously created fake URL
      window.URL.revokeObjectURL(blobUrl);
      // generate a fake URL for the blob
      // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
      blobUrl = window.URL.createObjectURL(blob)

      img.onload = function() {
        if (img.complete && img.width > 0) {
          resolve({
            change: change,
            url: blobUrl,
            blob: blob,
            img: img
          });
        } else {
          reject(new Error('Image is broken'));
        }
      }
      img.onerror = function() {reject(new Error('Image is broken'))}
      img.src = blobUrl;
    }

    // https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Promise
    return new Promise(function(resolve, reject) {
      // if buffer is an URL
      // @todo : cache image to avoid multiple loading
      if (typeof buffer === 'string') {

        // better HTML5 ajax using Promise (will replace XMLHttpRequest)
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
        fetch(buffer)
          .then(function(response) {
            return (response.status >= 200 && response.status < 300)
              ? Promise.resolve(response)
              : Promise.reject(new Error(response.statusText))
          })
          .then(function(response) {
            mimetype = response.headers.map['content-type'][0];
            return response.arrayBuffer();
          })
          .then(function(b) {
            originalBuffer = b;
            modifiedBuffer = new Uint8Array(originalBuffer.slice(0));
            process(resolve, reject);
          })
          .catch(reject)
        ;

      } else {

        originalBuffer = buffer;
        modifiedBuffer = new Uint8Array(originalBuffer.slice(0));
        process(resolve, reject);

      }
    });
  }

  window.$glitch = $glitch;
}(this);