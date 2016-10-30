(function(global){
  var star = document.getElementsByClassName("stars")[0];
  var n = 50;
  function randomNum(m, n) {
		  return Math.floor(Math.random() * (n - m + 1) + m);
  }
  var str = '';
  for (var i = 0; i < n; i++) {
  	var numX = randomNum(-200, 200);
  	var numY = randomNum(-300, 300);
  	var color = "rgb(255,255,255)";
  		str += numX +'px'+' ' + numY+'px'+' '+ color+',';
  }
  	str = str.slice(0,-1);
  	star.style.boxShadow =  str;
})(window);
