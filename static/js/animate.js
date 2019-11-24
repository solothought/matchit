function rotatein(el){
    $(el).height(0).width(0).show();

    $(el).animate({
        height: '100px',
        width: '100px',
        deg: 360
    },{
        duration: 1000,
        step: function(now){
            el.css({
                 transform: "rotate(" + now + "deg)"
            });
        }
    });
}