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
                    if(this.symbols["gallery_0"].length === this.totalSymbols){
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
riot.tag2('gallery', '<label class="btn-bs-file btn btn-outline-info">Browse Image files <input type="file" class="filebutton" accept="image/*" onchange="{readImageFiles}" multiple> </label> <div class="input-bar clearfix row"> <div class="left-paddle col-md-1" onclick="{slideleft}"></div> <div class="photolist-wrapper col-md-10"> <div name="photolist" class="photolist"> <img riot-src="{src}" label="{name}" title="{name}" width="80px" each="{this.parent.symbols[this.opts.id]}"> </div> </div> <div class="right-paddle col-md-1" onclick="{slideright}"></div> </div>', '', '', function(opts) {
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
                }
                reader.readAsDataURL(f);
            }
        }.bind(this)

        this.sliding = false;
        this.sliderMove = "80px";
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
riot.tag2('review', '<div class="input-bar clearfix row"> <div class="left-paddle col-md-1" onclick="{slideleft}"></div> <div class="photolist-wrapper col-md-10"> <div each="{card in cards}" class="cardframe" width="{this.frame.width}" height="{this.frame.height}"> <img each="{symbol in card}" riot-src="{readSymbol(symbol)}" class="symbol" width="75px" height="75px"> </div> </div> <div class="right-paddle col-md-1" onclick="{slideright}"></div> </div>', 'review .cardframe,[data-is="review"] .cardframe{ display: block; background-color: white; } review .symbol,[data-is="review"] .symbol{ }', '', function(opts) {
        var groupIndex = [];
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