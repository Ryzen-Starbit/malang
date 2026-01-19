const video = document.getElementById('video');

navigator.mediaDevices.getUserMedia({
  video: {
    facingMode: { ideal: "environment" }
  }
})
.then(stream => {
  video.srcObject = stream;
})
.catch(err => {
  console.error("Camera access error:", err);
  showAlert("Error", err.message+".", [{ text: "OK" }]);
});
