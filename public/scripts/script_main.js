import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const previewVideo = document.getElementById("previewVideo");
const videoModal = document.getElementById("videoModal");
const closeModal = document.getElementById("closeModal");
const socket = io();
const form = document.getElementById("form");
const input = document.getElementById("input");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});

previewVideo.addEventListener("click", () => {
  videoModal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
  videoModal.style.display = "none";
  const video = videoModal.querySelector("video");
  video.pause();
  video.currentTime = 0;
});
