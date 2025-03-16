document.addEventListener("DOMContentLoaded", function() {
    const musica = document.getElementById("musica");
    function tocarMusica() {
        musica.play().catch(() => {
            document.addEventListener("click", tocarMusica, { once: true });
        });
    }
    tocarMusica();
});
