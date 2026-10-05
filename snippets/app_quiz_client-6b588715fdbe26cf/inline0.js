
export async function copyQuizShareText(text) {
    const fallback = () => {
        const field = document.createElement('textarea');
        field.value = text;
        field.setAttribute('readonly', '');
        field.style.cssText = 'position:fixed;left:-9999px;top:0';
        document.body.appendChild(field);
        field.select();
        try { return document.execCommand('copy'); }
        catch (_) { return false; }
        finally { field.remove(); }
    };
    if (fallback()) return true;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        try { await navigator.clipboard.writeText(text); return true; }
        catch (_) { return false; }
    }
    return false;
}
