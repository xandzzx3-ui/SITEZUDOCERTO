document.addEventListener('DOMContentLoaded', function() {
    const music = document.getElementById('background-music');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeIcon = document.getElementById('volume-icon');
    const photoCards = document.querySelectorAll('.photo-card');

    // Define o volume inicial
    music.volume = volumeSlider.value / 100;

    // Função para iniciar a música
    function startMusic() {
        if (music.paused) {
            music.play().catch(error => {
                // Se ainda falhar (o que é raro após o primeiro clique), registra o erro
                console.error("Falha ao iniciar a música:", error);
            });
        }
    }

    // --- LÓGICA DE AUTOPLAY: Inicia a música no primeiro clique em qualquer lugar do documento. ---
    // Isso garante que a música comece assim que houver interação do usuário.
    document.addEventListener('click', function(e) {
        startMusic();
        // Remove este listener após a primeira execução para não interferir.
        document.removeEventListener('click', arguments.callee);
    }, { once: true });


    // --- LÓGICA DAS CARTAS ---
    photoCards.forEach(card => {
        card.addEventListener('click', function() {
            // Alterna a classe 'open' na div .photo-card principal para o efeito de revelação
            card.classList.toggle('open');
            
            // O startMusic() já é chamado pelo listener 'document' acima, mas se ele for removido
            // este clique em uma carta serve como backup de interação:
            startMusic();
        });
    });

    
    // --- LÓGICA DO CONTROLE DE MÚSICA (Mantida) ---
    
    // Atualiza o volume quando o slider é movido
    volumeSlider.addEventListener('input', function() {
        const volume = this.value / 100;
        music.volume = volume;
        updateVolumeIcon(volume);
    });

    // Lógica para mudar o ícone de volume
    function updateVolumeIcon(volume) {
        if (volume === 0) {
            volumeIcon.className = 'fas fa-volume-off';
        } else if (volume < 0.5) {
            volumeIcon.className = 'fas fa-volume-down';
        } else {
            volumeIcon.className = 'fas fa-volume-up';
        }
    }
    
    // Adiciona a funcionalidade de mutar/desmutar ao clicar no ícone
    let lastVolume = music.volume;
    volumeIcon.addEventListener('click', function() {
        if (music.volume === 0) {
            // Desmutar
            music.volume = lastVolume > 0 ? lastVolume : 0.5; // Volta para o último volume ou 50%
            volumeSlider.value = music.volume * 100;
            // Se a música estiver pausada (mutada por completo), tente tocar novamente
            if (music.paused) {
                music.play().catch(error => {});
            }
        } else {
            // Mutar
            lastVolume = music.volume; // Salva o volume atual
            music.volume = 0;
            volumeSlider.value = 0;
        }
        updateVolumeIcon(music.volume);
    });
});