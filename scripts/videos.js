document.addEventListener("DOMContentLoaded", function () {
    const videoSection = document.querySelector(".video");
    const toggleButton = document.getElementById("toggleVideo");

    toggleButton.addEventListener("click", function () {
        if (videoSection.style.display === "none" || videoSection.style.display === "") {
            videoSection.style.display = "block";
            toggleButton.textContent = "Ocultar Vídeo";
        } else {
            videoSection.style.display = "none";
            toggleButton.textContent = "Mostrar Vídeo";
        }
    });
});
