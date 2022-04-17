// On Load 
$(document).ready(function(){
    $('#pricingContent').hide();
    $('.featBack').hide();
    $('.featureText').hide();
    heroCardCenter();
    featureHeight();
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
    // Text blobs we want to feed into the function.
    let options = ['Vulnerability Assessment', 'Threat Modelling', 'Malware Analysis', 'Penetration Testing', 'Mobile Security', 'Email Security', 'CyberSecurity Solutions'];
    let textPos = 0;
    let speedWrite = 150;
    let speedRemove = 100;

    // Variable Item will be used to select sections of options array
    let item = 0;
    function write(){
        $('.typewrite').html(options[item].substring(0, textPos) + '<span class="blink">_<span>');
        // If we are removing
        if (textPos ++ != options[item].length + 1){
            setTimeout(write, speedWrite);
        }else{
            if (item < 6){
                sleep(1500);
                remove();
            }
        }
    };
    function remove(){
        $('.typewrite').html(options[item].substring(textPos, 0) + '<span class="blink">_<span>');
        if (textPos -- != -1){
            setTimeout(remove, speedRemove);
        }else{
            item += 1;
            sleep(300);
            write();
        }
    };
    // Call the inner function to start
    write();
};

// --------------------------------------------------- News section
let news = ''
let loaded = 0;
// Get request to custom api.
$.getJSON('https://nci-ca-api.herokuapp.com/news', function(data){
    $('#newsStories').hide();
    let count = Object.keys(data).length;
    for (i=0; i<count; i++){
        // Specific targets that are returned in JSON format
        title = data[i]['Title'];
        author = data[i]['Author'];
        summary = data[i]['Summary'].replace('\n', "<br><br>");
        text = data[i]['Text'].replace('\n', "<br><br>");
        img = data[i]['Img'];
        date = data[i]['Date'];
        url = data[i]['Url'];
        
        // Output using bootstrap classes and dynamic ID's & classes
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
                                            Post From ${author} At <a href="${url}" target="_blank" rel="noreferrer noopener">TheHackerNews.com</a>
                                        </p>
                                    </div>
                                </div>
                                <div class="newsSummaryModal${i}">
                                    <p class="larger fst-italic">${summary}</p>
                                    <div class="d-flex justify-content-center">
                                        <button class="readFullNews" onClick="fullNews(${i})">Full Story</button>
                                    </div>
                                </div>
                                <div class="newsFullModal${i} hidden">
                                    <p class="larger fst-italic">${text}</p>
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
    // Styling related, when loaded hide the gif loader and show news
    $('#newsLoad').hide('fade', {duration: 500});
    $('#newsLoad').promise().done(function(){
        $('#newsStories').html(news).show('fade', {duration: 1500});
        equalNewsHeight();
    });
});
// Simple function to dynamically apply css to news cards.
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

function fullNews(id){
    // This function will hide the 'summary news' and display the 'full news article'
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
    // This function will hide the full news article and display the short summary version.
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

// Date javascript to apply a timestamp to the contact form
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
    // prevent page reload and get the data from form.
    event.preventDefault();
    
    // unsecure client side method of sanitizing a form, but for this project, this method
    // shows one way to validate a form on the client side.
    let userCheck = false;

    let fname = $('#firstName').val();
    let lname = $('#lastName').val();
    let email = $('#email').val();
    let subject = $('#subject').val();
    let bodyText = $('#bodyContact').val();
    
    function checkChars(data){
        // simple reusable function to check for illegal chars (whitelist method)
        allowed = "abcdefghijklmnopqrstuvwxyz 0123456789 '-,.@+&";
        good = '';
        bad = '';
        for (i=0; i<data.length; i++){
            char = data[i].toLowerCase();
            for (a=0; a<allowed.length;a++){
                if (allowed.includes(char) == true){
                    good = good + char;
                }else{
                    bad = bad + char;
                }
            }
            if (bad.length != 0){
                return false
            }
        }
        return true
    }

    let firstNameCheck = false;
    let lastNameCheck = false;
    let emailCheck = false;
    let subjectCheck = false;
    let bodyCheck = false;
    
    // individual functions on each input field
    function firstNameSanitize(){
        if (fname.length > 2){
            // length is ok, now check chars
            let fnameChars = checkChars(fname);
            if (fnameChars == true){
                $('.fname').css('color', '#00FF00').text('First Name Looks Good');
                firstNameCheck = true;
            }else if (fnameChars == false){
                $('.fname').css('color', '#FF0000').text('Illegal Character(s)');
            }
        }else{
            // name is short, fail.
            $('.fname').css('color', '#FF0000').text('First Name Is Too Short, Please Include Your Full First Name');
        }
    }
    
    function lastNameSanitize(){
        if (lname.length > 5){
            // length is ok, now check chars
            let lnameChars = checkChars(lname);
            if (lnameChars == true){
                $('.lname').css('color', '#00FF00').text('Last Name Looks Good');
                lastNameCheck = true;
            }else if (lnameChars == false){
                $('.lname').css('color', '#FF0000').text('Illegal Character(s)');
            }
        }else{
            // name is short, fail.
            $('.lname').css('color', '#FF0000').text('Last Name Is Too Short, Please Include Your Full Last Name');
        }
    }

    function emailSanitize(){
        if (email.length > 10){
            // length is ok, now check chars
            let emailChars = checkChars(email);
            if (emailChars == true && email.includes('@')){
                $('.emailFeed').css('color', '#00FF00').text('Email Looks Good');
                emailCheck = true;
            }else if (lnameChars == false){
                $('.emailFeed').css('color', '#FF0000').text('Please Check Your Email Input');
            }
        }else{
            // too short, fail.
            $('.emailFeed').css('color', '#FF0000').text('Email Is Too Short, Please Check Your Input');
        }
    }

    function subjectSanitize(){
        if (subject.length > 0){
            // length is ok, now check chars
            let subjectChars = checkChars(subject);
            if (subjectChars == true){
                $('.formSubject').css('color', '#00FF00').text('Subject Looks Good!');
                subjectCheck = true;
            }else if (subjectChars == false){
                $('.formSubject').css('color', '#FF0000').text('Illegal Character(s)');
            }
        }else{
            // name is short, fail.
            $('.formSubject').css('color', '#FF0000').text('Subject Cannot Be Empty');
        }
    }

    function bodySanitize(){
        if (bodyText.length > 0){
            // length is ok, now check chars
            let bodyTextChars = checkChars(bodyText);
            if (bodyTextChars == true){
                $('.formBody').css('color', '#00FF00').text('Message Looks Good!');
                subjectCheck = true;
            }else if (bodyTextChars == false){
                $('.formBody').css('color', '#FF0000').text('Illegal Character(s)');
            }
        }else{
            // too short, fail.
            $('.formBody').css('color', '#FF0000').text('Message Input Cannot Be Empty');
        }
    }
    // call functions
    firstNameSanitize();
    lastNameSanitize();
    emailSanitize();
    subjectSanitize();
    bodySanitize();

    if (firstNameCheck == true && lastNameCheck == true && emailCheck ==true && subjectCheck == true && bodyCheck == true){
        user = $('#firstName').val() + " " + $('#lastName').val();

        time = fullTime;
        url = `https://nci-ca-api.herokuapp.com/email?name=${user}&email=${email}&subject=${subject}&message=${bodyText}&time=${time}` 
        $.get(url, function(e){
            feedback = e;
            $('.form-feedback').hide();
            $('.form-feedback').text(feedback);
            $('.form-feedback').show('slide', {duration: 1500});
        });
    }
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
let myIcon = L.icon({
    iconUrl: 'assets/media/pin.png',
    shadowUrl: 'assets/media/shadow.png',
    iconSize: [40, 55],
    iconAnchor: [20, 54],
    shadowSize: [50, 40],
    shadowAnchor: [-3, 40],
});
let maker = L.marker([53.34894043391136, -6.242988972456376],{icon: myIcon}).addTo(map);
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
        2: ['Email Security', 'We defend against phishing attacks, through active scanning, employee awareness and other techniques'],
        3: ['Firewalls & Cyber Defense','Configure and deploy a firewall that secures your assets from malware and other attacks.'],
        4: ['Malware Analysis', 'We actively analyze malware to keep firewalls and other defenses up to date.'],
        5: ['Cryptography & Encryption','We provide encryption services that secure your data, even in the event of a data leak.'],
        6: ['Threat Hunting','SecureX analyze the threats of each client, providing custom threat modelling in each case.'],
        7: ['Password & Sensitive Data Protection','Via our systems, we provide varying forms of multi factor authentication. We also track leaked passwords to ensure unique and complex passwords are in use.'],
        8: ['Phishing Protection','Phishing is a common social engineering attack that is often used to steal credentials. We provide active protection against phishing attacks.'],
    }
    icHeight = $('.icons').height();
    $('.feat_image').parents('.col-6').each(function(index){
        $(this).delay(100 * index).hide('slide', {duration: 300});
    }).promise().then(function(){
        $('#featureHeader').text(data[item][0]);
        $('#featureBody').text(data[item][1]);
        rowHeight = ($('#featureHeader').height() + $('#featureBody').height());
        featMargin = (icHeight - rowHeight) / 2;
        $('#featureHeader').css('margin-top', featMargin+'px');
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

function featureHeight(){
    let featHeight = $('.featureIcons').height();
    $('.featureIcons').css('min-height', featHeight+'px');
}