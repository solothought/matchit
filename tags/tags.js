riot.tag2('galleries', '<p if="{this.opts.count == 1}">Upload {totalSymbols} images</p> <gallery each="{n,i in this.repeat}" id="gallery_{i}"></gallery> <div class="row"> <div class="col-lg-12 text-center"> <button id="generate" onclick="{generate}" disabled="{!readyToGenerate}">Generate</button> </div> </div>', '', '', function(opts) {
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
riot.tag2('gallery', '<label class="btn-bs-file btn btn-outline-info">Browse Image files <input type="file" class="filebutton" accept="image/*" onchange="{readImageFiles}" multiple> </label> <div class="input-bar clearfix"> <div class="photolist-wrapper"> <div name="photolist" class="photolist"> <div each="{this.parent.symbols[this.opts.id]}" class="imgbox clearfix"> <div class="delete" onclick="{deleteThumbnail}"></div> <img riot-src="{src}" label="{name}" title="{name}" width="80px"> </div> </div> </div> </div>', 'gallery .delete,[data-is="gallery"] .delete{ background: url("static/img/delete.svg") no-repeat; width:15px; height: 15px; float: left; position: absolute; cursor: pointer; } gallery .imgbox,[data-is="gallery"] .imgbox{ float: left; position: relative; }', '', function(opts) {
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
riot.tag2('review', '<div class="card-frame-navigators"> <div class="left-paddle " onclick="{slideleft}" style="float:left"></div> <div class="right-paddle " onclick="{slideright}" style="float:right"></div> </div> <div class="input-bar clearfix" style="width:100%"> <div class="photolist-wrapper" style="width:100%"> <div each="{card in cards}" class="cardframe"> <div each="{symbol in card}" class="symbol trans"> <img riot-src="{readSymbol(symbol)}" width="75px" height="75px"> <div class="ui-resizable-handle resizeHandle"></div> </div> </div> </div> </div>', 'review .cardframe,[data-is="review"] .cardframe{ display: block; background-color: white; float: left; margin: 3px; border-radius: 5px; padding: 5px; position: relative; } review .symbol,[data-is="review"] .symbol{ position: absolute; cursor: move; } review .resizeHandle,[data-is="review"] .resizeHandle{ width: 10px; height: 10px; background-color: #ffffff; border: 1px solid #000000; bottom: 1px; right:1px; display: none; } review .ui-rotatable-handle,[data-is="review"] .ui-rotatable-handle{ width: 10px; height: 10px; background-color: green; bottom: 1px; right:1px; border-radius: 5px; cursor: crosshair; display: none; } review .card-frame-navigators,[data-is="review"] .card-frame-navigators{ display: block; width: 100%; height: 35px; } review .card-frame-navigators div,[data-is="review"] .card-frame-navigators div{ height: 100% }', '', function(opts) {
        var groupIndex = [];
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
            height : $( "#demo-card" ).height()
        }

        var totalSymbols = totalCombinations($( "#symbolscount" ).val());
        this.cards = createBlocks($( "#symbolscount" ).val());
        console.log(this.cards);

        this.readSymbol = function(n){
            if( Object.keys(this.opts.symbols).length === 1){
                return this.opts.symbols["gallery_0"][ n % this.opts.symbols["gallery_0"].length].src;
            }else{
                if(!groupIndex[n]) groupIndex[n] = 0;
                var index = groupIndex[n] % this.opts.symbols["gallery_"+n].length;
                groupIndex[n] = index +1;
                return this.opts.symbols["gallery_"+n][ index ].src;
            }
        }.bind(this)

        this.sliding = false;
        this.sliderMove = this.frame.width + "px";
        this.slideleft = function(e) {
            var photolist = $(e.target.nextElementSibling.children[0]);
            if (this.sliding === false) {
                this.sliding = true;
                photolist.css({ left: "-"+this.sliderMove })
                    .prepend(photolist.children('img:last-child'))
                    .animate({ left: 0 }, 200, 'linear', () => {
                        this.sliding = false;
                    });
            }
        }.bind(this);
        this.slideright = function(e) {
            var photolist = $(e.target.previousElementSibling.children[0]);
            if (this.sliding === false) {
                this.sliding = true;
                photolist.animate({ left: "-"+this.sliderMove }, 200, 'linear', () => {
                    photolist.css({ left: 0 })
                        .append(photolist.children('img:first-child'));
                    this.sliding = false;
                });
            }
        }.bind(this);

});