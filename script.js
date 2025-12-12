const imageInput = document.getElementById("imageInput");
const metadataDiv = document.getElementById("metadata");
const removeBtn = document.getElementById("removeBtn");

imageInput.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    // === IMAGE PREVIEW ===
    const preview = document.getElementById('preview');
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";

    // Your existing metadata code will continue here
});

  const reader = new FileReader();
  reader.onload = function () {
    const dataURL = reader.result;
    const exif = piexif.load(dataURL);

    let gps = exif["GPS"] ? "GPS Data Found ✅" : "No GPS Data Found ❌";
    let model = exif["0th"][piexif.ImageIFD.Model] || "Unknown Device";
    let date = exif["0th"][piexif.ImageIFD.DateTime] || "Unknown Date";

    metadataDiv.style.display = "block";
    metadataDiv.innerHTML = `
    <b>Metadata Found:</b><br><br>
      📍 ${gps}<br>
      📱 Device: ${model}<br>
      🕒 Date Taken: ${date}
    `;

    // ✅ Features added INSIDE
    displayFullMetadata(exif);
    detectAuthenticity(exif);

    removeBtn.style.display = "block";
    removeBtn.onclick = () => {
        let exifRemoved = piexif.remove(dataURL);
        downloadCleanImage(exifRemoved, file.name);
    };
};
  reader.readAsDataURL(file);
  // your existing functions here...
// downloadCleanImage()
// detectAuthenticity()
// etc.

// ✅ ADD THIS FUNCTION ANYWHERE OUTSIDE reader.onload
function displayFullMetadata(exif) {
  const fullMetaDiv = document.getElementById("fullMetadata");
  fullMetaDiv.innerHTML = 
    "<b>Full Metadata:</b><br><br>" +
    JSON.stringify(exif, null, 2).replace(/\n/g, "<br>");
  fullMetaDiv.style.display = "block";
}
function detectAuthenticity(exif) {
  let result = "Likely Original ✅";

  if (!exif.Make && !exif.Model) result = "Possible Re-edit / AI Generated ⚠";
  if (exif.Software && exif.Software.toLowerCase().includes("photoshop"))
    result = "Edited in Photoshop 🎨";
  if (exif.Software && exif.Software.toLowerCase().includes("snapseed"))
    result = "Edited in Snapseed 🎨";
  if (exif["AI-Edited"] === true)
    result = "Likely AI Generated 🤖";

  alert("Image Authenticity: " + result);
}
function downloadCleanImage(data, filename) {
  const a = document.createElement("a");
  a.href = data;
  a.download = "CLEAN_" + filename;
  a.click();
}
});


