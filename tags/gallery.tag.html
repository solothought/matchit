<gallery>
    <style>
        .delete {
            background: url("static/img/delete.svg") no-repeat;
            width:15px;
            height: 15px;
            float: left;
            position: absolute;
            cursor: pointer;
        }
        .imgbox {
            float: left;
            position: relative;
        }
    </style>
    <label class="btn-bs-file btn btn-outline-info">Browse Image files
        <input type="file" class="filebutton" accept="image/*"  onchange= { readImageFiles }  multiple/>
    </label>
    <div class="input-bar clearfix">
        <div class="photolist-wrapper masorny">
            <div name="photolist" class="photolist">
                <div each={ this.parent.symbols[this.opts.id] } class="imgbox clearfix">
                    <div class="delete" onclick={ deleteThumbnail }></div>
                    <img src={ src } label ={ name } title={ name } class="thumbnail" >
                </div>
            </div>
        </div>
    </div>
    <script>
        readImageFiles(e) {
            var input = e.srcElement;
            if (input.files && input.files[0]) {
                for(i=0;i<input.files.length;i++){
                    this.readImageFile(input.files[i]);
                }
            }
        }
        this.parent.symbols[this.opts.id] = [];
        
        readImageFile(f) {
            data = this.parent.symbols[this.opts.id];
            if(f.type.startsWith("image")){
                var reader = new FileReader();
                reader.onload = e => {
                    var imgData = {
                        name : f.name,
                        src: e.target.result
                    };
                    this.updateDimentions(e.target.result,imgData);
                    data.push(imgData);
                    this.parent.trigger("uploadimages");
                }
                reader.onloadend = e => {
                    this.update();
                    reader = null;
                }
                reader.readAsDataURL(f);
            }
        }

        updateDimentions(imgFileSrc, imageDataObject){
            var img = new Image();
            img.onload = function() {
                imageDataObject.size = {
                    width : this.width,
                    height : this.height
                }
            };
            img.src = imgFileSrc;
        }

        deleteThumbnail(e){
            var thumbnail = $(e.target.nextElementSibling);
            for(var thumbnail_i in this.parent.symbols[this.opts.id]){
                if(this.parent.symbols[this.opts.id][thumbnail_i].name === $(thumbnail[0]).attr("title")){
                    this.parent.symbols[this.opts.id].splice(thumbnail_i,1);
                    break;
                }
            }
            //$(thumbnail[0]).parent().remove();
            this.update();
        }
    </script>
</gallery>