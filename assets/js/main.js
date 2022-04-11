function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}


// Center the hero card
function heroCardCenter(){
    heroHeight = $('#hero').height();
    boxHeight = $('#herocard').height();
    marginTop = (heroHeight - boxHeight) / 2;
    $('#herocard').css('margin-top', marginTop + 'px');
}
heroCardCenter();


// Typewrighter
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
    }
    function remove(){
        $('.typewrite').html(options[item].substring(textPos, 0) + '<span class="blink">\u25ae<span>');
        if (textPos -- != -1){
            setTimeout(remove, speedRemove);
        }else{
            item += 1;
            sleep(200);
            write();
        }
    }
    write();
}
typewrite();





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
        news = news + `
        <div class="col-12 col-md-3 text-center my-3 px-2">
            <div class="row px-2 py-3 m-3 article">
                <img class="newsImg" src="${img}">
                <h3 class="h4">${title}</h3>
                <cite class="small">${author}</cite><br>
                <cite class="small">${$.datepicker.formatDate('dd/mm/yy', new Date())}</cite><br>
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
        // $('.newsFullModal').each(function(){
        //     $(this).hide();
        //     console.log('h');
        // });
        // let h=0;
        // $('.article').each(function(){
        //     if ($(this).height() > h){
        //         h = $(this).height();
        //     }
        // });
        // $('.article').each(function(){
        // });
    });
});

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
    $.post(url, function(e){
        feedback = e;
    });
    $('.form-feedback').hide();
    $('#contact-form').hide('fade', {duration: 1000});
    $('#contact-form').promise().done(function(){
        $('.form-feedback').show('slide', {duration: 1500});
    })
});

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
