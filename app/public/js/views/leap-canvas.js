
var canvas = document.getElementById('leapCanvas');
var ctx = canvas.getContext('2d');  
var ws, record = function() {};
var lastX, lastY, oldX, oldY;
var recording = false;
var recorded = [];

var recordButton = document.getElementById("recordBtn");
var output = document.getElementById("output");

var record = function() {
  recording = !recording;

  if (recording) {
    recordButton.innerHTML = "Stop";
  }
  else {
    recordButton.innerHTML = "Record";
  }  
}

function init() {
  ws = new WebSocket("ws://localhost:6437/");

  ws.onopen = function(event) {
    console.log("Websocket open");
  };

  ws.onmessage = function(event) {
    console.log("Receiving data");
    var obj = JSON.parse(event.data);
    var start = 50;
    var stopX = 250;
    var stopY = 100;

    // Clear canvas  
    canvas.width = canvas.width;

    if (!recording) {
      drawX(start, start);
    }
    else {
      drawX(stopX, stopY);
    }

    if (obj.pointables[0]) {
      var x = 200 + obj.pointables[0].tipPosition[0];
      var y = 250 - obj.pointables[0].tipPosition[1];




      if (!recording && within(x, start, 5) && within(y, start, 5)) {
        recording = true;
      }

      else if (recording && within(x, stopX, 5) && within(y, stopY, 5)) {
        recording = false;
      }

      output.innerHTML = "<br />X : " + x + " Y : " + y;
      drawPoint(x, y);
      drawPoint(lastX, lastY);
      drawPoint(oldX, oldY);

      lastX = oldX;
      lastY = oldY;

      oldX = x;
      oldY = y;

    }

    if (recording) {
      recorded.push(obj);
    }
  };

  ws.onclose = function(event) {
    ws = null;
  };

  ws.onerror = function(event) {
    console.log("leap error");
  };
}

function drawX(x, y) {
    ctx.moveTo(x - 10, y - 10);
    ctx.lineTo(x + 10, y + 10);
    ctx.stroke();

    ctx.moveTo(x + 10, y - 10);
    ctx.lineTo(x - 10, y + 10);
    ctx.stroke();
}

function within(a, b, d) {
  if ((a > b - d) && (a < b + d))
    return true;
  else
    return false;
}

function drawPoint(x, y)
{
  ctx.beginPath();
  ctx.arc(x, y, 1, 0, 2 * Math.PI, true);
  ctx.fill();
}



$(document).ready(function() {
  if ((typeof(WebSocket) == 'undefined') && (typeof(MozWebSocket) != 'undefined')) {
    WebSocket = MozWebSocket;
  }

  init();
})