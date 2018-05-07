<galleries>
    <gallery each={n,i in this.repeat } id="gallery_{i}"></gallery>
    <script>
        this.repeat = new Array(Number.parseInt(this.opts.count));
    </script>
    <div class="row">
        <div class="col-lg-12 text-center">
            <button id="generate" onclick={ generate }>Generate</button>
        </div>
    </div>
    <script>
        this.symbols = {};
        generate(){
            riot.mount("review", {symbols: this.symbols});
        }
    </script>
</galleries>