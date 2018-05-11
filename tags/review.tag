<review>
    <style>
        .cardframe{
            display: block;
            background-color: white;
            float: left;
            margin: 3px;
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
            display: none;
        }
        .ui-rotatable-handle{
            width: 10px;
            height: 10px;
            background-color: green;
            bottom: 1px;
            right:1px;
            border-radius: 5px;
            cursor: crosshair;
            display: none;
        }
        .card-frame-navigators{
            display: block;
            width: 100%;
            height: 35px;
        }
        .card-frame-navigators div{
            height: 100%
        }
    </style>

<div class="card-frame-navigators">
    <div class="left-paddle " onclick={ slideleft } style="float:left"></div>
    <div class="right-paddle " onclick ={ slideright }  style="float:right"></div>
</div>
    <div class="input-bar clearfix" style="width:100%">
        <div class="photolist-wrapper" style="width:100%">
            <div each={card in cards} class="cardframe" style="background-color: { frame.bgColor }">
                <div each={ symbol in card} class="symbol trans">
                    <img  src={ readSymbol(symbol) }  width="75px" height="75px"  >
                    <div class="ui-resizable-handle resizeHandle"></div>
                </div>
            </div>
        </div>
    </div>
    <div>
        <button onclick={ collectDisplayDetail } >Collect</button>
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
        }

        this.totalSymbols = totalCombinations($( "#symbolscount" ).val());
        this.cards = createBlocks($( "#symbolscount" ).val());

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
        collectDisplayDetail(e){
            var deck = {
                frame : this.frame,
                cards: []
            };
            $(".cardframe").each(function(fi){
                var card = {
                    weight: 0,
                    symbols: []
                };
                $(this).find(".symbol").each( function(si){
                    var thumbnail = $(this).find("img")[0];
                    var height = $(thumbnail).height();
                    var width = $(thumbnail).width();
                    var weight = 0;
                    if(height > width){
                        if( height >= width * 1.5){
                            weight = 2;
                        }else{
                            weight = 1;
                        }
                    }else{
                        if( width >= height * 1.5){
                            weight = 2;
                        }else{
                            weight = 1;
                        }
                    }

                    card.symbols.push({
                        top: $(this).position().top,
                        left: $(this).position().left,
                        height: height,
                        width: width,
                        transform: $(this).css("transform"),
                        weight: weight
                    });

                    card.weight += weight;

                    deck.cards.push(card);
                })
            })
            download(JSON.stringify(deck), deck.frame.symbolsPerCard+"-symbols-positions.json" ,"application/json");
        }
    </script>
</review>