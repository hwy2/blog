// 手机号验证
export function isvalidPhone(str) {
    const reg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/;
    return reg.test(str);
}

// 验证密码  密码正则 最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
export function isvalidPass(str) {
    const reg = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/;
    return reg.test(str);
}

//验证用户名  用户名正则，4到16位（字母，数字，下划线，减号）
export function isvalidUsername(str) {
    const reg = /^[a-zA-Z0-9_-]{4,16}$/;
    return reg.test(str);
}

//Email正则
export function isvalidEmail(str) {
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return reg.test(str);
}