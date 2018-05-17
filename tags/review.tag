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
        .cf-selected{
            outline: 4px solid yellow;
        }
    </style>

    <decktemplate></decktemplate>
    <div id="review-panel" class="input-bar clearfix" style="width:100%">
        <div class="photolist-wrapper" style="width:100%">
            <div each={card in cards} class="cardframe" onclick={select} style="background-color: { frame.bgColor }">
                <div class="align-center" style="writing-mode: tb-rl; height: 100%; text-align:center; font-size: small; color: gray;">funcards.github.io/match-it</div>
                <div each={ symbol in card} class="symbol trans"  h={readSymbol(symbol).size.height} w={readSymbol(symbol).size.width}  
                    weight={ Math.abs(calculateWeight( readSymbol(symbol).size )) }>
                    <img  src={ readSymbol(symbol,true).src }>
                    <div class="ui-resizable-handle resizeHandle"></div>
                </div>
                
            </div>
            <div id="snackbar">Selected card has different size of images</div>
        </div>
    </div>
    <script>
        this.templates = [];
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

        this.on("mount",() => {
            var gametype = `${this.parent.frame.symbolsPerCard}-${this.parent.frame.width}x${this.parent.frame.height}`;
            __gaTracker('send', 'event', 'cards', 'generate', gametype);
            $(".cardframe").width(this.frame.width);
            $(".cardframe").height(this.frame.height);

            // Start: card symbol event
            $('.trans img').resizable({
                /* containment:  */
            });
            $('.symbol').draggable().rotatable();
            $(".cardframe").mouseover( function(e) {
                $(this).find(".resizeHandle, .ui-rotatable-handle").show();
            });

            $(".cardframe").mouseout( function(e) {
                $(this).find(".resizeHandle, .ui-rotatable-handle").hide();
            });
            // End: card symbol event

            //position symbols in a card
            $(".cardframe").each( (i,el) => {
                resizeSymbolsRandomly($(el).find(".symbol"), this.frame.resizeEnable, this.frame.maintainratio, this.frame.desiredSymbolSize);
                if(this.frame.rotateEnable){
                    rotateSymbolsRandomly($(el).find(".symbol"));
                }
                setRandomPos($(el).find(".symbol"));
                this.updateTotalWeight(el);
            })

            //Card selection
            $("#action-bar").click((e) =>{
                e.stopPropagation();
            });
            $(document).click((e) =>{//unselect selected
                if( $(e.target).hasClass("cf-selected") || $(e.target).hasClass("action-btn")){
                    //do nothing
                }else{
                    $(".cf-selected").removeClass("cf-selected");
                }
            })
            //End: card selection

        })

        //Select cards
        select(e){
            if (event.ctrlKey && $(e.target).hasClass("cardframe") ) {
                this.toggleSelect(e.target);
            }else if( $(e.target).hasClass("cardframe")) {
                $(".cf-selected").removeClass("cf-selected");
                $(e.target).addClass("cf-selected");
            }
                e.stopPropagation();
        }

        toggleSelect(element){
            if($(element).hasClass("cf-selected")){
                $(element).removeClass("cf-selected");
            }else{
                $(element).addClass("cf-selected");
            }
        }
        //End: select cards
        
        
        /* 
        2 for long or tall images otherwise 1
        */
        

        updateTotalWeight(el){
            totalWeight = 0;
            $(el).find(".symbol").each( (i,img) => {
                totalWeight += Number.parseInt($(img).attr("weight"));
            });
            $(el).attr("totalweight", totalWeight);
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

    </script>
</review>