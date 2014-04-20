<?php
/**
	upload.php 上传图片插件php后台示例

    blueEditor 简单web所见即所得编辑器
    @url editor.bluereader.org
    @author blue, 010blue@gmail.com
*/
/* !!! 说明：此上传方法为demo，正式环境请修改相关部分代码 */

$imgPath='../../../upload/';							//图片存储目录(保留最后的"/")
$imgPrefix='http://localhost/blueEditor/upload/';		//图片访问前缀(保留最后的"/")

$imgObj=$_FILES['img'];
//是否上传成功
if(empty($imgObj['tmp_name']) || $imgObj['size']<=0) exit;
//图片格式
$imgType=beFileSuffix($imgObj['name']);
if(!in_array($imgType,array('jpg','jpeg','png','gif')) || !in_array($imgObj['type'],array('image/jpeg','image/png','image/gif'))) exit;

//图片名称
$imgName=date('YmdHis').rand(1000,9999).'.'.$imgType;

if(move_uploaded_file($imgObj['tmp_name'],$imgPath.$imgName)){
	echo $imgPrefix.$imgName;
}

function beFileSuffix($name){
	$lastPos=strrpos($name,'.');
	$suffix=$lastPos ? substr($name,$lastPos+1,strlen($name)-$lastPos) : '';
	return strtolower($suffix);
}
?>