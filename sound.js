window.onload = function () {
  const file = document.getElementById('file-input');
  const canvas = document.getElementById('canvas');
  const h3 = document.getElementById('name');
  const audio = document.getElementById('audio');
  /* Get the documentElement (<html>) to display the page in fullscreen */
  var elem = document.documentElement;

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
  document
    .getElementById('fullScreen')
    .addEventListener('click', openFullscreen);
  document
    .getElementById('exitFullScreen')
    .addEventListener('click', closeFullscreen);

  file.onchange = function () {
    const files = this.files;
    audio.src = URL.createObjectURL(files[0]);

    const name = files[0].name;
    h3.innerText = `${name}`;

    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    const context = new AudioContext();
    let src = context.createMediaElementSource(audio);
    const analyser = context.createAnalyser();

    //possibly for bass
    const bassFilter = context.createBiquadFilter();
    bassFilter.type = 'lowshelf';

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 4096;

    const bufferLength = analyser.frequencyBinCount;

    const dataArray = new Uint8Array(bufferLength);

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const barWidth = (WIDTH / bufferLength) * 13;

    let barHeight;
    let x = 0;
    let angle = 2;
    let y;
    let test;

    function renderFrame() {
      requestAnimationFrame(renderFrame);

      analyser.getByteFrequencyData(dataArray);

      //   ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      //   ctx.fillRect(0, 0, WIDTH, HEIGHT);

      let r, g, b;
      let bars = 360;
      let barWidth = 2;

      // if
      //angle -= 0.01;
      // ctx.rotate(45 * Math.PI) / 180;
      // console.log(angle);
      // let rads = (angle * Math.PI) / bars;

      let center_x = canvas.width / 2;
      let center_y = canvas.height / 2;
      let radius;
      if (canvas.width < 700 || canvas.height < 500) {
        radius = 40;
      } else {
        radius = 150;
      }

      var gradient = ctx.createLinearGradient(0, 50, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(0, 0, 1, 1)');
      gradient.addColorStop(1, 'rgba(0, 0, 51, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      //   const ctx = canvas.getContext('2d');

      // ctx.beginPath();
      // ctx.arc(center_x, center_y, radius, 0, 2 * Math.PI);
      // ctx.rotate(45 * Math.PI) / 180;
      // ctx.stroke();

      let test2 = 0;
      for (let i = 0; i < bars; i++) {
        //barHeight = dataArray[i] * 2.5;

        // let rads = (Math.PI * 2) / bars;
        if (canvas.width < 700 || canvas.height < 400) {
          barHeight = dataArray[i] * 0.5;
        } else {
          barHeight = dataArray[i] * 0.9;
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
        //ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        //ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        let rads = (angle * Math.PI) / bars;
        x = center_x + Math.cos(rads * i) * radius;
        y = center_y + Math.sin(rads * i) * radius;
        let x_end = center_x + Math.cos(rads * i) * (radius + barHeight);
        let y_end = center_y + Math.sin(rads * i) * (radius + barHeight);
        //draw a bar
        //let center_x = canvas.width / 2;
        //let center_y = canvas.height / 2;
        // rads = (angle or 2 * Math.PI) / bars or 360
        // let angle2 = 0;
        // angle2 += 0.001;

        drawBar(x, y, x_end, y_end, barWidth, dataArray[i]);

        function drawBar(x1, y1, x2, y2, width, frequency) {
          var lineColor = `rgb(${r}, ${g}, ${b})`;
          //'rgb(' + frequency + ', ' + frequency + ', ' + 205 + ')';
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = width;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.fill();
        }

        //x += barWidth + 10;
      }
    }

    audio.play();

    renderFrame();
  };
};
