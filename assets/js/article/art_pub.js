$(function () {
    var layer = layui.layer
    var form = layui.form

    initCate()
    // 定义加载文章类别的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                // 模板引擎渲染文章类别
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr);
                // 重新渲染ui结构
                form.render()
            }
        })
    }

    // 富文本编辑器
    initEditor()

    // 图片裁剪区域
    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 绑定隐藏文件选择按钮
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })
    // 替换裁剪区域图片
    $('#coverFile').on('change', function (e) {
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg('请选择照片')
        }
        //cropper
        var file = e.target.files[0];
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //   文章发布
    // 定义文章的发布状态
    var art_state = '已发布'
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })
    // 获取表单数据当到FormData对象中
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()

        // 创建FormData对象, 将文章的发布状态存到fd中
        var fd = new FormData($(this)[0])
        fd.append('state', art_state)

        // 将裁减后的图片放到FormData中
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                fd.append('cover_img', blob)
            })
        // 发起ajax请求发布文章
        publishArticle(fd)

    })
    // 发布
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success:function(res){
                console.log(res);
                if(res.status!==0){
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功')
                location.href='/code/article/art_list.html'
            }
        })
    }
})