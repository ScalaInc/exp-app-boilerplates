(function () {  

  addEventListener('scala', function () {

    var anchor = document.getElementById('anchor');
    anchor.setAttribute('class', 'twitter-timeline');
    anchor.setAttribute('data-widget-id', scala.app.config.id);
    anchor.setAttribute('data-chrome', 'nofooter');
    document.body.appendChild(anchor);

    var protocol = /^http:/.test(document.location)?'http':'https';
    
    var script = window.document.createElement('script');
    script.setAttribute('id', 'twitter-wjs');
    script.setAttribute('src', protocol + '://platform.twitter.com/widgets.js');
        
    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(script, firstScript);
    
  });
  
}());
