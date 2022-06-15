 window.addEventListener('load', function() {
  let math = document.getElementsByClassName('math');
  for (let i = 0; i < math.length; i++) {
   katex.render(math[i].textContent, math[i]);
  }
 });