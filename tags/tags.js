riot.tag2('decktemplate', '<div class="row align-items-center"> <div class="col-md-2"></div> <div class="col-md-2"> <select id="templateselect" class="form-control" onchange="{loadtemplate}"> <option disabled="true">Select template</option> <option value="normal" selected>3-250x350-match-it</option> <option value="pocker">Pocker Playing Card</option> <option value="domino">Domino Card</option> <option value="square">Square Card</option> </select> </div> <div class="col-md-2"> <label class="btn-bs-file btn btn-theme">Browse Template file <input type="file" class="filebutton" accept="application/vnd.nimn,*.nmn,*.nimn" onchange="{readTemplateFile}"> </label> </div> <div class="col-md-2"> <input id="exportTemplateName" type="text" class="form-control" placeholder="Enter the template name " riot-value="{exportTemplateName}"> </div> <div class="col-md-2"> <button class="btn btn-theme" onclick="{exportTemplate}">Export Template</button> </div> <div class="col-md-2"></div> </div> <div class="row warnmessage"> <div class="col-12">This template might not be suitable for selected card size.</div> </div>', '', '', function(opts) {

        this.loadtemplate = function(e){

            var templateName = e.target.value + ".nimn";
            $.ajax({
                url: "./templates/"+templateName,
                type: "GET",
                dataType: "json",
                contentType: "application/vnd.nimn; charset=utf-8",
                success: data => {
                    var templateData = JSON.parse(data);

                    this.parent.applyTemplate(templateData);
                }
            });
        }.bind(this)
        this.exportTemplateName = `${this.parent.frame.symbolsPerCard}-${this.parent.frame.width}x${this.parent.frame.height}-match-it.nimn`;
        this.readTemplateFile = function(f){

            var input = f.srcElement;
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = e => {
                    this.parent.applyTemplate(JSON.parse(e.target.result));
                }
                reader.onloadend = e => {
                    this.update();
                    reader = null;
                }
                reader.readAsText(input.files[0]);
            }
        }.bind(this)

        this.exportTemplate = function(e){
            var deck = {
                frame : this.parent.frame,
                cards: {}
            };
            $(".cardframe").each(function(fi){
                var totalWeight =0;
                var symbols = {
                    "1" : [],
                    "2" : []
                };

                $(this).find(".symbol").each( function(si){
                    var thumbnail = $(this).find("img")[0];
                    var height = $(thumbnail).height();
                    var width = $(thumbnail).width();
                    var weight = $(thumbnail).attr("weight");

                    symbols[weight].push({
                        top: $(this).position().top,
                        left: $(this).position().left,
                        height: height,
                        width: width,
                        transform: $(this).css("transform"),
                    });

                    totalWeight += Number.parseInt(weight);
                });
                if(!deck.cards[totalWeight]){
                    deck.cards[totalWeight] = [];
                }
                deck.cards[totalWeight].push(symbols);
            })

            var data = JSON.stringify(deck);
            var fileName = this.root.querySelector('#exportTemplateName').value;

            download( data, fileName ,"application/vnd.nimn");
        }.bind(this)
});
riot.tag2('galleries', '<p if="{this.opts.count == 1}">Upload {totalSymbols} images</p> <gallery each="{n,i in this.repeat}" id="gallery_{i}"></gallery> <div class="row"> <div class="col-lg-12 text-center"> <a class="btn btn-lg btn-theme" id="generate" onclick="{generate}" disabled="{!readyToGenerate}">Generate</a> </div> </div>', '', '', function(opts) {
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
riot.tag2('review', '<decktemplate></decktemplate> <div class="input-bar clearfix" style="width:100%"> <div class="photolist-wrapper" style="width:100%"> <div each="{card in cards}" class="cardframe" riot-style="background-color: {frame.bgColor}"> <div each="{symbol in card}" class="symbol trans" riot-style="{this.transformSize( readSymbol(symbol).size)} transform: rotate({this.transformRotate()}deg);" weight="{calculateWeight( readSymbol(symbol).size )}"> <img riot-src="{readSymbol(symbol,true).src}" height="100%" width="100%"> <div class="ui-resizable-handle resizeHandle"></div> </div> </div> </div> </div>', 'review .cardframe,[data-is="review"] .cardframe{ display: block; background-color: white; float: left; margin: 3px; border-radius: 5px; padding: 5px; position: relative; } review .symbol,[data-is="review"] .symbol{ position: absolute; cursor: move; } review .resizeHandle,[data-is="review"] .resizeHandle{ width: 10px; height: 10px; background-color: #ffffff; border: 1px solid #000000; bottom: 1px; right:1px; display: none; } review .ui-rotatable-handle,[data-is="review"] .ui-rotatable-handle{ width: 10px; height: 10px; background-color: green; bottom: 1px; right:1px; border-radius: 5px; cursor: crosshair; display: none; }', '', function(opts) {
        this.templates = [];
        this.on("mount",() => {
            $(".cardframe").width(this.frame.width);
            $(".cardframe").height(this.frame.height);

            $('.trans img').resizable({

            });
            $('.symbol').draggable().rotatable();

            $(".cardframe").each( function(i) {
                setRandomPos($(this).children());
            })

            $(".cardframe").mouseover( function(e) {
                $(this).find(".resizeHandle, .ui-rotatable-handle").show();
            });

            $(".cardframe").mouseout( function(e) {
                $(this).find(".resizeHandle, .ui-rotatable-handle").hide();
            });
        })

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

        this.transformRotate = function(){
            if(this.frame.rotateEnable){
                return randInRange(0,360);
            }
        }.bind(this)

        this.transformSize = function(originalSize){
            var ratio = 1;
            var w,h;
            var minW,maxW;
            if(this.frame.maintainratio  ){
                ratio = originalSize.height / originalSize.width;
                w = Math.floor ( Math.sqrt( this.frame.desiredSymbolSize / ratio ) ) * 0.6;
                w = w < 75 ? 75 : w;
            }else{
                w = Math.floor ( Math.sqrt( this.frame.desiredSymbolSize)) * 0.6;
                w = w < 75 ? 75 : w;
                h = w;
            }

            if(this.frame.resizeEnable){
                w = randInRange(65,w * 1.5);
            }
            if(h){
                return `width: ${w}px; height: ${h}px;`
            }else{
                h = w * ratio;
                return `width: ${w}px; height: ${h}px;`
            }
        }.bind(this)

        this.calculateWeight = function(size){
            if(size.height > size.width){
                if( size.height >= size.width * 1.5){
                    return 2;
                }else{
                    return 1;
                }
            }else{
                if( size.width >= size.height * 1.5){
                    return 2;
                }else{
                    return 1;
                }
            }
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

        this.applyTemplate = function(templateData){
            $(".cardframe").each( (card_i, card) => {
                var totalWeight = this.calculateTotalWeight(card);
                var weightSets = templateData.cards[totalWeight];
                var randomIndex = randInRange(0,weightSets.length -1);
                var symbols = $(card).find(".symbol");
                var weightWiseCounter = {
                    "1" : 0,
                    "2" : 0
                }
                var cardTemplate = weightSets[randomIndex];

                $(card).find(".symbol").each( (si, symbol) => {
                    var w = $(symbol).attr("weight");
                    $(symbol).css({
                        top: cardTemplate[w][ weightWiseCounter[w] ].top,
                        left: cardTemplate[w][ weightWiseCounter[w] ].left,
                        transform: cardTemplate[w][ weightWiseCounter[w] ].transform,
                    })
                    $(symbol).height(cardTemplate[w][ weightWiseCounter[w] ].height);
                    $(symbol).width(cardTemplate[w][ weightWiseCounter[w] ].width);
                    weightWiseCounter[w] +=1;
                } );

            });
        }.bind(this)

        this.calculateTotalWeight = function(el){
            var totalWeight = $(el).attr("totalweight");
            if( ! totalWeight ){
                totalWeight = 0;
                $(el).find(".symbol").each( (i,img) => {
                    totalWeight += Number.parseInt($(img).attr("weight"));
                });
                $(el).attr("totalweight", totalWeight);
                return totalWeight;
            }else{
                return totalWeight;
            }
        }.bind(this)

});