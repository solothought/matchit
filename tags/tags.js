riot.tag2('decktemplate', '<div id="action-bar" class="row align-items-center"> <div class="col form-inline"> <i class="fa fa-repeat action-btn btn btn-info" title="Arrange Randomly" onclick="{rotateRandomly}"></i> <div class="input-group"> <div class="form-check"> <input class="form-check-input" type="checkbox" value="" id="resize-action" checked> <label class="form-check-label" for="resize-action"> Maintain height-width ratio </label> </div> <span class="fa-stack fa-lg action-btn btn btn-info" title="Resize Randomly" style="font-size: 1.2em;" onclick="{resizeRandomly}"> <i class="fa fa-square-o fa-stack-2x" style="top: -0.5px;"></i> <i class="fa fa-arrows-h fa-stack-1x" style="top: -0.5px;"></i> </span> </div> <i class="fa fa-random action-btn btn btn-info" title="Arrange Randomly" onclick="{arrangeRandomly}"></i> <i class="fa fa-copy action-btn btn btn-info" title="Copy Pattern" onclick="{copy}"></i> <i class="fa fa-paste action-btn btn btn-info" title="Paste Pattern" onclick="{paste}"></i> <label class="btn-bs-file"> <i class="fa fa-folder-open-o action-btn btn btn-info" title="Open Pattern file" onclick="{this.parent.arrangeRandomly}"></i> <input id="file-input" type="file" class="filebutton" accept="application/vnd.nimn,*.nmn,*.nimn" onchange="{readTemplateFile}"> </label> <div class="form-inline input-group"> <input id="exportTemplateName" type="text" class="form-control" placeholder="Enter the template name " riot-value="{exportTemplateName}" style="width: 300px;"> <i class="fa fa-save action-btn btn btn-info" title="Save Pattern to external file" onclick="{exportTemplate}"></i> </div> </div> </div> </div>', '', '', function(opts) {

        this.selectCards = function(cb,...arg){
            var elArr = $(".cf-selected");

            if(elArr.length === 0){
                elArr = $(".cardframe");
            }
            elArr.each( function(i) {
                cb($(this).find(".symbol"), ...arg);
            })
        }.bind(this)

        this.arrangeRandomly = function(){
            this.selectCards(setRandomPos);
        }.bind(this)

        this.rotateRandomly = function(){
            this.selectCards(rotateSymbolsRandomly);
        }.bind(this)

        this.resizeRandomly = function(){
            var maintainRatio = $("#resize-action").prop("checked");
            this.selectCards(resizeSymbolsRandomly, true, maintainRatio, this.parent.frame.desiredSymbolSize);
        }.bind(this)

        var clipboard = null;

        this.copy = function(e){
            var selected = $(".cf-selected");
            if(e.shiftKey){

                clipboard = {};
                selected.each((i,cardEl) =>{
                    var result = this.extractPatternDataWithWeight(cardEl);
                    if( !clipboard[result.weight] ){
                        clipboard[result.weight] = [];
                    }
                    clipboard[result.weight].push( result.pattern );
                });
            }else{
                if(selected.length > 1 || selected.length === 0 ){
                    alert("Please select only 1 card.");
                }else{
                    clipboard = this.extractPatternData(selected);
                }
            }
        }.bind(this)

        this.paste = function(){
            var selected = $(".cf-selected");
            if(clipboard === null || selected.length === 0) return;

            if( Array.isArray(clipboard) ){
                selected.each((i,cardEl) =>{
                    this.applyPatternData( clipboard , cardEl);
                });
            }else{
                selected.each((i,cardEl) =>{
                    this.applyPatternDataWithWeight(clipboard,cardEl);
                });
            }

        }.bind(this)

        this.extractPatternData = function(cardEl){
            var symbols = [];
            $(cardEl).find(".symbol").each( (si,symbol) => {
                symbols.push( this.copyStyle(symbol) );
            });
            return symbols;
        }.bind(this)

        this.applyPatternData = function(data,cardEl){
            $(cardEl).find(".symbol").each( (si,symbol) => {
                this.applyStyle(data[si],symbol);
            });
        }.bind(this)

        this.extractPatternDataFromMultipleCards = function(cardsEl){
            var cards = [];
            $(cardsEl).each( (card_i, card) => {
                cards.push( this.extractPatternData(card) );
            });
        }.bind(this)

        this.applyPatternDataOnMultipleCards = function(data,cardsEl){
            $(cardsEl).each( (card_i, card) => {
                this.applyPatternData(data[card_i], card);
            });
        }.bind(this)

        this.extractPatternDataWithWeight = function(cardEl){
            var totalWeight =0;
            var symbols = {
                "1" : [],
                "2" : []
            };

            $(cardEl).find(".symbol").each( (si,symbol) => {
                var weight = $(symbol).attr("weight");
                symbols[weight].push( this.copyStyle(symbol) );
                totalWeight += Number.parseInt(weight);
            });

            return { weight: totalWeight, pattern: symbols};
        }.bind(this)

        this.applyPatternDataWithWeight = function(data,cardEl){
            var weightSets = data[ $(cardEl).attr("totalweight") ];
            if(!weightSets){
                showSnackBar("Selected card has different size of images");
                return;
            }
            var patternSet = weightSets[ randInRange(0,weightSets.length -1) ];

            var weightWiseCounter = {
                "1" : 0,
                "2" : 0
            }
            $(cardEl).find(".symbol").each( (si, symbol) => {
                var w = $(symbol).attr("weight");
                var index = weightWiseCounter[w];
                this.applyStyle( patternSet[ w ][ index ], symbol, true);
                weightWiseCounter[w] +=1;
            } );
        }.bind(this)

        this.applyPatternsToCards = function(data){
            $(".cardframe").each( (card_i, cardEl) => {
                this.applyPatternDataWithWeight(data,cardEl);
            });
        }.bind(this)

        this.copyStyle = function(el){
            return {
                top: $(el).position().top,
                left: $(el).position().left,
                height: $(el).height(),
                width: $(el).width(),
                transform: $(el).css("transform"),
            }
        }.bind(this)

        this.applyStyle = function(source,target,checkWeight){
            $(target).css({
                top: source.top,
                left: source.left,
                transform: source.transform,
            });
            if(checkWeight){
                var sourceWeight = calculateWeight(source);

                var targetWeight = calculateWeight({
                    height : $(target).attr("h"),
                    width : $(target).attr("w")
                })
                if( sourceWeight !== targetWeight ){
                    rotate(target, 90);
                }
            }
            resizeSymbol($(target), source);
        }.bind(this)

        this.exportTemplateName = `${this.parent.frame.symbolsPerCard}-${this.parent.frame.width}x${this.parent.frame.height}-match-it`;
        this.readTemplateFile = function(f){
            var input = f.srcElement;
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = e => {

                    var data = nimnInstance.decode(e.target.result)
                    this.applyPatternsToCards(data.cards);
                }
                reader.onloadend = e => {
                    this.update();
                    reader = null;
                }
                reader.readAsText(input.files[0]);
            }
        }.bind(this)

        this.exportTemplate = function(e){

            if(!$('#exportTemplateName').val()){
                showSnackBar("Oh! You've deleted template name");
                return;
            }

            var elArr = $(".cf-selected");

            if(elArr.length === 0){
                elArr = $(".cardframe");
            }

            var deck = {
                frame : this.parent.frame,
                cards: {}
            };
            $(elArr).each((fi,cardEl) => {
                var result = this.extractPatternDataWithWeight(cardEl);
                if( !deck.cards[result.weight] ){
                    deck.cards[result.weight] = [];
                }
                deck.cards[result.weight].push(result.pattern);
            })

            var data = nimnInstance.encode(deck);
            var fileName = $('#exportTemplateName').val() + ".nimn";

            download( data, fileName ,"application/vnd.nimn");
        }.bind(this)

        function showSnackBar(msg) {

            $("#snackbar").text(msg);
            $("#snackbar").addClass("show");

            setTimeout(function(){ $("#snackbar").removeClass("show"); $("#snackbar").text("");}, 3000);
        }

        this.on("mount",() => {
          window.addEventListener("keypress", (press) => {
            switch(press.key) {
              case "r":
                this.selectCards(rotateSymbolsRandomly);
                break;
              case "R":
                this.resizeRandomly();
                break;
              case "a":
                this.selectCards(setRandomPos);
                break;
              case "c":
                this.copy(e);
                break;
              case "C":
                this.copy(e)
                break;
              case "v":
                this.paste();
                break;
              case "o":
                $('#file-input').trigger('click');
                break;
              case "s":
                this.exportTemplate(e);
                break;
            }
          });
        });

});

