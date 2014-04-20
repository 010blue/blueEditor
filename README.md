<header><h3>blueEditor | 版本 1.0 | 简单web所见即所得编辑器</h3></header>
        <p>
            <code>
                /* 说明 */<br/>
                1) 基于html5+jquery，简单高效，兼容IE7+、Chrome、Firefox等浏览器<br />
                2) 支持中文(默认)、英文等语言切换，语言配置见blueEditor.js<br/>
                3) 支持插件编写，已内置"图片上传"插件，陆续开发中<br /><br/>
                /* 相关文件 */<br />
                &lt;script src=&quot;jquery.js&quot;&gt;&lt;/script&gt;<br />
                &lt;script src=&quot;blueEditor.js&quot;&gt;&lt;/script&gt;<br />
                &lt;link href=&quot;blueEditor.css&quot; type=&quot;text/css&quot; rel=&quot;stylesheet&quot;&gt;
            </code>
        </p>
        <p>
            <code class="nob">
                $('textarea#demo1').blueEditor({ 'width':600, 'height':80, 'language':'cn' });
            </code>
            <textarea id="demo1"></textarea>
        </p>
<pre><code class="nob">$('textarea#demo2').blueEditor({
    'width':600, 'height':80
    'plugins':[
        {
            'name':'uploadImage',
            'script':'./blueEditor/plugins/uploadImage/upload.php'
        }
    ]
});</code></pre>