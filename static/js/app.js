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

/*

Poker size (63mm x 88mm, 2.5" x 3.5")
Bridge size (56mm x 88mm, 2.25" x 3.5")
Large size cards (89mm x 146mm, 3.5" x 5.75")
Tarot size cards (70mm x 121mm, 2.75" x 4.75")
Mini size cards (44.45mm x 63.5mm, 1.75" x 2.5")
Micro size cards (32mm x 45mm, 1.25" x 1.75")
Domino size cards (44mm x 89mm, 1.75" x 3.5")
Business size cards (50mm x 89mm, 2" x 3.5")
Small square size cards (50mm x 50mm, 2" x 2")
Square size cards (89mm x 89mm, 3.5" x 3.5")
Circle size cards (89mm x 89mm, 3.5" x 3.5")
Hex size cards (89mm x 89mm, 3.5" x 3.5")
Trump size cards (62mm x 100mm, 2.45" x 3.95")
*/

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

var minSymbolSize = {
    w : 75,
    h : 75
}
function checkSymbolCount(){
    var w = $( "#slider-horizontal" ).slider("value");
    var h = 450 - $("#slider-vertical" ).slider("value");

    var maxCount = Math.floor( h / minSymbolSize.h ) * Math.floor(w / minSymbolSize.w);

    if( $('#symbolscount').val() > maxCount ){
        alert("Number of symbols for given size should not be greater than " + maxCount);
    }

}

function updateDemoCard(size){
    $( "#demo-card" ).height(size.h);
    $( "#demo-card" ).width(size.w);
}



function setRandomPos(elements){
    var boxDims = new Array();
    elements.each(function(){
        var conflict = true;
        
        for (var maxcounter =  0; maxcounter < 15 && conflict; maxcounter++) {
            fixLeft = Math.round(Math.random()*($(this).parent().width() - $(this).width() ));
            fixTop = Math.round(Math.random()*($(this).parent().height() - $(this).height() ));
            $(this).css({
                left: fixLeft,
                top: fixTop
            });

            //if(outOfParent($(this)) ) continue;

            var box = {
                top: parseInt($(this).position().top),
                left: parseInt($(this).position().left),
                width: parseInt($(this).width()),
                height: parseInt($(this).height())
            }
            conflict = false;
            for (var i=0;i<boxDims.length;i++) {
                if (rectOverlap(box,boxDims[i])) {
                    conflict = true;
                    break;
                } else {
                    conflict = false;
                }                   
            }
        }
        boxDims.push(box)

    });
}

/* function outOfParent(element){
    if ( ( element.position().left + element.width() ) > element.parent().width()
        || ( element.position().top + element.height() ) > element.parent().height() )
        return true;
    else    
        return false;
} */

function valueInRange(value, min, max){
        return (value >= min) && (value <= max); 
}

function rectOverlap(A, B){
    var xOverlap = valueInRange(A.left, B.left, B.left + B.width) ||
                    valueInRange(B.left, A.left, A.left + A.width);

    var yOverlap = valueInRange(A.top, B.top, B.top + B.height) ||
                    valueInRange(B.top, A.top, A.top + A.height);

    return xOverlap && yOverlap;
}

function download(data, filename, type) {
    var blobData = new Blob([data], {type: type + ";charset=utf-8"})
    saveAs(blobData, filename);
}
        