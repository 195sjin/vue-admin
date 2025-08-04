import request from '@/utils/request';

// 更新用户密码
export function updateAdminPassword(data) {
  return request({
    url: '/admin/updatePwd',
    method: 'patch',
    data: {
      old_Pwd: data.old_Pwd,
      new_Pwd: data.new_Pwd,
      re_Pwd: data.re_Pwd
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

// 其他用户相关API...
export const adminRegisterService = (registerData)=>{
    const params = new URLSearchParams()
    for(let key in registerData){
        params.append(key,registerData[key]);
    }
    return request.post('/admin/register',params);
}
//提供调用登录接口的函数
export const adminLoginService=(loginData)=>{

    const params=new URLSearchParams();
    for(let key in loginData){
        params.append(key,loginData[key])
    }
    return request.post('/admin/login',params)
}
//获取个人信息
export const adminInfoGetService = ()=>{
    return request.get('/admin/adminInfo');
}
//修改个人信息
export const adminInfoUpdateService = (userInfo)=>{
    return request.put('/admin/update',userInfo)
}
//修改头像
export const adminAvatarUpdateService=(avatarUrl)=>{
    let params = new URLSearchParams();
    params.append('avatarUrl',avatarUrl)
    return request.patch('/admin/updateAvatar',params)
}