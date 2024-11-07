const copy_text = () => {
    var range = document.createRange()
    range.selectNode(document.getElementById('console'));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    // HTML5 has no real alternative to execCommand('copy')?
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    alert("Copied the text");
    navigator.clipboard.writeText(text.value);
    
}

document.getElementById("copy-code").addEventListener("click", copy_text);
