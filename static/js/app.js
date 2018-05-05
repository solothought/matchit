var cards = {
    pocker : {
        w : 250,
        h : 350
    },
    normal : {
        w : 225,
        h : 350
    },
    domino : {
        w : 125,
        h : 350
    },
    square : {
        w : 250,
        h : 250
    }
};

function updateSlider(size){
    $( "#slider-vertical-val" ).text((size.h)/100 + '"' );
    $( "#slider-horizontal-val" ).text(size.w/100 + '"' );
    $( "#slider-vertical" ).slider( "value", 450 - size.h);
    $( "#slider-horizontal" ).slider( "value", size.w);
}

function setupSlider(size){
    $( "#slider-vertical" ).slider({
        orientation: "vertical",
        /* range: "min", */
        min: 0,
        max: 450,
        value: 450 - size.h,
        slide: function( event, ui ) {
            $( "#demo-card" ).height(450 - ui.value);
            $( "#slider-vertical-val" ).text((450 - ui.value)/100 + '"' );
        }
    });

    $( "#slider-horizontal" ).slider({
        /* range: "min", */
        min: 0,
        max: 450,
        value: size.w,
        slide: function( event, ui ) {
            $( "#demo-card" ).width(ui.value);
            $( "#slider-horizontal-val" ).text(ui.value/100 + '"' );
        }
    });
}

/* function setSymbolsCount(n,m){
    $('#symbolscount').children('option:not(:first)').remove();//empty
    for(;n<m;n++){
        $("#symbolscount").append("<option value='"+ n +"'>" + n + "</option>")
    }
} */

var minSize = {
    w : 75,
    h : 75
}
function checkSymbolCount(){
    console.log("hi");
    var w = $( "#slider-horizontal" ).slider("value");
    var h = 450 - $("#slider-vertical" ).slider("value");

    var maxCount = Math.floor( h / minSize.h ) * Math.floor(w / minSize.w);

    if( $('#symbolscount').val() > maxCount ){
        alert("Number of symbols for given size should not be greater than " + maxCount);
    }

}

function updateDemoCard(size){
    $( "#demo-card" ).height(size.h);
    $( "#demo-card" ).width(size.w);
}