/**
    blueEditor 简单web所见即所得编辑器,基于jquery
    @url editor.bluereader.org
    @author blue, 010blue@gmail.com
*/

/* class BlueEditor */
function BlueEditor(obj,options){
    var languages={
        'cn' : {
            'link' : '链接',
            'link_url' : '链接地址',
            'link_selection_empty' : '请先选中待链接的内容',
            'image' : '图片',
            'image_url' : '图片地址',
            'image_url_empty' : '请输入图片地址 http://...',
            'upload_image' : '上传图片',
            'upload_image_empty' : '请选择待上传的图片',
            'video' : '视频',
            'video_url' : '视频地址',
            'video_url_empty' : '请输入视频地址 http://...(.swf)',
            'video_format_error' : '视频格式错误,仅支持swf',
            'confirm' : '确定',
            'cancel' : '取消'
        },
        'en' : {
            'link' : 'link',
            'link_url' : 'link',
            'link_selection_empty' : 'Please select the content first',
            'image' : 'image',
            'image_url' : 'image link',
            'image_url_empty' : 'Please input image link',
            'upload_image' : 'upload image',
            'upload_image_empty' : 'Please select the image',
            'video' : 'video',
            'video_url' : 'video link',
            'video_url_empty' : 'Please input video link',
            'video_format_error' : 'Only swf supported',
            'confirm' : 'Confirm',
            'cancel' : 'Cancel'
        }
    }
    var currentEditor=this;
    var config,lan,original,parent,root_path,container,toolbar,toolbar_list,content,selection_range;
    var link_box,image_box,video_box;
    var config_base={
        'language' : 'cn',
        'toolbar' : ['B','I','U','link','image','video','code'],
        'width' : 400,
        'height' : 100,
        'plugins' : []
    };
    function init(){
        toolbar_list={};
        original=$(obj);
        parent=original.parent();
        container=$('<div class="blueEditor"></div>');
        content=$('<div class="blueEditor-content" contenteditable="true"></div>');
        content.html(original.text());
        root_path=getRootPath();
        parent.append(container);
        original.hide();

        setConfig();
        setToolbar();

        container.append(content);
        content.focusin(function(){
            sync();
        });
        content.focusout(function(){
            sync();
        });
        content.keydown(function(event){
            keyDown(event);
        });
        /* plugins */
        //for plugins to use
        currentEditor.config=config;
        currentEditor.lan=lan;
        currentEditor.link_box=link_box;
        currentEditor.image_box=image_box;
        currentEditor.video_box=video_box;
        if(config.plugins.length>0){
            $.each(config.plugins,function(k,v){
                var pluginPath=getRootPath()+'/blueEditor/plugins/'+v.name+'/';
                $.getScript(pluginPath+'index.js',function(){
                    eval('be_'+v.name+"(currentEditor)");
                });
            });
        }
    }
    init();

    function setConfig(){
        config=config_base;
        /* user config */
        if(options!=null && typeof(options)=='object'){
            if(options.language) config.language=options.language;
            if(options.toolbar) config.toolbar=options.toolbar;
            if(options.width){
                config.width=options.width;
            }else{
                if(original.width()) config.width=original.width();
            }
            if(options.height){
                config.height=options.height;
            }else{
                if(original.height()) config.height=original.height();
            }
            content.width(config.width);
            content.height(config.height);
            container.width(config.width+8);
            //plugins
            if(options.plugins && options.plugins.length>0) config.plugins=options.plugins;
        }

        lan=languages[config.language];
    }
    function setToolbar(){
        toolbar=$('<div class="blueEditor-toolbar"></div>');
        container.append(toolbar);
        //resize height
        var resize_btn=$('<a href="javascript:void(0)" class="resize_btn">+</a>');
        toolbar.append(resize_btn);
        resize_btn.click(function(){
            content.height(content.height()+100);
        });
        //toolbar items
        $(config.toolbar).each(function(i,item){
            item=item.toLowerCase();
            item_upper=item.toUpperCase();
            var obj_item;
            switch(item){
                case 'link':
                    obj_item=$('<a href="javascript:void(0)">'+lan.link+'</a>');
                    toolbar.append(obj_item);
                    //link's box
                    link_box=$('<div class="toolbox"><p class="tooldata"><label>'+lan.link_url+':</label><input type="text" value="http://" /></p><p class="toolbuttons"><input class="operate-confirm" type="button" value="'+lan.confirm+'" /><input class="operate-cancel" type="button" value="'+lan.cancel+'" /></p></div>');
                    toolbar.append(link_box);
                    //show box
                    obj_item.click(function(){
                        selection_range=getSelectionRange();
                        toolbar.children('.toolbox').hide();
                        rangeData=''+selection_range.range;
                        if(rangeData==''){
                            alert(lan.link_selection_empty);
                        }else{
                            link_box.show();
                        }
                    });
                    //confirm
                    link_box.children('.toolbuttons').children('.operate-confirm').click(function(){
                        var url=link_box.children('.tooldata').children('input[type=text]').val();
                        insertAtSelection('<a href="'+url+'">','</a>',selection_range);
                        link_box.children('.tooldata').children('input[type=text]').val('');
                        link_box.hide();
                        return false;
                    });
                    //cancel
                    link_box.children('.toolbuttons').children('.operate-cancel').click(function(){
                        link_box.children('.tooldata').children('input[type=text]').val('');
                        link_box.hide();
                        return false;
                    });
                    break;
                case 'image':
                    obj_item=$('<a href="javascript:void(0)">'+lan.image+'</a>');
                    toolbar.append(obj_item);
                    //image's box
                    image_box=$('<div class="toolbox"></div>');
                    toolbar.append(image_box);
                    var imageUrlBox=$('<div class="imageUrlBox"><p class="tooldata"><input type="text" placeholder="'+lan.image_url_empty+'" /></p><p class="toolbuttons"><input class="operate-confirm" type="button" value="'+lan.confirm+'" /><input class="operate-cancel" type="button" value="'+lan.cancel+'" /></p></div>');
                    image_box.append(imageUrlBox);
                    //show box
                    obj_item.click(function(){
                        selection_range=getSelectionRange();
                        toolbar.children('.toolbox').hide();
                        image_box.show();
                    });
                    //confirm
                    imageUrlBox.children('.toolbuttons').children('.operate-confirm').click(function(){
                        var url=imageUrlBox.children('.tooldata').children('input[type=text]').val();
                        if(url==''){
                            alert(lan.image_url_empty);
                        }else{
                            insertSingleData('<img src="'+url+'" />',selection_range);
                            imageUrlBox.children('.tooldata').children('input[type=text]').val('');
                            image_box.hide();
                            return false;
                        }
                    });
                    //cancel
                    imageUrlBox.children('.toolbuttons').children('.operate-cancel').click(function(){
                        imageUrlBox.children('.tooldata').children('input[type=text]').val('');
                        image_box.hide();
                        return false;
                    });
                    break;
                case 'video':
                    obj_item=$('<a href="javascript:void(0)">'+lan.video+'</a>');
                    toolbar.append(obj_item);
                    //video's box
                    video_box=$('<div class="toolbox"><p class="tooldata"><input type="text" placeholder="'+lan.video_url_empty+'" /></p><p class="toolbuttons"><input class="operate-confirm" type="button" value="'+lan.confirm+'" /><input class="operate-cancel" type="button" value="'+lan.cancel+'" /></p></div>');
                    toolbar.append(video_box);
                    //show box
                    obj_item.click(function(){
                        selection_range=getSelectionRange();
                        toolbar.children('.toolbox').hide();
                        video_box.show();
                    });
                    //confirm
                    video_box.children('.toolbuttons').children('.operate-confirm').click(function(){
                        var url=video_box.children('.tooldata').children('input[type=text]').val();
                        if(url==''){
                            alert(lan.video_url_empty);
                        }else{
                            insertSingleData('<embed src="'+url+'" allowFullScreen="true" quality="high" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>',selection_range);
                            video_box.children('.tooldata').children('input[type=text]').val('');
                            video_box.hide();
                            return false;
                        }
                    });
                    //cancel
                    video_box.children('.toolbuttons').children('.operate-cancel').click(function(){
                        video_box.children('.tooldata').children('input[type=text]').val('');
                        video_box.hide();
                        return false;
                    });
                    break;
                case 'code':
                    obj_item=$('<a href="javascript:void(0)">'+item_upper+'</a>');
                    toolbar.append(obj_item);
                    obj_item.click(function(){
                        toolbar.children('.toolbox').hide();
                        insertMark(item);
                    });
                    break;
                default:
                    obj_item=$('<a href="javascript:void(0)"><'+item+'>'+item_upper+'</'+item+'></a>');
                    toolbar.append(obj_item);
                    obj_item.click(function(){
                        toolbar.children('.toolbox').hide();
                        insertMark(item);
                    });
                    break;
            }
        });
    }
    /* sync */
    function sync(){
        if($.inArray(original[0].tagName,['textarea','input'])){
            original.val(content.html());
        }else{
            original.html(content.html());
        }
    }
    /* base */
    function keyDown(event){
        switch(event.keyCode){
            case 13:
                event.preventDefault();
                insertSingleData('<br />');
                break;
            default:break;
        }
    }
    function insertMark(mark){
        insertAtSelection('<'+mark+'>','</'+mark+'>');
    }
    function insertAtSelection(begin,end,selection_range){
        content.focus();
        var selection;
        var range;
        if(!selection_range) selection_range=getSelectionRange();
        selection=selection_range.selection;
        range=selection_range.range;

        var data='';
        if(begin!=''){
            data+=begin+getSelectedHtml(selection_range)+end;
            range.deleteContents();
        }else{
            data+=end;
        }
        range.collapse(false);
        if(!window.getSelection){
            range.pasteHTML(data);
            range.select();
        }else{
            var fragment=range.createContextualFragment(data);
            var last_child=fragment.lastChild;
            while (last_child && last_child.nodeName.toLowerCase()=='br' && last_child.previousSibling && last_child.previousSibling.nodeName.toLowerCase()=='br'){
                var e=last_child;
                last_child=last_child.previousSibling;
                fragment.removeChild(e);
            }
            range.insertNode(fragment);
            if(last_child){
                range.setEndAfter(last_child);
                range.setStartAfter(last_child);
            }
            if(selection){
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }
    function insertSingleData(data,selection_range){
        insertAtSelection('',data,selection_range);
    }
    function getSelectionRange(){
        content.focus();
        var selection_range={};
        var selection=window.getSelection ? window.getSelection() : document.selection;
        var range=selection.createRange ? selection.createRange() : selection.getRangeAt(0);
        selection_range.selection=selection;
        selection_range.range=range;
        return selection_range;
    }
    function getSelectedHtml(selection_range){
        var html='';
        var selection=selection_range.selection;
        var range=selection_range.range;
        if(!window.getSelection){
            html=range.htmlText;
        }else{
            if(selection!=''){
                var div=$('<div></div>');
                for (var i=0;i<selection.rangeCount;i++) {
                    div.append(selection.getRangeAt(i).cloneContents());
                }
                html=div.html();
            }else{
                html=range;
            }
        }
        return html;
    }
    function getRootPath(){
        var href=document.location.href;
        var pathName=document.location.pathname;
        var domain=href.substr(0,href.indexOf(pathName));
        var dir=pathName.substr(0,pathName.substr(1).indexOf('/')+1);
        return domain+dir;
    }

    this.insertMark=insertMark;
    this.insertAtSelection=insertAtSelection;
    this.insertSingleData=insertSingleData;
    this.getSelectionRange=getSelectionRange;
    this.getRootPath=getRootPath;
}

(function($){
    $.fn.blueEditor=function(options){
        $(this).each(function(i,obj){
            new BlueEditor(obj,options);
        });
    }
})(jQuery);