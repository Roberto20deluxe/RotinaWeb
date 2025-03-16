document.addEventListener("DOMContentLoaded", function() {
    const musica = document.getElementById("musica");

    function tocarMusica() {
        musica.play().catch(() => {
            console.log("Autoplay bloqueado. Tentando novamente após interação.");
            document.addEventListener("click", tocarMusica, { once: true });
        });
    }

    tocarMusica();
});
