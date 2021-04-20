
window.onload = function() {
 let myThumbnailImageEl = document.getElementById('myThumbnailImageEl');
 myThumbnailImageEl.addEventListener('click', function() {
  console.log(getImageDataFromImageElement(this));
 });
};

function getImageDataFromImageElement(myThumbnailImage) {

  let src = myThumbnailImage.src;
  let img = document.createElement('img');
  img.src = src;

  return (img.onload = function() {
  
   let c = document.createElement('canvas');
   let ctx = c.getContext('2d');
   ctx.drawImage(img, 0, 0);
   let imgData = ctx.getImageData(0, 0, img.width, img.height);
   return imgData;
  })();
}
