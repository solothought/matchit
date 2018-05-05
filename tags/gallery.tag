<gallery>
    <label class="btn-bs-file btn btn-outline-info">Browse Image files
        <input type="file" class="filebutton" accept="image/*"  onchange= { readImageFiles }  multiple/>
    </label>
    <div class="input-bar clearfix">
        <div class="left-paddle"></div>
        <div class="photolist-wrapper">
            <div class="photolist">
                <img src={ src } label ={ name } title={ name } width="80px" each={ galleryData }>
            </div>
        </div>
        <div class="right-paddle"></div>
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
        this.galleryData = [];
        readImageFile(f) {
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
        }
    </script>
</gallery>