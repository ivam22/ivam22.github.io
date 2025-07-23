let flame = document.getElementById('flame');
let song = document.getElementById('song');
const playBtn = document.getElementById('playBtn');
let blown = false;

navigator.mediaDevices.getUserMedia({ audio: true, video: false })
  .then(stream => {
    const audioContext = new AudioContext();
    const mic = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    mic.connect(analyser);
    analyser.fftSize = 256;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function detectBlow() {
      analyser.getByteFrequencyData(dataArray);
      let volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

      if (volume > 50 && !blown) {
        blown = true;
        flame.style.display = 'none';
        launchConfetti();
      }

      requestAnimationFrame(detectBlow);
    }

    detectBlow();
  })
  .catch(err => {
    alert('Mic access denied. This feature needs microphone access.');
  });

function launchConfetti() {
  const duration = 3 * 1000;
  const end = Date.now() + duration;

  const colors = ['#ff4081', '#ffeb3b', '#8bc34a', '#00bcd4'];

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}



playBtn.addEventListener('click', () => {
  song.play()
    .then(() => {
      playBtn.style.display = 'none'; // hide the button after playing
    })
    .catch((e) => {
      alert("Audio failed to play. Try again.");
      console.error(e);
    });
});
