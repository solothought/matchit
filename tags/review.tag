<review>
    <style>
        .cardframe{
            display: block;
            background-color: white;
        }
        .symbol{

        }
    </style>

    <div class="input-bar clearfix row">
        <div class="left-paddle col-md-1" onclick={ slideleft }></div>
        <div class="photolist-wrapper col-md-10">
            <div each={card in cards} class="cardframe" width={ this.frame.width } height={ this.frame.height }>
                <img each={ symbol in card} src={ readSymbol(symbol) } class="symbol" width="75px" height="75px"  >
            </div>
        </div>
        <div class="right-paddle col-md-1" onclick ={ slideright }></div>
    </div>
    <script>
        var groupIndex = [];
        this.frame = {
            width : $( "#demo-card" ).width(),
            height : $( "#demo-card" ).height()
        }

        var totalSymbols = totalCombinations($( "#symbolscount" ).val());
        this.cards = createBlocks($( "#symbolscount" ).val());
        console.log(this.opts);

        readSymbol(n){
            if( Object.keys(this.opts.symbols).length === 1){
                return this.opts.symbols["gallery_0"][ n % this.opts.symbols["gallery_0"].length].src;
            }else{
                if(!groupIndex[n]) groupIndex[n] = 0;
                var index = groupIndex[n] % this.opts.symbols["gallery_"+n].length;
                groupIndex[n] = index +1;
                return this.opts.symbols["gallery_"+n][ index ].src;
            }
        }
        

        this.sliding = false;
        this.sliderMove = this.frame.width + "px";
        slideleft(e) {
            var photolist = $(e.target.nextElementSibling.children[0]);
            if (this.sliding === false) {
                this.sliding = true;
                photolist.css({ left: "-"+this.sliderMove })
                    .prepend(photolist.children('img:last-child'))
                    .animate({ left: 0 }, 200, 'linear', () => {
                        this.sliding = false;
                    });
            }
        };
        slideright(e) {
            var photolist = $(e.target.previousElementSibling.children[0]);
            if (this.sliding === false) {
                this.sliding = true;
                photolist.animate({ left: "-"+this.sliderMove }, 200, 'linear', () => {
                    photolist.css({ left: 0 })
                        .append(photolist.children('img:first-child'));
                    this.sliding = false;
                });
            }
        };
    </script>
</review>