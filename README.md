# glitchbyte

Fast databender for creative effects on images

Usage :
```javascript
var offSet = 62;
var value = 0;
var errorOutput = document.createElement('span');
document.body.appendChild(errorOutput);

$glitch('path/to/img.jpg')
  .then(function(inst) {
    // inst.img -> img element
    // inst.url -> blob url
    // inst.blob -> blob
    // inst.change -> databending function
    return inst.change(offSet, value);
  })
  .then(function(inst) {
    document.body.appendChild(inst.img);
    errorOutput.textContent = '';
  })
  .catch(function(error) {
    // image is broken
    errorOutput.textContent = error.message;
  })
;
```