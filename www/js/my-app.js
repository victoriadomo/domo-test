// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

// Option 2. Using one 'pageInit' event handler for all pages:
// $$(document).on('pageInit', function (e) {
//     // Get page data from event data
//     var page = e.detail.page;

//     if (page.name === 'about') {
//         // Following code will be executed for page with data-page attribute equal to "about"
//         myApp.alert('Here comes About page');
//     }
// })

// // Option 2. Using live 'pageInit' event handlers for each page
// $$(document).on('pageInit', '.page[data-page="about"]', function (e) {
//     // Following code will be executed for page with data-page attribute equal to "about"
//     myApp.alert('Here comes About page');
// })

/* FEEDS  */

let portfolioRest = 'http://clientes.domo.com.ar/DOMO/web/www_alfa/wordpress/wp-json/wp/v2/portfolio';

$.ajax({
    url: portfolioRest,
    type: "GET",
    contentType: "application/json",
    success: portfolioJson,
    statusCode: {
        201: success201,
        400: notsuccess,
        500: notsuccess
    }
});

function portfolioJson(posts) {
    // convierte el resultado a json
    // genera un nuevo array de objetos portfolio , tuneado
    let resultado= posts.reduce(
        function (acu, post) {
            let postNew = {
                'id': post.id,
                'modified': post.modified,
                'content': post.content.rendered,
                'title': post.title.rendered
            };
            //obtiene la media de cada uno de los elementos
            getMedia(postNew);
            acu.push(postNew);
            // TODO: LOAD MEDIA
            return acu;
        },
        [] //este valor inicializa el acumulador como un array en cero
    );
    // console.log(resultado);
    localStorage.setItem('base', JSON.stringify(resultado));

    // document.getElementById("resultado").innerHTML = resultado[0].title;
}

function getMedia(post) {
    var portfolioRestMedia = 'http://clientes.domo.com.ar/DOMO/web/www_alfa/wordpress/wp-json/wp/v2/media?parent=' + post.id;
    //inicializa una propiedad en el post llamada media como una array vacio
    // la vamos a llenar con el resultado del get 
    post.media=[];
    $.ajax({
        url: portfolioRestMedia,
        type: "GET",
        contentType: "application/json",
        success: success,
        statusCode: {
            201: success201,
            400: notsuccess,
            500: notsuccess
        }
    });

    function success(medias) {
        //obtiene el array de objetos
        post.media = medias.reduce(
            function (acu, media) {
                let mediaNew = {
                    'id': media.id,
                    'modified': media.modified,
                    'link': media.guid.rendered
                };
                acu.push(mediaNew);
                // TODO: LOAD MEDIA
                return acu;
            },
            []//este valor inicializa el acumulador como un array en cero
        );
    }
}

var success201 = function (data, textStatus, jqXHR) {
    // We have received response and can hide activity indicator
    //myApp.hideIndicator();
    // Will pass context with retrieved user name
    // to welcome page. Redirect to welcome page
    //mainView.router.load({
    //    template: Template7.templates.welcomeTemplate,
    //    context: {
    //        name: username
    //    }
    //});
    console.log("200");
};

var notsuccess = function (data, textStatus, jqXHR) {
    // We have received response and can hide activity indicator
    //myApp.hideIndicator();
    //myApp.alert('Login was unsuccessful, please try again');
    console.log("error");
};

var traerBase = localStorage.getItem('base');
var baseJson = JSON.parse(traerBase);

// document.getElementById("resultado").innerHTML = baseJson.post.id;

for(var i=0; i < baseJson.length; i++) {
    // console.log(baseJson[i]);
    document.getElementById("resultado").innerHTML += '<div class="swiper-slide"><div class="card">'
                               +'<div class="card-header">'+baseJson[i].title+'</div>' 
                               +' <div class="card-content card-content-padding publi-id-'+baseJson[i].id+'">'
                               +'<img src="'+baseJson[i].media.link+'" alt="'+baseJson[i].title+'">'
                               +baseJson[i].content.substr(0, 150)+"..."
                               +' </div>'
                               +' <div class="card-footer"><a href="#">Ver mas</a></div>'
                               +' </div></div>';

baseJson[i].id+"<br>";
}
