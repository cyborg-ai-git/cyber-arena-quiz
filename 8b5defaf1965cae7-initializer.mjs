// Trunk reports downloaded bytes; Rust hides the overlay only after eframe starts.
const downloadMax = 90;
const startedAt = performance.now();
let elapsedTimer;

function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
}

function showProgress(percent, label) {
    const value = Math.min(100, Math.max(0, Number.isFinite(percent) ? percent : 0));
    const bar = document.getElementById('progress-bar');
    const track = document.getElementById('progress-track');
    const text = document.getElementById('progress-text');
    const heading = document.getElementById('loading-text');
    if (bar) bar.style.width = `${value}%`;
    if (track) track.setAttribute('aria-valuenow', String(Math.round(value)));
    if (text) text.textContent = `${Math.round(value)}%`;
    if (heading && label) heading.textContent = label;
}

export default function initializer() {
    return {
        onStart() {
            showProgress(0, 'Connessione in corso…');
            elapsedTimer = window.setInterval(() => {
                const screen = document.getElementById('loading-screen');
                if (!screen || screen.classList.contains('hidden')) {
                    window.clearInterval(elapsedTimer);
                    return;
                }
                const elapsed = document.getElementById('loading-elapsed');
                if (elapsed) elapsed.textContent = `${((performance.now() - startedAt) / 1000).toFixed(1)} s`;
            }, 100);
        },
        onProgress({ current, total }) {
            if (!total) {
                showProgress(0, `Scaricamento… ${formatBytes(current)}`);
                return;
            }
            showProgress(current / total * downloadMax,
                `Scaricamento… ${formatBytes(current)} / ${formatBytes(total)}`);
        },
        onComplete() {
            showProgress(downloadMax, 'Preparazione del modulo…');
        },
        onSuccess() {
            showProgress(95, 'Avvio dell’interfaccia…');
        },
        onFailure(error) {
            window.clearInterval(elapsedTimer);
            const heading = document.getElementById('loading-text');
            if (heading) {
                heading.textContent = 'Caricamento non riuscito. Ricarica la pagina.';
                heading.classList.add('error');
            }
            console.error('Cyber Arena startup failed:', error);
        },
    };
}
