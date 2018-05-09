<galleries>
    <p if={this.opts.count == 1} >Upload { totalSymbols } images</p>
    <gallery each={n,i in this.repeat } id="gallery_{i}"></gallery>
    <div class="row">
        <div class="col-lg-12 text-center">
            <button class="btn btn-theme" id="generate" onclick={ generate } disabled={ !readyToGenerate }>Generate</button>
        </div>
    </div>
    <script>
        this.readyToGenerate = false;
        this.repeat = new Array(this.opts.count);
        this.totalSymbols = totalCombinations($( "#symbolscount" ).val());
        this.symbols = {};
        generate(){
            riot.mount("review", {symbols: this.symbols});
        }
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
    </script>
</galleries>