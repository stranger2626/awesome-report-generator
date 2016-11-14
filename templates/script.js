window.onload = function() {

    var accordionTitles = document.getElementsByClassName('accordion-title');

    Array.prototype.slice.call(accordionTitles).forEach(function(title) {

        title.onclick = function() {
            var content = next(title),
                style = window.getComputedStyle(content),
                display = style.getPropertyValue('display');

            if (display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
            return false;
        }
    });
};


function next(elem) {
    do {
        elem = elem.nextSibling;
    } while (elem && elem.nodeType !== 1);
    return elem;
}

$(document).ready(function() {
    $('a.toggle').on('click', function() {
        if ($(this).text() === 'Screenshot -') {
            $(this).text('Screenshot +');
            $(this).siblings('a.screenshot').find('img').hide();
        } else {
            $(this).text('Screenshot -');
            $(this).siblings('a.screenshot').find('img').show();
        }
    });
});
