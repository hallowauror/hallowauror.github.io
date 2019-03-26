var CACHE_NAME = 'my-pwa-cache-v1';

var urlsToCache = [
    '/',
    '/css/main.css',
    '/css.utill.css',
    '/images/bg-01.jpg',
    '/images/icons/favicon.ico',
    '/js/jquery.min.js',
    '/js/main.js',
    '/vendor/animate/animate.css',
    '/vendor/animsition/css/animsition.css',
    '/vendor/animsition/css/animsition.min.css',
    '/vendor/animsition/js/animsition.js',
    '/vendor/animsition/js/animsition.min.js',
    '/vendor/bootstrap/css/bootstrap-grid.css',
    '/vendor/bootstrap/css/bootstrap-grid.min.css',
    '/vendor/bootstrap/css/bootstrap-reboot.css',
    '/vendor/bootstrap/css/bootstrap-reboot.min.css',
    '/vendor/bootstrap/css/bootstrap.css',
    '/vendor/bootstrap/css/bootstrap.min.css',
    '/vendor/bootstrap/js/bootstrap.js',
    '/vendor/bootstrap/js/bootstrap.min.js',
    '/vendor/bootstrap/js/popper.js',
    '/vendor/bootstrap/js/popper.min.js',
    '/vendor/bootstrap/js/tooltip.js',
    '/vendor/countdowntime.js',
    '/vendor/css-hamburgers/hamburgers.css',
    '/vendor/css-hamburgers/hamburgers.min.css',
    '/vendor/daterangepicker/daterangepicker.css',
    '/vendor/daterangepicker/daterangepicker.js',
    '/vendor/daterangepicker/moment.js',
    '/vendor/daterangepicker/moment.min.js',
    '/vendor/jquery/jquery-3.2.1.min.js',
    '/vendor/perfect-scrollbar/perfect-scrollbar.css',
    '/vendor/perfect-scrollbar/perfect-scrollbar.min.js',
    '/vendor/select2/select2.css',
    '/vendor/select2/select2.js',
    '/vendor/select2/select2.min.css',
    '/vendor/select2/select2.min.js',
    '/manifest.json'
];

self.addEventListener('install', function(event){
    //do install
    event.waitUntil(
        caches.open(CACHE_NAME).then(
            function(cache){
                //cek apakah cache sudah terinstall
                console.log("service worker do install . .");
                return cache.addAll(urlToCache);
            }
        )
    );
    self.skipWaiting();
});

//aktivasi service worker
self.addEventListener('activate', function(event){
    event.waitUntil(
        caches.keys().then(function(cacheName){
            return Promise.all(
                //jika sudah ada cache dengan versi beda maka di hapus
                cacheName.filter(function(cacheName){
                    return cacheName !== CACHE_NAME;
                }).map(function(cacheName){
                    return caches.delete(cacheName);
                })
            );
        })
    );
    if(self.clients && clients.claim){
        clients.claim();
    }
});

//fetch cache
self.addEventListener('fetch', function(event){
    var request = event.request;
    var url = new URL(request.url);

    /**
     * menggunakan data local cache
     */

     if(url.origin === location.origin){
         event.respondWith(
             caches.match(request).then(function(response){
                 //jika ada data di caache, maka tampilkan data cache, jika tidak maka petch request
                 return response || fetch(request);
             })
         )
     }else{
         //internet API
         event.respondWith(
             caches.open('mahasiswa-cache-v1').then(function(cache){
                 return fetch(request).then(function(liveRequest){
                     cache.put(request, liveRequest.clone());
                     //save cache to mahasiswa-cache-v1
                     return liveRequest;
                 }).catch(function(){
                     return caches.match(request).then(function(response){
                         if(response) return response;
                         return caches.match('/fallback.json');
                     })
                 })
             })
         )
     }
});