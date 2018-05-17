<design>
    <style>
        .ui-slider .ui-slider-handle{
            width: 0.8em;
            height: 0.8em;
        }
        #slider-vertical{
            height: 150mm;
            width: 5px;
        }

        #slider-horizontal{
            width: 150mm;				
            height: 5px;
        }

        #demo-card{
            display: block;
            outline: 1px solid grey;
            margin-top: 10px;
        }
        #demo-card-container{
            height: 160mm;
        }
        #slider-vertical-val{
            writing-mode: tb-rl;
            height: 100%;
            text-align: center;
        }
    </style>
    <div class="row">
        <div class="col-md-4">
            <select id="cardsize" class="form-control" onchange={changeDemoCardSize}>
                <option disabled="true">Select Size</option>
                <option each= { cardsize,name in cards } value={ name } selected={ name == 'Normal Playing Card Or Bridge Size' }>{name}</option>
            </select>
            <div class="empty"></div>
            <select id="symbolscount" onchange={checkSymbolCount} class="form-control">
                <option selected="false" disabled="true">Number of symbols on a card</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
            </select>
            <div class="empty"></div>
            <div>Choose background color</div>
            <input type="color" id="colorpicker" onchange={changeBgColor} value="#ffffff" style="width:100%;">

            <div class="empty"></div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="rotate">
                <label class="form-check-label" for="rotate">
                    Rotate randomly
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="resize">
                <label class="form-check-label" for="resize">
                    Resize randmly
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="maintainratio" checked="true">
                <label class="form-check-label" for="maintainratio">
                    Maintain height width ratio
                </label>
            </div>
        </div>

        <div  class="col-md-8">
                <div id="slider-horizontal-val" class="text-center" style="width:160mm;"></div>
                <div id="slider-horizontal"></div>
                <div id="demo-card-container">
                    <div style="float:left; width:160mm; height:160mm;">
                        <div id="demo-card">
                            <!-- <img class="thumbnail" src="img/freepik/bath.svg">
                            <img class="thumbnail" src="img/freepik/dog.svg">
                            <img class="thumbnail" src="img/freepik/driller.svg"> -->
                        </div>
                    </div>
                    <div id="slider-vertical" style="float:left"></div>
                    <div id="slider-vertical-val" style="float:left"></div>
                </div>
        </div>
            
    </div>

    <script>

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

        /*
        Poker size (63mm x 88mm, 2.5" x 3.5")
        Bridge size (56mm x 88mm, 2.25" x 3.5")
        Large size cards (89mm x 146mm, 3.5" x 5.75")
        Tarot size cards (70mm x 121mm, 2.75" x 4.75")
        Mini size cards (44.45mm x 63.5mm, 1.75" x 2.5")
        Micro size cards (32mm x 45mm, 1.25" x 1.75")
        Domino size cards (44mm x 89mm, 1.75" x 3.5")
        Business size cards (50mm x 89mm, 2" x 3.5")
        Small square size cards (50mm x 50mm, 2" x 2")
        Square size cards (89mm x 89mm, 3.5" x 3.5")
        Circle size cards (89mm x 89mm, 3.5" x 3.5")
        Hex size cards (89mm x 89mm, 3.5" x 3.5")
        Trump size cards (62mm x 100mm, 2.45" x 3.95")
        */

        this.on('mount', () => {
            //update default
            this.setupSlider(this.cards["Normal Playing Card Or Bridge Size"]);
            this.updateSlider(this.cards["Normal Playing Card Or Bridge Size"]);
            this.updateDemoCard(this.cards["Normal Playing Card Or Bridge Size"]);
            $( "#symbolscount" ).val("3")
        });

        changeBgColor(e){
            $("#demo-card").css("background-color", e.target.value);
        }

        changeDemoCardSize(e){
            this.updateSlider(this.cards[$( "#cardsize" ).val()]);
            this.updateDemoCard(this.cards[$( "#cardsize" ).val()]);
        }

        updateDemoCard(size){
            $( "#demo-card" ).height(size.h + "mm");
            $( "#demo-card" ).width(size.w + "mm");
        }

        var one_cm = 37.7952755906; //inpixels
        var one_inch = 0.0393701; //in mm
        var maxCardSize = 150;//mm

        updateSlider(size){
            $( "#slider-vertical-val" ).text(convertIntoText(size.h));
            $( "#slider-horizontal-val" ).text(convertIntoText(size.w));
            $( "#slider-vertical" ).slider( "value", maxCardSize - size.h);
            $( "#slider-horizontal" ).slider( "value", size.w);
        }

        setupSlider(size){
            $( "#slider-vertical" ).slider({
                orientation: "vertical",
                /* range: "min", */
                min: 0,
                max: maxCardSize,
                value: maxCardSize - size.h,
                slide: function( event, ui ) {
                    $( "#demo-card" ).height((maxCardSize - ui.value) + "mm");
                    $( "#slider-vertical-val" ).text( convertIntoText(maxCardSize - ui.value) );
                }
            });

            $( "#slider-horizontal" ).slider({
                /* range: "min", */
                min: 0,
                max: maxCardSize,
                value: size.w,
                slide: function( event, ui ) {
                    $( "#demo-card" ).width(ui.value + "mm");
                    $( "#slider-horizontal-val" ).text( convertIntoText(ui.value) );
                }
            });
        }

        function convertIntoText(unit){
            //return unit + 'mm or ' + Math.round(unit * one_inch,3) + '"';
            return unit + 'mm or ' + round(unit * one_inch,2) + '"';
        }

        checkSymbolCount(){
            var w = $( "#slider-horizontal" ).slider("value");
            var h = maxCardSize - $("#slider-vertical" ).slider("value");

            var maxCount = Math.floor( h / minSymbolSize.h ) * Math.floor(w / minSymbolSize.w);

            if( $('#symbolscount').val() > maxCount ){
                alert("Number of symbols for given size should not be greater than " + maxCount);
            }

        }

    </script>
</design>