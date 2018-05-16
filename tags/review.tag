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
    </style>

    <decktemplate></decktemplate>
    <div id="review-panel" class="input-bar clearfix" style="width:100%">
        <div class="photolist-wrapper" style="width:100%">
            <div each={card in cards} class="cardframe" style="background-color: { frame.bgColor }">
                <div class="align-center" style="    writing-mode: tb-rl; height: 100%; text-align:center; font-size: small; color: gray;">funcards.github.io/match-it</div>
                <div each={ symbol in card} class="symbol trans" style="{this.transformSize( readSymbol(symbol).size)} transform: rotate({ this.transformRotate() }deg);" 
                    weight={ calculateWeight( readSymbol(symbol).size ) }>
                    <img  src={ readSymbol(symbol,true).src } height="100%" width="100%"  >
                    <div class="ui-resizable-handle resizeHandle"></div>
                </div>
                
            </div>
        </div>
    </div>
    <script>
        this.templates = [];
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
            maintainratio: $( "#maintainratio" ).prop("checked"),
            /* symbol: {
                width:,
                height:
            } */
        }

        this.frame.desiredSymbolSize = Math.floor ( ( (this.frame.width * this.frame.height) / this.frame.symbolsPerCard ) * 0.9 );

        transformRotate(){
            if(this.frame.rotateEnable){
                return randInRange(0,360);
            }
        }

        transformSize(originalSize){
            var ratio = 1;
            var w,h;
            var minW,maxW;
            if(this.frame.maintainratio /* && originalSize.width < originalSize.height */){//set only width
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
        }
        
        calculateWeight(size){
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
        }
        this.totalSymbols = totalCombinations($( "#symbolscount" ).val());
        this.cards = createBlocks($( "#symbolscount" ).val());

        var groupIndex = [];
        /*
        Read an image from given group number(next everytime). If there is only one group then n is image number from that group.
        */
        readSymbol(n,readNext){
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
        }

        applyTemplate(templateData){
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
        }

        calculateTotalWeight(el){
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
        }

    </script>
</review>