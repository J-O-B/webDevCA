// On Load 
$(document).ready(function(){
    $('#pricingContent').hide();
    $('.featBack').hide();
    heroCardCenter();
    typewrite();
});

// Generic function to use like python sleep function.
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
};

// ------------------------------------------ Hero section
// Center the hero card
function heroCardCenter(){
    heroHeight = $('#hero').height();
    boxHeight = $('#herocard').height();
    marginTop = (heroHeight - boxHeight) / 2;
    $('#herocard').css('margin-top', marginTop + 'px');
};
// Animated hero text
function typewrite(){
    let options = ['Vulnerability Assessment', 'Threat Modelling', 'Malware Analysis', 'Penetration Testing', 'Mobile Security', 'Email Security', 'CyberSecurity Solutions'];
    let textPos = 0;
    let speedWrite = 125;
    let speedRemove = 85;
    let item = 0;
    function write(){
        $('.typewrite').html(options[item].substring(0, textPos) + '<span class="blink">\u25ae<span>');
        if (textPos ++ != options[item].length + 1){
            setTimeout(write, speedWrite);
        }else{
            if (item < 6){
                sleep(1000);
                remove();
            }
        }
    };
    function remove(){
        $('.typewrite').html(options[item].substring(textPos, 0) + '<span class="blink">\u25ae<span>');
        if (textPos -- != -1){
            setTimeout(remove, speedRemove);
        }else{
            item += 1;
            sleep(200);
            write();
        }
    };
    write();
};

// --------------------------------------------------- News section
let news = ''
let loaded = 0;
$.getJSON('https://nci-ca-api.herokuapp.com/news', function(data){
    $('#newsStories').hide();
    let count = Object.keys(data).length;
    for (i=0; i<count; i++){
        title = data[i]['Title'];
        author = data[i]['Author'];
        summary = data[i]['Summary'];
        text = data[i]['Text'];
        img = data[i]['Img'];
        date = data[i]['Date'];
        news = news + `
        <div class="col-12 col-md-6 col-lg-3 outer-article text-center my-3 px-2 d-flex justify-content-center align-items-center">
            <div class="row px-2 py-3 m-3 article">
                <img class="newsImg" src="${img}">
                <h5 class="small">${title}</h3>
                <cite class="small">Author:<br>${author}</cite><br>
                <cite class="small">Published:<br>${date}</cite><br>
                <button type="button" class="btn custNewsBtn" data-bs-toggle="modal" data-bs-target="#example${i}Modal">
                    Read More
                </button>

                <!-- Modal -->
                <div class="modal fade" id="example${i}Modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">${title}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-10 offset-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                                        <img class="modalNewsImg" src="${img}">
                                        <p class="small text-center">
                                            Post From ${author} At <a href="https://thehackernews.com/" target="_blank" rel="noreferrer noopener">TheHackerNews.com</a>
                                        </p>
                                    </div>
                                </div>
                                <div class="newsSummaryModal${i}">
                                    <p class="fst-italic">${summary}</p>
                                    <div class="d-flex justify-content-center">
                                        <button class="readFullNews" onClick="fullNews(${i})">Full Story</button>
                                    </div>
                                </div>
                                <div class="newsFullModal${i} hidden">
                                    <p class="fst-italic">${text}</p>
                                    <div class="d-flex justify-content-center">
                                        <button class="readSummaryNews" onClick="summaryNews(${i})">Summary</button>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>       
        </div>`;
    }
    $('#newsLoad').hide('fade', {duration: 500});
    $('#newsLoad').promise().done(function(){
        $('#newsStories').append(news).show('fade', {duration: 1500});
        equalNewsHeight();
    });
});
// Equal the news card heights
let newsHeight = 0;
function equalNewsHeight(){
    $('.outer-article').each(function(){
        if ($(this).outerHeight() > newsHeight){
            newsHeight = $(this).height();
        };
    });
    $('.article').each(function(){
        $(this).height(newsHeight);
    });
};

