
(function ($) {
    "use strict";



  
  
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    

})(jQuery);

if ('serviceWorker' in navigator){
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/serviceworker.js').then(function (reg) {
            // console.log('SW regis sukses dgn skop',reg.scope)
            return navigator.serviceWorker.ready;
        }).then(function(reg){
            document.getElementById('req-sync').addEventListener('click', function (){
                reg.sync.register('image-fetch').then(() => {
                    console.log('sync-registered');
                }).catch(function(err){
                    console.log('unable to fetch image. Error: ', err);
                });
            });
        }, function (err) {
            console.log('unable to register service worker, Error : ',err);
        });
    })
}

var networkDataReceive = false;
    /* cek di Cache apakah sudah ada? jika belum maka ambil data dari service online */
    var networkUpdate = fetch(_url).then(function(response){
        return response.json();
    }).then(function(data){
        networkDataReceive = true;
        renderPage(data)
    });

    /* Fetch data dari cache */
    caches.match(_url).then (function(response){
        if(!response) throw Error ("no data on cache");
        return response.json();
    }).then (function(data){
        if(!networkDataReceive){
            renderPage(data);
            console.log('render data from cache');
        }
    }).catch(function() {
        return networkUpdate;
    })