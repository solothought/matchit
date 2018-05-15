<decktemplate>
    <div class="row">
        <div class="col-2"></div>
        <div class="col-2">
            <select id="templateselect" class="form-control" onchange={loadtemplate}>
                <option disabled="true">Select template</option>
                <option value="normal" selected>3-250x350-match-it</option>
                <option value="pocker" >Pocker Playing Card</option>
                <option value="domino" >Domino Card</option>
                <option value="square" >Square Card</option>
            </select>
        </div>
        <div class="col-2">
            <label class="btn-bs-file btn btn-theme">Browse Template file
                <input type="file" class="filebutton" accept="application/vnd.nimn,*.nmn,*.nimn"  onchange= { readTemplateFile }/>
            </label>
        </div>
        <div class="col-2">
            <input id="exportTemplateName" type="text" class="form-control" placeholder="Enter the template name " value={  exportTemplateName}>
        </div>
        <div class="col-2">
            <button class="btn btn-lg btn-theme" onclick={ exportTemplate } >Export Template</button>
        </div>
        <div class="col-2"></div>
    </div>
    <div class="row warnmessage">
        <div class="col-12">This template might not be suitable for selected card size.</div>
    </div>
    <script>
    
        loadtemplate(e){
            
            var templateName = e.target.value + ".nimn";
            $.ajax({
                url: "./templates/"+templateName,
                type: "GET",
                dataType: "json",
                contentType: "application/vnd.nimn; charset=utf-8",
                success: data => {
                    var templateData = JSON.parse(data);
                    //this.parent.templates[templateName] = templateData;
                    //var widthDifference = ( templateData.width * 100) / Math.abs(this.parent.frame.width - templateData.width)
                    //var heightDifference = ( templateData.height * 100) / Math.abs(this.parent.frame.height - templateData.width)
                    
                    //set margin as per height width difference

                    this.parent.applyTemplate(templateData);
                }
            });
        }
        this.exportTemplateName = `${this.parent.frame.symbolsPerCard}-${this.parent.frame.width}x${this.parent.frame.height}-match-it.nimn`;
        readTemplateFile(f){
            //f.file or f.files[0]
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
        }
        
        exportTemplate(e){
            var deck = {
                frame : this.parent.frame,
                cards: {}
            };
            $(".cardframe").each(function(fi){
                var totalWeight =0;
                var symbols = [];
                $(this).find(".symbol").each( function(si){
                    var thumbnail = $(this).find("img")[0];
                    var height = $(thumbnail).height();
                    var width = $(thumbnail).width();
                    var weight = $(thumbnail).attr("weight");

                    symbols.push({
                        top: $(this).position().top,
                        left: $(this).position().left,
                        height: height,
                        width: width,
                        transform: $(this).css("transform"),
                        weight: weight
                    });

                    totalWeight += weight;
                });
                if(!deck.cards[totalWeight]){
                    deck.cards[totalWeight] = [];
                }
                deck.cards[totalWeight].push(symbols);
            })
            //TODO: convert to nimn first
            //download(JSON.stringify(deck), `${deck.frame.symbolsPerCard}-${this.frame.width}x${this.frame.height}-match-it.json` ,"application/json");
            var data = JSON.stringify(deck);
            var fileName = this.root.querySelector('#exportTemplateName').value;

            download( data, fileName ,"application/vnd.nimn");
        }
    </script>
</decktemplate>