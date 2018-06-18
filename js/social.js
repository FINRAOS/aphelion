
// source: https://stackoverflow.com/questions/152975/how-do-i-detect-a-click-outside-an-element
function hideOnClickOutside(element) {
    const outsideClickListener = event => {
        if (!element.contains(event.target)) { // or use: event.target.closest(selector) === null
            if (isVisible(element)) {
                element.style.display = 'none';
                removeClickListener();
            }
        }
    }

    const removeClickListener = () => {
        document.removeEventListener('click', outsideClickListener);
    }

    document.addEventListener('click', outsideClickListener);
}

const isVisible = elem => !!elem && !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
// source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js

var fos = fos || {};

fos.list = (function() {
    function socialMenu() {

        // querySelector returns the first element it finds with the correct selector
        // addEventListener is roughly analogous to $.on()
        document.querySelector('#social-list-toggle').addEventListener('click', function(e) {
            e.preventDefault();
            var container = document.querySelector('#social-links-container');
            if (container.classList.contains('active')) {
              container.classList.remove('active');
              container.classList.add('inactive');
            }
            else {
              container.classList.add('active');
              container.classList.remove('inactive');
              // hideOnClickOutside(container);
            }
        });
    }

    return {
        socialMenu: socialMenu
    };
})();

fos.helpers = (function() {
    function jsCheck() {

        var bodyClass = document.querySelector('html').classList;
        bodyClass.remove('no-js');
        bodyClass.add('js');
    }

    return {
        jsCheck: jsCheck
    };
})();

// start everything
// this isn't in a doc.ready - loaded at the bottom of the page so the DOM is already ready
fos.helpers.jsCheck();
fos.list.socialMenu();

SocialShareKit.init();