// Functions to toggle between summary and full article (news).
function fullNews(id){
    $(`.newsSummaryModal${id}`).hide('fade', {duration: 500});
    $(`.newsSummaryModal${id}`).promise().done(function(){
        $(`.newsSummaryModal${id}`).toggleClass('hidden');
        $(`.newsFullModal${id}`).hide();
        $(`.newsFullModal${id}`).promise().done(function(){
            $(`.newsFullModal${id}`).toggleClass('hidden');
            $(`.newsFullModal${id}`).show('fade', {duration: 1000});
        });
    });
};
function summaryNews(id){
    $(`.newsFullModal${id}`).hide('fade', {duration: 500});
    $(`.newsFullModal${id}`).promise().done(function(){
        $(`.newsFullModal${id}`).toggleClass('hidden');
        $(`.newsSummaryModal${id}`).hide();
        $(`.newsSummaryModal${id}`).promise().done(function(){
            $(`.newsSummaryModal${id}`).toggleClass('hidden');
            $(`.newsSummaryModal${id}`).show('fade', {duration: 1000});
        });
    });
};


// ---------------------------------------------- Contact Section

let nowDate = new Date(); 
let fullTime = nowDate.getDate() + "/"
            + (nowDate.getMonth()+1)  + "/" 
            + nowDate.getFullYear() + " @ "  
            + nowDate.getHours() + ":"  
            + nowDate.getMinutes() + ":" 
            + nowDate.getSeconds();
$('#time').val(fullTime);

let feedback = '';
$('#contactBtn').click(function(event){
    event.preventDefault();
    user = $('#firstName').val() + " " + $('#lastName').val();
    email = $('#email').val();
    subject = $('#subject').val();
    time = $('#time').val();
    bodyContact = $('#bodyContact').val();
    url = `https://nci-ca-api.herokuapp.com/email?name=${user}&email=${email}&subject=${subject}&message=${bodyContact}&time=${time}` 
    $.get(url, function(e){
        feedback = e;
        $('.form-feedback').hide();
        $('.form-feedback').text(feedback);
        $('.form-feedback').show('slide', {duration: 1500});
    });
});

// Map tile is from openstreetmap, whilst the JS is from LeafletJS. 
// LeafletJS documentation: https://leafletjs.com/SlavaUkraini/reference.html
let map = L.map('map', {
    pin: true,
    pinCircle: true,
    pinControl: true,
    guideLayers: [],
});
let url = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
let attribution =
    'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
let options = new L.TileLayer(url, {
    minZoom: 4,
    maxZoom: 18,
    attribution: attribution,
});
var myIcon = L.icon({
    iconUrl: 'assets/media/pin.png',
    shadowUrl: 'assets/media/shadow.png',
    iconSize: [40, 55],
    iconAnchor: [20, 54],
    shadowSize: [50, 40],
    shadowAnchor: [-3, 40],
    });
var maker = L.marker([53.35, -6.25],{icon: myIcon}).addTo(map);
map.setView(new L.LatLng(53.35, -6.25), 13);
map.addLayer(options);

// Dynamically allocate hight to map.
let mapHeight = $('#form-contain').height();
$('#map').css('height', (mapHeight * .70) + 'px');
$('#contactDetails').css('height', (mapHeight * .30) + 'px');

// This will ensure map fully loads with new size set.
map.invalidateSize();

