const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

let source;

let audio = null;
let audioSource = null;

const gainNode = audioContext.createGain();
const panNode = audioContext.createStereoPanner();
const filterNode = audioContext.createBiquadFilter();
filterNode.type = filterNode.LOWPASS;
filterNode.frequency.value = 3000;

const app = {
  init() {
    this.cacheElements();
    this.registerListeners();
  },

  bufferSong() {
    const selectedSong = this.$songselector.value;

    audio = new Audio(`./audio/${selectedSong}.mp3`);
    console.log(audio);
    audioSource = audioContext.createMediaElementSource(audio);
    audioSource // bron
      .connect(gainNode) // modificatie 1: volume
      .connect(panNode) // modificatie 2: panning
      .connect(filterNode)
      .connect(audioContext.destination); // eindbestemming
  },
  cacheElements() {
    this.$audioEl = document.querySelector("audio");
    this.$songselector = document.querySelector("#songselector");
    this.$playBtn = document.querySelector("#play");
    this.$stopBtn = document.querySelector("#stop");
    this.$volumeInp = document.querySelector("#volume");
    this.$panInp = document.querySelector("#pan");
    this.$filterInp = document.querySelector("#filter");
  },
  registerListeners() {
    this.$songselector.addEventListener("change", () => {
      this.stopMusic();
    });

    this.$playBtn.addEventListener("click", () => {
      // check if context is in suspended state (autoplay policy)
      audioContext.state === "suspended" ? audioContext.resume() : "";
      this.playMusic();
    });

    this.$stopBtn.addEventListener("click", () => {
      this.stopMusic();
    });

    this.$volumeInp.addEventListener("input", function () {
      // change gain
      gainNode.gain.value = this.value;
    });

    this.$panInp.addEventListener("input", function () {
      // change pan
      // @students: todo make the panning work!...
      panNode.pan.value = this.value;
    });

    this.$filterInp.addEventListener("input", function () {
      // change filter
      var minValue = 40;
      var maxValue = audioContext.sampleRate / 2;
      var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
      var multiplier = Math.pow(2, numberOfOctaves * (this.value - 1.0));
      filterNode.frequency.value = maxValue * multiplier;
    });
  },
  playMusic() {
    this.$playBtn.disabled = true;
    this.$stopBtn.disabled = false;
    this.bufferSong();
    audio.play();
  },
  stopMusic() {
    this.$stopBtn.disabled = true;
    this.$playBtn.disabled = false;
    audio.pause();
    audio.currentTime = 0;
  },
};

document.addEventListener("DOMContentLoaded", app.init());
/* made with <3 4 PGM-3 */
