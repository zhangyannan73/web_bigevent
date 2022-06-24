$(function(){
    // 点击去注册
    $('#link_reg').on('click',function(){
        $('.login-box').hide();
        $('.reg-box').show();
    })
    // 点击去登录
    $('#link_login').on('click',function(){
        $('.reg-box').hide();
        $('.login-box').show(); 
    })

    // 自定义校验规则
    // 从layui获取form对象
    var form = layui.form;
    // 从layui获取layer对象
    var layer = layui.layer;
    form.verify({
        pwd: [
          /^[\S]{6,12}$/
          ,'密码必须6到12位，且不能出现空格'
        ] ,
        // 确认密码校验规则
        repwd:function(value){ //value是确认密码框中的值
            var pwd = $('.reg-box [name=password]').val();
            if(pwd !== value) {
                return '两次密码不一致！'
            }
        }
      }); 

      //发起注册用户的Ajax请求
      $('#form_reg').on('submit',function(e){
          e.preventDefault();
          $.ajax({
             url:'/api/reguser',
             method:'POST',
             data:$(this).serialize(),
             success:function(res){
                 if(res.status!==0){
                     return layer.msg(res.message);
                 }
                 layer.msg('注册成功，请登录！')
                //  模拟点击
                 $('#link_login').click();
             }
             
          })
      })

    //   发起登录的Ajax请求
    $('#form_login').on('submit',function(e){
        e.preventDefault();
        $.ajax({
            url:'/api/login',
            method:'POST',
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layer.msg(res.message);
                }
                layer.msg('登录成功！');
                // 保存成功登录后得到的token字符串
                localStorage.setItem('token',res.token)
                // 跳转到后台主页
                location.href='/code/index.html'
            }
        })
    })
})