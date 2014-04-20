/**
    be_uploadImage 图片上传插件代码
    -----------------------------------------
    blueEditor 简单web所见即所得编辑器
    @url editor.bluereader.org
    @author blue, 010blue@gmail.com
*/
function be_uploadImage(beObject){
    var pluginName='uploadImage';
    var plugin;
    // plugin's attrs
    $.each(beObject.config.plugins,function(k,v){
        if(v.name==pluginName) plugin=v;
    });
    var script=plugin.script;

    var lan=beObject.lan;
    var image_box=beObject.image_box;
    // switch navbar
    var switchNavbar=$('<div class="navbar"></div>');
    imageUrlBox=image_box.children('.imageUrlBox');
    image_box.children(':first').before(switchNavbar);
    switchNavbar.after('<hr />');
    var urlNavbar=$('<a href="javascript:void(0)">'+lan.image_url+'</a>');
    switchNavbar.append(urlNavbar);
    urlNavbar.addClass('active');
    var uploadNavbar=$('<a href="javascript:void(0)">'+lan.upload_image+'</a>');
    switchNavbar.append(uploadNavbar);
    /* uploadImageBox */
    var uploadImageBox=$('<div class="uploadImageBox" style="display:none"></div>');
    image_box.append(uploadImageBox);
    // iframe
    if(window.uploadIframeNum==undefined) window.uploadIframeNum=0;
    window.uploadIframeNum++;
    var uploadIframeId='be_upload_'+window.uploadIframeNum;
    var uploadIframe=$('<iframe id="'+uploadIframeId+'" name="'+uploadIframeId+'" style="display:none" />').appendTo('body');
    // form
    var uploadForm=$('<form class="tooldata" method="post" enctype="multipart/form-data" target="'+uploadIframeId+'" action="'+script+'"><input type="file" name="img" /></form>');
    uploadImageBox.append(uploadForm);
    uploadImageBox.append('<p class="toolbuttons"><input class="operate-confirm" type="button" value="'+lan.confirm+'" /><input class="operate-cancel" type="button" value="'+lan.cancel+'" /></p>');

    urlNavbar.click(function(){
        $(this).parent().children().removeClass('active');
        $(this).addClass('active');
        imageUrlBox.show();
        uploadImageBox.hide();
    });
    uploadNavbar.click(function(){
        $(this).parent().children().removeClass('active');
        $(this).addClass('active');
        imageUrlBox.hide();
        uploadImageBox.show();
    });
    //confirm
    uploadImageBox.children('.toolbuttons').children('.operate-confirm').click(function(){
        var imageInput=uploadImageBox.children('.tooldata').children('input[type=file]');
        if(imageInput.val()==''){
            alert(lan.upload_image_empty);
            return false;
        }
        //form upload
        uploadIframe.unbind();
        uploadForm.unbind();
        var uploadHandle=function(iframe){
            var contentObj=$(iframe).contents().get(0);
            return $(contentObj).find('body').html();
        }
        uploadForm.submit(function(){
            uploadIframe.load(function(){
                var imgUrl=uploadHandle(this);
                beObject.insertSingleData('<img src="'+imgUrl+'" />',beObject.selection_range);
                image_box.hide();
                return false;
            });
        });
        uploadForm.submit();
    });
    //cancel
    uploadImageBox.children('.toolbuttons').children('.operate-cancel').click(function(){
        image_box.hide();
        return false;
    });
}