// ------------------------------------------------ Pricing Section
// Toggle between cards and individual information
let userWants = '';
function pricing(item){
    if (item.toLowerCase() == 'individual'){
        textHtml = `
        <h3 class="mt-3">Individual Pricing Plan</h3>
        <p class="lead">The individual pricing plan is designed for individuals or very small businesses.</p>
        <p class="lead">This plan will fit your needs, and help protect your business from scams, malware, and cyber attack.</p>
        <p class="lead">
            With this plan, you will gain access to resources that will help monitor your network, providing you with bi-weekly reports. <br>
            On signing up for this plan, one of our agents will be assigned to you to ensure correct configuration. <br>
            Once your signed up, our network monitor will watch all traffic that interacts with your online assets. Alerting you to 
            any potentially malicious requests.
        </p>`;
        userWants = 'individual';
    }else if (item.toLowerCase() == 'business'){
        textHtml = `
        <h3 class="mt-3">Business Pricing Plan</h3>
        <p class="lead">The business pricing plan is designed for SMEs (small to medium sized enterprises).</p>
        <p class="lead">This plan will fit your needs, and help protect your business from scams, malware, and cyber attack.</p>
        <p class="lead">
            With this plan, you will gain access to resources that will help monitor your network, providing you with weekly reports. <br>
            On signing up for this plan, one of our agents will be assigned to you to ensure correct configuration. <br>
            Once your signed up, our network monitor will watch all traffic that interacts with your online assets. Alerting you to 
            any potentially malicious requests.
        </p>`;
        userWants = 'business';
    }else if (item.toLowerCase() == 'corporate'){
        textHtml = `
        <h3 class="mt-3">Corporate Pricing Plan</h3>
        <p class="lead">The corporate pricing plan is designed for large businesses and large organisations.</p>
        <p class="lead">This plan will fit your needs, and help protect your business from scams, malware, and cyber attack.</p>
        <p class="lead">
            With this plan, you will gain access to resources that will help monitor your network, providing you with daily reports. <br>
            On signing up for this plan, one of our agents will be assigned to you to ensure correct configuration. <br>
            Once your signed up, our network monitor will watch all traffic that interacts with your online assets. Alerting you to 
            any potentially malicious requests.
        </p>`;
        userWants = 'corporate';
    };
    $('#pricingCardRow').hide('slide', {duration: 500});
    $('#pricingCardRow').promise().done(function(){
        $('.priceTarget').html(textHtml);
        $('.priceTarget').promise().done(function(){
            $('#pricingContent').show('slide', {duration: 1000});
        });
    });
};
// back button in pricing
function backPricing(){
    $('#pricingContent').hide('slide', {duration: 1000});
    $('#pricingContent').promise().done(function(){
        $('.priceTarget').html('');
        $('.priceTarget').promise().done(function(){
            $('#pricingCardRow').show('slide', {duration: 1500});
        });
    });
};
// Get button in pricing
function contact(){
    word = userWants.charAt(0).toUpperCase() + userWants.slice(1);
    string = `I Would Like More Information On The ${word} Plan.`;
    $('#subject').val(string);
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#contact-form").offset().top
    }, 2000);
};

function features(item){
    $('#featureHeader').hide();
    $('#featureBody').hide();
    data = {
        1: ['Phone Security','We provide the latest security for mobile devices. Protecting our clients from spyware and other forms of digital surveillance.'],
        2: ['Email Security',],
        3: ['Firewalls & Cyber Defense',],
        4: ['Malware Analysis',],
        5: ['Cryptography & Encryption',],
        6: ['Threat Hunting',],
        7: ['Password & Sensitive Data Protection',],
        8: ['Phishing Protection',],
    }
    $('.feat_image').parents('.col-6').each(function(index){
        $(this).delay(100 * index).hide('slide', {duration: 300});
    }).promise().then(function(){
        $('#featureHeader').text(data[item][0]);
        $('#featureBody').text(data[item][1]);
        $('#featureHeader').show('fade', {duration: 1000});
        $('#featureBody').show('fade', {duration: 1000});
        $('.featBack').show('slide', {duration: 500});
    });
}
function backFeat(){
    $('.featBack').hide('slide', {duration: 500});
    $('.featBack').promise().then(function(){
        $('#featureBody').hide('fade', {duration: 1000});
        $('#featureBody').promise().then(function(){
            $('#featureHeader').hide('fade', {duration: 1000});
        });
    });
    // remove content
    $('#featureHeader').text('');
    $('#featureBody').text('');

    // show icons
    $('.feat_image').parents('.col-6').each(function(index){
        $(this).show(800);
    })

}