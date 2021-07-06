var axios = require('axios');

module.exports = {
    /**
     * 初始化
     * 调用各个接口
     */
    init: function () {
        // this.testUserReg();
    },

    /**
     * 测试reg接口
     * 
     */
    testUserReg: async function () {
        let email = "1833121448@qq.com";
        let password = "123456"
        let result = "";

        //testUserRegCase1
        result = await this.postReg(email, password);
        if (result.code === "-1" && result.msg == "邮箱号已注册") {
            console.log("result", result);
            console.log("testUserRegCase1", "success");
        } else {
            console.log("testUserRegCase1", "fail");
        };

        email = "1833121448@3dcw.cn";
        //testUserRegCase2
        console.log("result", result);
        result = await this.postReg(email, password);
        if (result.code === "200" && result.msg == "注册成功") {
            var {
                data
            } = await axios.post("http://localhost:3000/admin/login", {
                userName: "1833121448@qq.com",
                password: "123456"
            });
            // console.log("登录admin", data);

            let token = data.result.accessToken.token;
            let userUuid = result.result.user.uuid;
            // console.log("userUuid", userUuid)
            var {
                data
            } = await axios.get("http://localhost:3000/user/del", {
                params: {
                    userUuid: userUuid
                },
                headers: {
                    'accesstoken': token,
                }
            });
            console.log("删除创建的数据：", data);
            if (data.code == 200) {
                console.log("testUserRegCase2", "success");
            } else {
                console.log("testUserRegCase2", "fail");
            }

        } else {
            console.log(result);
            console.log("testUserRegCase2", "fail");
        };
    },
    postReg: async function (email, password) {
        let {
            data
        } = await axios.post("http://localhost:3000/user/reg", {
            email: email,
            password: password
        });
        return data;
    }
}