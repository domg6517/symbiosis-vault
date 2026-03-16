if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(regs) {
              regs.forEach(function(r) { r.unregister(); });
            });
          }if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').then(function(reg) {
                reg.addEventListener('updatefound', function() {
                  var newWorker = reg.installing;
                  newWorker.addEventListener('statechange', function() {
                    if (newWorker.state === 'activated') {
                      window.location.reload();
                    }
                  });
                });
              });
            });
          }
        `}} />
      </body>
    </html>
  );
}