riot.tag2('design', '<div class="row"> <div class="col-md-4"> <select id="cardsize" class="form-control" onchange="{changeDemoCardSize}"> <option disabled="true">Select Size</option> <option each="{cardsize,name in cards}" riot-value="{name}" selected="{name == \'Normal Playing Card Or Bridge Size\'}">{name}</option> </select> <div class="empty"></div> <select id="symbolscount" onchange="{checkSymbolCount}" class="form-control"> <option selected="false" disabled="true">Number of symbols on a card</option> <option>2</option> <option>3</option> <option>4</option> <option>5</option> <option>6</option> <option>7</option> <option>8</option> <option>9</option> <option>10</option> </select> <div class="empty"></div> <div>Choose background color</div> <input id="colorpicker" onchange="{changeBgColor}" value="#ffffff" style="width:100%;" type="color"> <div class="empty"></div> <div class="form-check"> <input class="form-check-input" type="checkbox" value="" id="rotate" checked="true"> <label class="form-check-label" for="rotate"> Rotate randomly </label> </div> <div class="form-check"> <input class="form-check-input" type="checkbox" value="" id="resize" checked="true"> <label class="form-check-label" for="resize"> Resize randmly </label> </div> <div class="form-check"> <input class="form-check-input" type="checkbox" value="" id="maintainratio" checked="true"> <label class="form-check-label" for="maintainratio"> Maintain height width ratio </label> </div> </div> <div class="col-md-8"> <div id="slider-horizontal-val" class="text-center" style="width:160mm;"></div> <div id="slider-horizontal"></div> <div id="demo-card-container"> <div style="float:left; width:160mm; height:160mm;"> <div id="demo-card"> </div> </div> <div id="slider-vertical" style="float:left"></div> <div id="slider-vertical-val" style="float:left"></div> </div> </div> </div>', 'design .ui-slider .ui-slider-handle,[data-is="design"] .ui-slider .ui-slider-handle{ width: 0.8em; height: 0.8em; } design #slider-vertical,[data-is="design"] #slider-vertical{ height: 150mm; width: 5px; } design #slider-horizontal,[data-is="design"] #slider-horizontal{ width: 150mm; height: 5px; } design #demo-card,[data-is="design"] #demo-card{ display: block; outline: 1px solid grey; margin-top: 10px; } design #demo-card-container,[data-is="design"] #demo-card-container{ height: 160mm; } design #slider-vertical-val,[data-is="design"] #slider-vertical-val{ writing-mode: tb-rl; height: 100%; text-align: center; }', '', function(opts) {

        this.cards = {
            "Normal Playing Card Or Bridge Size" : {
                w : 56,
                h : 88,
            },
            "Pocker Card" : {
                w : 63,
                h : 88,
            },
            "Large size Card" : {
                w : 89,
                h : 146,
            },
            "Tarot size Card" : {
                w : 70,
                h : 121,
            },
            "Half width Card" : {
                w : 28,
                h : 88,
            },
            "Domino Card" : {
                w : 44,
                h : 89,
            },
            "Business size Card" : {
                w : 50,
                h : 89,
            },
            "Square Card" : {
                w : 63,
                h : 63,
            },
        };

        this.on('mount', () => {

            this.setupSlider(this.cards["Normal Playing Card Or Bridge Size"]);
            this.updateSlider(this.cards["Normal Playing Card Or Bridge Size"]);
            this.updateDemoCard(this.cards["Normal Playing Card Or Bridge Size"]);
            $( "#symbolscount" ).val("3")
        });

        this.changeBgColor = function(e){
            $("#demo-card").css("background-color", e.target.value);
        }.bind(this)

        this.changeDemoCardSize = function(e){
            this.updateSlider(this.cards[$( "#cardsize" ).val()]);
            this.updateDemoCard(this.cards[$( "#cardsize" ).val()]);
        }.bind(this)

        this.updateDemoCard = function(size){
            $( "#demo-card" ).height(size.h + "mm");
            $( "#demo-card" ).width(size.w + "mm");
        }.bind(this)

        var one_cm = 37.7952755906;
        var one_inch = 0.0393701;
        var maxCardSize = 150;

        this.updateSlider = function(size){
            $( "#slider-vertical-val" ).text(convertIntoText(size.h));
            $( "#slider-horizontal-val" ).text(convertIntoText(size.w));
            $( "#slider-vertical" ).slider( "value", maxCardSize - size.h);
            $( "#slider-horizontal" ).slider( "value", size.w);
        }.bind(this)

        this.setupSlider = function(size){
            $( "#slider-vertical" ).slider({
                orientation: "vertical",

                min: 0,
                max: maxCardSize,
                value: maxCardSize - size.h,
                slide: function( event, ui ) {
                    $( "#demo-card" ).height((maxCardSize - ui.value) + "mm");
                    $( "#slider-vertical-val" ).text( convertIntoText(maxCardSize - ui.value) );
                }
            });

            $( "#slider-horizontal" ).slider({

                min: 0,
                max: maxCardSize,
                value: size.w,
                slide: function( event, ui ) {
                    $( "#demo-card" ).width(ui.value + "mm");
                    $( "#slider-horizontal-val" ).text( convertIntoText(ui.value) );
                }
            });
        }.bind(this)

        function convertIntoText(unit){

            return unit + 'mm or ' + round(unit * one_inch,2) + '"';
        }

        this.checkSymbolCount = function(){
            var w = $( "#slider-horizontal" ).slider("value");
            var h = maxCardSize - $("#slider-vertical" ).slider("value");

            var maxCount = Math.floor( h / minSymbolSize.h ) * Math.floor(w / minSymbolSize.w);

            if( $('#symbolscount').val() > maxCount ){
                alert("Number of symbols for given size should not be greater than " + maxCount);
            }

        }.bind(this)

});
riot.tag2('galleries', '<section id="showcase"> <div class="container-fluid"> <div class="row"> <div class="col-lg-12 text-center"> <h2>Symbols</h2> </div> </div> <p if="{this.opts.count == 1}">Upload {totalSymbols} images</p> <gallery each="{n,i in this.repeat}" id="gallery_{i}"></gallery> <div class="row"> <div class="col-lg-12 text-center"> <button class="btn btn-lg btn-theme" id="generate" onclick="{generate}" disabled="{!readyToGenerate}">Generate</button> </div> </div> </div> </section>', '', '', function(opts) {
        this.readyToGenerate = false;
        this.repeat = new Array(this.opts.count);
        this.totalSymbols = totalCombinations($( "#symbolscount" ).val());
        this.symbols = {};
        this.generate = function(){
            riot.mount("review", {symbols: this.symbols});
        }.bind(this)
        this.on("uploadimages",() => {
            if(Object.keys(this.symbols).length === this.opts.count){
                if(this.opts.count === 1){
                    if(this.symbols["gallery_0"].length >= this.totalSymbols){
                        this.readyToGenerate = true;
                        this.update();
                    }
                }else{
                    this.readyToGenerate = true;
                    this.update();
                }
            }
        });
});
riot.tag2('gallery', '<label class="btn-bs-file btn btn-outline-info">Browse Image files <input type="file" class="filebutton" accept="image/*" onchange="{readImageFiles}" multiple> </label> <div class="input-bar clearfix"> <div class="photolist-wrapper masorny"> <div name="photolist" class="photolist"> <div each="{this.parent.symbols[this.opts.id]}" class="imgbox clearfix"> <div class="delete" onclick="{deleteThumbnail}"></div> <img riot-src="{src}" label="{name}" title="{name}" class="thumbnail"> </div> </div> </div> </div>', 'gallery .delete,[data-is="gallery"] .delete{ background: url("static/img/delete.svg") no-repeat; width:15px; height: 15px; float: left; position: absolute; cursor: pointer; } gallery .imgbox,[data-is="gallery"] .imgbox{ float: left; position: relative; }', '', function(opts) {
        this.readImageFiles = function(e) {
            var input = e.srcElement;
            if (input.files && input.files[0]) {
                for(i=0;i<input.files.length;i++){
                    this.readImageFile(input.files[i]);
                }
            }
        }.bind(this)
        this.parent.symbols[this.opts.id] = [];

        this.readImageFile = function(f) {
            data = this.parent.symbols[this.opts.id];
            if(f.type.startsWith("image")){
                var reader = new FileReader();
                reader.onload = e => {
                    var imgData = {
                        name : f.name,
                        src: e.target.result
                    };
                    this.updateDimentions(e.target.result,imgData);
                    data.push(imgData);
                    this.parent.trigger("uploadimages");
                }
                reader.onloadend = e => {
                    this.update();
                    reader = null;
                }
                reader.readAsDataURL(f);
            }
        }.bind(this)

        this.updateDimentions = function(imgFileSrc, imageDataObject){
            var img = new Image();
            img.onload = function() {
                imageDataObject.size = {
                    width : this.width,
                    height : this.height
                }
            };
            img.src = imgFileSrc;
        }.bind(this)

        this.deleteThumbnail = function(e){
            var thumbnail = $(e.target.nextElementSibling);
            for(var thumbnail_i in this.parent.symbols[this.opts.id]){
                if(this.parent.symbols[this.opts.id][thumbnail_i].name === $(thumbnail[0]).attr("title")){
                    this.parent.symbols[this.opts.id].splice(thumbnail_i,1);
                    break;
                }
            }

            this.update();
        }.bind(this)
});
riot.tag2('review', '<section id="showcase" style="background-color: #2C3E50;color: white"> <div class="container"> <div class="row"> <div class="col-lg-12 text-center"> <h2>Review</h2> </div> </div> </div> <div class="empty"></div> <decktemplate></decktemplate> <div id="review-panel" class="input-bar clearfix" style="width:100%"> <div class="photolist-wrapper" style="width:100%"> <div each="{card in cards}" class="cardframe" onclick="{select}" riot-style="background-color: {frame.bgColor}"> <div class="align-center" style="writing-mode: tb-rl; height: 100%; text-align:center; font-size: small; color: #ced0d2;">funcards.github.io/match-it</div> <div each="{symbol in card}" class="symbol trans" h="{readSymbol(symbol).size.height}" w="{readSymbol(symbol).size.width}" weight="{Math.abs(calculateWeight( readSymbol(symbol).size ))}"> <img riot-src="{readSymbol(symbol,true).src}"> </div> </div> <div id="snackbar"></div> </div> </div> </section>', 'review .cardframe,[data-is="review"] .cardframe{ display: block; background-color: white; float: left; margin: 3px; border-radius: 5px; padding: 5px; position: relative; } review .symbol,[data-is="review"] .symbol{ position: absolute; cursor: move; } review .ui-resizable-handle,[data-is="review"] .ui-resizable-handle{ display: none; } review .ui-rotatable-handle,[data-is="review"] .ui-rotatable-handle{ width: 10px; height: 10px; background-color: green; bottom: 1px; right:1px; border-radius: 5px; cursor: crosshair; display: none; } review .cf-selected,[data-is="review"] .cf-selected{ outline: 4px solid yellow; }', '', function(opts) {
        this.templates = [];
        this.frame = {
            width : $( "#demo-card" ).width(),
            height : $( "#demo-card" ).height(),
            symbolsPerCard: $( "#symbolscount" ).val(),
            bgColor: $( "#demo-card" ).css("background-color"),
            rotateEnable: $( "#rotate" ).prop("checked"),
            resizeEnable: $( "#resize" ).prop("checked"),
            maintainratio: $( "#maintainratio" ).prop("checked"),

        }

        this.frame.desiredSymbolSize = Math.floor ( ( (this.frame.width * this.frame.height) / this.frame.symbolsPerCard ) * 0.9 );

        this.on("mount",() => {

            var gametype = `${this.frame.symbolsPerCard}-${this.frame.width}x${this.frame.height}`;
            ga('send', 'event', 'cards', 'generate', gametype);
            $(".cardframe").width(this.frame.width);
            $(".cardframe").height(this.frame.height);

            $('.trans img').resizable({

            });
            $('.symbol').draggable().rotatable();
            $(".ui-resizable-handle").hide();
            $(".cardframe").mouseover( function(e) {
                $(this).find(".resizeHandle, .ui-rotatable-handle, .ui-resizable-handle").show();
            });

            $(".cardframe").mouseout( function(e) {
                $(this).find(".resizeHandle, .ui-rotatable-handle, .ui-resizable-handle").hide();
            });

            $(".cardframe").each( (i,el) => {
                resizeSymbolsRandomly($(el).find(".symbol"), this.frame.resizeEnable, this.frame.maintainratio, this.frame.desiredSymbolSize);
                if(this.frame.rotateEnable){
                    rotateSymbolsRandomly($(el).find(".symbol"));
                }
                setRandomPos($(el).find(".symbol"));
                this.updateTotalWeight(el);
            })

            $("#action-bar").click((e) =>{
                e.stopPropagation();
            });
            $(document).click((e) =>{
                if( $(e.target).hasClass("cf-selected") || $(e.target).hasClass("action-btn")){

                }else{
                    $(".cf-selected").removeClass("cf-selected");
                }
            })

            $.confirm({
                draggable: false,
                title: 'Term & Consition',
                content: '<p>The purpose of this application is to give you the freedom to design your own game for personal use.'
                + ' Cards generated by this application shall not be used for commercial purpose.</p>'
                + '<p> <a href="https://github.com/funcards/match-it/issues">Contact us</a> for any clarification.',
                buttons: {
                    confirm: {
                        text: 'Accept',
                        keys: ['enter']
                    }
                }
            });

        })

        this.select = function(e){
            if (event.ctrlKey && $(e.target).hasClass("cardframe") ) {
                this.toggleSelect(e.target);
            }else if( $(e.target).hasClass("cardframe")) {
                $(".cf-selected").removeClass("cf-selected");
                $(e.target).addClass("cf-selected");
            }
                e.stopPropagation();
        }.bind(this)

        this.toggleSelect = function(element){
            if($(element).hasClass("cf-selected")){
                $(element).removeClass("cf-selected");
            }else{
                $(element).addClass("cf-selected");
            }
        }.bind(this)

        this.updateTotalWeight = function(el){
            totalWeight = 0;
            $(el).find(".symbol").each( (i,img) => {
                totalWeight += Number.parseInt($(img).attr("weight"));
            });
            $(el).attr("totalweight", totalWeight);
        }.bind(this)

        this.totalSymbols = totalCombinations($( "#symbolscount" ).val());
        this.cards = createBlocks($( "#symbolscount" ).val());

        var groupIndex = [];

        this.readSymbol = function(n,readNext){
            if( Object.keys(this.opts.symbols).length === 1){
                return this.opts.symbols["gallery_0"][ n % this.opts.symbols["gallery_0"].length];
            }else{
                if(!groupIndex[n]) groupIndex[n] = 0;
                var index = 0;
                if(readNext){
                    index = groupIndex[n] % this.opts.symbols["gallery_"+n].length;
                    groupIndex[n] = index +1;
                }else{
                    index = groupIndex[n]
                }
                return this.opts.symbols["gallery_"+n][ index ];
            }
        }.bind(this)

});
