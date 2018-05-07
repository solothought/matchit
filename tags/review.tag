<review>
    <style>
        .cardframe{
            display: block;
            background-color: white;
            float: left;
            margin: 5px;
            border-radius: 5px;
            padding: 5px;
            position: relative;
        }
        .symbol{
            position: absolute;
            cursor: move;
        }
        .resizeHandle {
            width: 10px;
            height: 10px;
            background-color: #ffffff;
            border: 1px solid #000000;
            bottom: 1px;
            right:1px;
        }
        .ui-rotatable-handle{
            /* background: url("https://cdn.jsdelivr.net/jquery.ui.rotatable/1.0.1/rotate.png");
            background-repeat: no-repeat; */
            width: 10px;
            height: 10px;
            background-color: green;
            bottom: 1px;
            right:1px;
            border-radius: 5px;
            cursor: crosshair;
        }
    </style>

    <div class="input-bar clearfix row">
        <div class="left-paddle col-md-1" onclick={ slideleft }></div>
        <div class="photolist-wrapper col-md-10">
            <div each={card in cards} class="cardframe">
                <div each={ symbol in card} class="symbol trans">
                    <img  src={ readSymbol(symbol) }  width="75px" height="75px"  >
                    <div class="ui-resizable-handle resizeHandle"></div>
                </div>
            </div>
        </div>
        <div class="right-paddle col-md-1" onclick ={ slideright }></div>
    </div>
    <script>
        var groupIndex = [];
        this.on("mount",() => {
            $(".cardframe").width(this.frame.width);
            $(".cardframe").height(this.frame.height);


            $('.trans img').resizable({
                /* containment:  */
            });
            $('.symbol').draggable().rotatable();
        })
        this.frame = {
            width : $( "#demo-card" ).width(),
            height : $( "#demo-card" ).height()
        }

        var totalSymbols = totalCombinations($( "#symbolscount" ).val());
        this.cards = createBlocks($( "#symbolscount" ).val());
        console.log(this.cards);

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