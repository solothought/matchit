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
        .ui-resizable-handle{
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

    <section id="showcase" style="background-color: #2C3E50;color: white">
        <div class="container" >
            <div class="row">
                <div class="col-lg-12 text-center">
                    <h2>Review</h2>
                </div>
            </div>
        </div>
        <div class="empty"></div>
        <toolbar></toolbar>
        <div id="review-panel" class="input-bar clearfix" style="width:100%">
            <div class="photolist-wrapper" style="width:100%">
                <div each={card in cards} class="cardframe" onclick={select} style="background-color: { frame.bgColor }">
                    <div class="align-middle" style="">
                        <span style="height: 100%;">
                            <img src="static/img/watermark.svg" width="20px">
                        </span>
                    </div>
                    <div each={ symbol in card} class="symbol trans"  h={readSymbol(symbol).size.height} w={readSymbol(symbol).size.width}  
                        weight={ Math.abs(calculateWeight( readSymbol(symbol).size )) }>
                        <img  src={ readSymbol(symbol,true).src }>
                        
                    </div>
                    
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12 text-center">
                <a href="#print" class="btn btn-lg btn-theme" onclick={ print }><i class="icon-print" > Print</i></a>
                <a href="#export" class="btn btn-lg btn-theme"  onclick={ download }><i class="icon-download" > Download</i></a>
            </div>
        </div>
    </section>
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
        //this.accepted = false;
        this.on("mount",() => {
            
            var gametype = `${this.frame.symbolsPerCard}-${this.frame.width}x${this.frame.height}`;
            ga('send', 'event', 'cards', 'generate', gametype);
            $(".cardframe").width(this.frame.width);
            $(".cardframe").height(this.frame.height);

            // Start: card symbol event
            $('.trans img').resizable({
                /* containment:  */
            });
            $('.symbol').draggable().rotatable();
            $(".ui-resizable-handle").hide();
            $(".cardframe").mouseover( function(e) {
                $(this).find(".resizeHandle, .ui-rotatable-handle, .ui-resizable-handle").show();
            });

            $(".cardframe").mouseout( function(e) {
                $(this).find(".resizeHandle, .ui-rotatable-handle, .ui-resizable-handle").hide();
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

            //T&C confirmation box
            
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
            //End : T&C confirmation box
        })

        //Select cards
        this.select = function(e){
            if (event.ctrlKey && $(e.target).hasClass("cardframe") ) {
                this.toggleSelect(e.target);
            }else if( $(e.target).hasClass("cardframe")) {
                $(".cf-selected").removeClass("cf-selected");
                $(e.target).addClass("cf-selected");
            }
                e.stopPropagation();
        }

        this.toggleSelect = function (element){
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
        

        this.updateTotalWeight = function(el){
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
        }

        this.print = function(){
            window.print();
        }

        this.download = function(){
            var counter = 1 ;
            var zip = new JSZip();
            var img = zip.folder("funcards_matchit");
            $(".cardframe").each( (i,el) => {
                html2canvas(el,  {
                        allowTaint: false,
                        useCORS: false,
                        /* onrendered: function(canvas) {
                            Canvas2Image.saveAsPNG(canvas);
                        } */
                    }).then(function(canvas) {
                    /* document.body.appendChild(canvas);
                    $("#img-out").append(canvas); */

                    //zip.file("Hello.txt", "Hello World\n");
                    //var dataUrl = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
                    var dataUrl = canvas.toDataURL();

                    //Canvas2Image.saveAsPNG(canvas);
                    console.log(dataUrl)
                    //img.file( counter + ".jpeg", dataUrl.substr( dataUrl.indexOf(", ")+1 ), {base64: true});
                    console.log("in loop");
                });
            });
            console.log("after loop");
            /* zip.generateAsync({type:"blob"})
                .then(function(content) {
                    // see FileSaver.js
                    saveAs(content, "matchit.zip");
                }); */
        }
    </script>
</review>
