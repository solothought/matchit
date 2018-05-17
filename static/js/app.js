

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

function round(number, precision) {
    var shift = function (number, precision) {
      var numArray = ("" + number).split("e");
      return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + precision) : precision));
    };
    return shift(Math.round(shift(number, +precision)), -precision);
}

function randInRange(min,max) {return Math.floor(Math.random()*(max-min)) + min}

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

function rotateSymbolsRandomly(elements){
    elements.each(function(){
        $(this).css({'transform' : 'rotate('+ randInRange(0,360) +'deg)'});
    });
}

/**
 * 
 * @param {*} elements 
 * @param {boolean} maintainRatio 
 * @param {*} desiredSize : desired size whould be bigger for big cards, small for small cards
 */
function resizeSymbolsRandomly(elements, maintainRatio, desiredSize){
    elements.each(function(){
        var originalSize = {
            width : $(this).attr("w"),
            height : $(this).attr("h")
        }
        var size = transformSize(originalSize,true,maintainRatio, desiredSize);
        //$(this).width(size.width).height(size.height);
        $(this).css({width: size.width, height : size.height });
        $(this).find(".ui-wrapper").css({width: size.width, height : size.height });
        $(this).find(".ui-wrapper img").css({width: size.width, height : size.height });
    });
}
/* 
calculate new width and height for a symbol on the basis of original size. 
Maintains ratio if selected
*/
function transformSize(originalSize, randomEnable , maintainratio, desiredSymbolSize ){
    var ratio = 1;
    var w,h;
    var minW,maxW;
    if(maintainratio){//set only width
        ratio = originalSize.height / originalSize.width;
        w = Math.floor ( Math.sqrt( desiredSymbolSize / ratio ) ) * 0.6;
        w = w < 75 ? 75 : w;
    }else{
        w = Math.floor ( Math.sqrt( desiredSymbolSize)) * 0.6;
        w = w < 75 ? 75 : w;
        h = w;
    }

    if(randomEnable){
        w = randInRange(65,w * 1.5);
    }
    if(h){
        //return `width: ${w}px; height: ${h}px;`
        return {width: w, height: h};
    }else{
        h = w * ratio;
        return {width: w, height: h};
    }
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
        