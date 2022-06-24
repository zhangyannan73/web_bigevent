$(function(){
    var layer = layui.layer;
    // 点击实实现推出功能
    $("#btnLogout").on('click',function(){
        // 提示用户是否退出
        layer.confirm('确定退出登录 ?', {icon: 3, title:'提示'}, function(index){
            // 清空本地存储中的token
            localStorage.removeItem('token')
            // 跳转到登录页面
            location.href='/code/login.html'
            // 关闭该弹层返回index
            layer.close(index);
          })
    })

    //获取用户基本信息
    getUserInfo();

})
    // 获取用户的基本信息
    function getUserInfo(){
        $.ajax({
            method:'GET',
            url:'/my/userinfo',

            // headers请求头配置对象
            headers:{
                Authorization: localStorage.getItem('token') || ''
            },
            success:function(res){
                if(res.status!==0){
                    return layer.msg('获取用户信息失败')
                }
                console.log(res);
                // 调用renderAvater渲染用户头像
                renderAvatar(res.data);
            } ,
            complete:function(res){
                if(res.responseJSON.status ===1 && res.responseJSON.message ==='身份认证失败！'){
                    localStorage.removeItem('token')
                    location.href='/code/index.html'
                }
            }
        })
    }
 
    //渲染用户头像
    function renderAvatar(user){
        // 1.获取用户的名称
        var name=user.nickname || user.username;
        // 2.设置欢迎文本
        $('#welcome').html('欢迎&nbsp;&nbsp;'+name);
        // 3.按需渲染用户的头像
        if(user.user_pic!==null){
            // 渲染图片头像
            $('.layui-nav-img').attr('src',user.user_pic).show();
            $('.text-avatar').hide()
        }else{
            // 渲染文本头像
            $('.layui-nav-img').hide();
            var first = name[0].toUpperCase(); //获取第一个字符并转化为大写
            $('.text-avatar').html(first).show()
        }

    }