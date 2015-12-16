
(function (script) {
    document.body.removeChild(script);
    var code = document.body.innerHTML;

    // dialog-title="" >>> dialog-title
    code = code.replace(/(\s+[\w-]+)=""/g, '$1').trim();

    document.write('<script type="text\/template">' + code + '<\/script>');
})(document.getElementById('show-source-code'));

