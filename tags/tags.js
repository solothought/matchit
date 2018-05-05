riot.tag2('galleries', '<gallery each="{this.repeat}"></gallery>', '', '', function(opts) {
        this.repeat = new Array(Number.parseInt(this.opts.count));
});
riot.tag2('gallery', '<label class="btn-bs-file btn btn-outline-info">Browse Image files <input type="file" class="filebutton" accept="image/*" onchange="{readImageFiles}" multiple> </label> <div class="input-bar clearfix"> <div class="left-paddle"></div> <div class="photolist-wrapper"> <div class="photolist"> <img riot-src="{src}" label="{name}" title="{name}" width="80px" each="{galleryData}"> </div> </div> <div class="right-paddle"></div> </div>', '', '', function(opts) {
        this.readImageFiles = function(e) {
            var input = e.srcElement;
            if (input.files && input.files[0]) {
                for(i=0;i<input.files.length;i++){
                    this.readImageFile(input.files[i]);
                }
            }
        }.bind(this)
        this.galleryData = [];
        this.readImageFile = function(f) {
            data = this.galleryData;
            if(f.type.startsWith("image")){
                var reader = new FileReader();
                reader.onload = function (e) {
                    var imgData = {
                        name : f.name,
                        src: e.target.result
                    };
                    data.push(imgData);
                }
                reader.onloadend = e => {
                    this.update();
                }
                reader.readAsDataURL(f);
            }
        }.bind(this)
});