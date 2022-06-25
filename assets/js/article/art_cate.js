$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList()
    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)
            }
        })
    }

    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    // 不能直接给form绑定submit事件，因为绑定时还没有form
    // 通过代理的形式为form绑定
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                initArtCateList();
                console.log(1);

                layer.msg('新增分类成功');
                layer.close(indexAdd)
            }
        })
    })

    // 编辑文章分类
    var indexEdit = null
    // 通过代理为编辑按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        // 根据id值获取文章类别数据
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val("form-edit", res.data)
            }
        })
    })

    // 更新文章分类数据
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize,
            success:function(res){
                console.log(res);
                if(res.status !== 0){
                    return layer.msg('更新分类数据失败')
                }
                layer.msg('更新分类数据成功')
                layer.close(indexEdit)
                initArtCateList();
            }

        })
    })

    // 删除文章分类
    $('tbody').on('click','.btn-delete',function(){
        var id = $(this).attr('data-id');

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/' + id,
                success:function(res){
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                      }
                      layer.msg('删除分类成功！')
                      layer.close(index)
                      initArtCateList()
                }
            })
        })
    })


})