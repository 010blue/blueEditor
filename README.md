<header><h3>blueEditor | 版本 1.0 | 简单web所见即所得编辑器</h3></header>
<pre><code>
/* 说明 */
1) 基于html5+jquery，简单高效，兼容IE7+、Chrome、Firefox等浏览器
2) 支持中文(默认)、英文等语言切换，语言配置见blueEditor.js
3) 支持插件编写，已内置"图片上传"插件，陆续开发中

/* 相关文件 */
&lt;script src=&quot;jquery.js&quot;&gt;&lt;/script&gt;
&lt;script src=&quot;blueEditor.js&quot;&gt;&lt;/script&gt;
&lt;link href=&quot;blueEditor.css&quot; type=&quot;text/css&quot; rel=&quot;stylesheet&quot;&gt;
/* 在线Demo地址 */
<a target="_blank" href="http://editor.bluereader.org">http://editor.bluereader.org</a>
</code>
</pre>
<pre><code>
$('textarea#demo1').blueEditor({ 'width':600, 'height':80, 'language':'cn' });
$('textarea#demo2').blueEditor({
    'width':600, 'height':80
    'plugins':[
        {
            'name':'uploadImage',
            'script':'./blueEditor/plugins/uploadImage/upload.php'
        }
    ]
});</code></pre>