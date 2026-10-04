const uploadArea = document.getElementById("uploadArea");
const fileInput = document.getElementById("fileInput");
const previewImage = document.getElementById("previewImage");
const imagePreview = document.getElementById("imagePreview");
const uploadContent = document.getElementById("uploadContent");
const removeImageBtn = document.getElementById("removeImage");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const imageDimensions = document.getElementById("imageDimensions");
const fileFormat = document.getElementById("fileFormat");

let currentFile = null;
let currentImage = null;
let currentObjectUrl = null;

function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getFileFormat(file) {
    if (file.type === "image/jpeg") return "JPG";
    if (file.type === "image/png") return "PNG";
    if (file.type === "image/webp") return "WebP";
    if (file.type === "image/gif") return "GIF";
    if (file.type === "image/bmp") return "BMP";
    if (file.type === "image/svg+xml") return "SVG";
    return file.type ? file.type.split("/")[1].toUpperCase() : "IMAGE";
}

function isValidImage(file) {
    return file && file.type.startsWith("image/");
}

function showImagePreview(file) {
    if (!isValidImage(file)) {
        alert("Please select a valid image file.");
        return;
    }

    currentFile = file;

    if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
    }

    currentObjectUrl = URL.createObjectURL(file);

    const image = new Image();

    image.onload = function () {
        currentImage = image;

        previewImage.src = currentObjectUrl;

        if (uploadContent) {
            uploadContent.style.display = "none";
        }

        if (imagePreview) {
            imagePreview.style.display = "block";
        }

        if (removeImageBtn) {
            removeImageBtn.style.display = "inline-flex";
        }

        if (fileName) {
            fileName.textContent = file.name;
        }

        if (fileSize) {
            fileSize.textContent = formatFileSize(file.size);
        }

        if (imageDimensions) {
            imageDimensions.textContent = `${image.naturalWidth} × ${image.naturalHeight}px`;
        }

        if (fileFormat) {
            fileFormat.textContent = getFileFormat(file);
        }
    };

    image.onerror = function () {
        alert("Unable to load this image.");
        resetImagePreview();
    };

    image.src = currentObjectUrl;
}

function resetImagePreview() {
    currentFile = null;
    currentImage = null;

    if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
        currentObjectUrl = null;
    }

    if (previewImage) {
        previewImage.removeAttribute("src");
    }

    if (fileInput) {
        fileInput.value = "";
    }

    if (uploadContent) {
        uploadContent.style.display = "";
    }

    if (imagePreview) {
        imagePreview.style.display = "none";
    }

    if (removeImageBtn) {
        removeImageBtn.style.display = "none";
    }

    if (fileName) {
        fileName.textContent = "";
    }

    if (fileSize) {
        fileSize.textContent = "";
    }

    if (imageDimensions) {
        imageDimensions.textContent = "";
    }

    if (fileFormat) {
        fileFormat.textContent = "";
    }
}

if (uploadArea && fileInput) {
    uploadArea.addEventListener("click", function (event) {
        if (event.target.closest("button")) return;
        fileInput.click();
    });

    fileInput.addEventListener("change", function () {
        const file = this.files[0];

        if (file) {
            showImagePreview(file);
        }
    });

    uploadArea.addEventListener("dragover", function (event) {
        event.preventDefault();
        uploadArea.classList.add("dragging");
    });

    uploadArea.addEventListener("dragleave", function (event) {
        event.preventDefault();
        uploadArea.classList.remove("dragging");
    });

    uploadArea.addEventListener("drop", function (event) {
        event.preventDefault();
        uploadArea.classList.remove("dragging");

        const file = event.dataTransfer.files[0];

        if (file) {
            showImagePreview(file);
        }
    });
}

if (removeImageBtn) {
    removeImageBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        resetImagePreview();
    });
}

window.PIXORA = {
    getCurrentFile: () => currentFile,
    getCurrentImage: () => currentImage,
    showImagePreview,
    resetImagePreview
};