const file = document.getElementById("file-input");
const canvas = document.getElementById("canvas");
const h3 = document.getElementById("name");
const audio = document.getElementById("audio");
const demo = document.querySelector(".demo");
/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;

// Create context
const ctx = canvas.getContext("2d");

const context = new AudioContext() || context.AudioContext;
let src = context.createMediaElementSource(audio);
const analyser = context.createAnalyser();

let musicSource = [
  "./music/blueMonday.mp3",
  "./music/onYourMind.mp3",
  "./music/saveYourTears.mp3",
  "./music/desire.mp3",
];

let index = 1;
let next = document.getElementById("next");
next.addEventListener("click", () => {
  visualize(musicSource, index);
  if (index == 3) {
    index = 0;
  } else {
    index++;
  }
});

function playSongs(file, c) {
  audio.src = file[c];
}

function visualize(file, index) {
  let name;
  let songNames = ["Blue Monday", "On Your Mind", "Save Your Tears", "Desire"];

  playSongs(file, index);
  name = songNames[index];

  h3.innerText = `${name}`;

  //possibly for bass
  const bassFilter = context.createBiquadFilter();
  bassFilter.type = "lowshelf";

  src.connect(analyser);
  analyser.connect(context.destination);

  analyser.fftSize = 4096;

  const bufferLength = analyser.frequencyBinCount;

  const dataArray = new Uint8Array(bufferLength);

  let barHeight;
  let x = 0;
  let angle = 2;
  let y;

  function renderFrame() {
    context.resume();
    audio.play();
    requestAnimationFrame(renderFrame);

    analyser.getByteFrequencyData(dataArray);

    let r, g, b;
    let bars = 360;
    let barWidth = 5;

    let center_x = canvas.width / 2;
    let center_y = canvas.height / 2;
    let radius;
    if (canvas.width < 700 || canvas.height < 500) {
      radius = 40;
    } else {
      radius = 150;
    }

    var gradient = ctx.createLinearGradient(0, 50, 0, canvas.height);
    gradient.addColorStop(0, "rgba(0, 0, 1, 1)");
    gradient.addColorStop(1, "rgba(0, 0, 51, 1)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let test2 = 0;
    for (let i = 0; i < bars; i++) {
      if (canvas.width < 700 || canvas.height < 400) {
        barHeight = dataArray[i] * 0.3;
      } else {
        barHeight = dataArray[i] * 0.8;
      }

      //trying to figure out base
      if (dataArray[i] > 300) {
        r = 255;
        g = 5;
        b = 0;
      } else if (dataArray[i] > 235) {
        r = 250;
        g = 5;
        b = 100;
      } else if (dataArray[i] > 210) {
        r = 250;
        g = 0;
        b = 250;
      } else if (dataArray[i] > 200) {
        r = 250;
        g = 255;
        b = 0;
      } else if (dataArray[i] > 180) {
        r = 204;
        g = 255;
        b = 50;
      } else if (dataArray[i] > 170) {
        r = 0;
        g = 50;
        b = 255;
      } else if (dataArray[i] > 150) {
        r = 0;
        g = 100;
        b = 255;
      } else if (dataArray[i] > 130) {
        r = 0;
        g = 200;
        b = 255;
      } else if (dataArray[i] > 110) {
        r = 0;
        g = 255;
        b = 200;
      } else if (dataArray[i] > 90) {
        r = 0;
        g = 255;
        b = 100;
      } else if (dataArray[i] > 75) {
        r = 0;
        g = 255;
        b = 50;
      } else if (dataArray[i] > 50) {
        r = 0;
        g = 255;
        b = 0;
      } else if (dataArray[i] > 25) {
        r = 0;
        g = 100;
        b = 0;
      } else {
        r = 0;
        g = 50;
        b = 0;
      }

      let rads = (angle * Math.PI) / bars;
      x = center_x + Math.cos(rads * i) * radius;
      y = center_y + Math.sin(rads * i) * radius;
      let x_end = center_x + Math.cos(rads * i) * (radius + barHeight);
      let y_end = center_y + Math.sin(rads * i) * (radius + barHeight);

      drawBar(x, y, x_end, y_end, barWidth, dataArray[i]);

      function drawBar(x1, y1, x2, y2, width, frequency) {
        var lineColor = `rgb(${r}, ${g}, ${b})`;
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.fill();
      }
    }
  }

  // audio.play();

  requestAnimationFrame(renderFrame);
}

demo.onclick = () => {
  visualize(musicSource, 0);
};

/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen();
  }
}
document.getElementById("fullScreen").addEventListener("click", openFullscreen);
document
  .getElementById("exitFullScreen")
  .addEventListener("click", closeFullscreen);
