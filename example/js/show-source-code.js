
(function (script) {
    script.parentNode.removeChild(script);
    var code = document.body.innerHTML;

    var escapeMap = {
        "<": "&#60;",
        ">": "&#62;",
        '"': "&#34;",
        "'": "&#39;",
        "&": "&#38;"
    };


    var escapeFn = function (s) {
        return escapeMap[s];
    };

    var escapeHTML = function (content) {
        return content.replace(/&(?![\w#]+;)|[<>"']/g, escapeFn);
    };

    // dialog-title="" >>> dialog-title
    code = code.replace(/(\s+[\w-]+)=""/g, '$1').trim();
    code = escapeHTML(code);

    document.write('<pre class="source-code"><code>' + code + '<\/code><\/pre>');
})(document.getElementById('show-source-code'));

