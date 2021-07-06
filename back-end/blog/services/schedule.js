/**
 * 定时任务
 */
var schedule = require('node-schedule');
const configs = require('../config/default');
const email = require('./email');
var axios = require('axios');
// var sdate = require('silly-datetime');时间格式化
var User = require('../test/user');

module.exports = {

    /**
     * 
     * @param {*} citycode 城市代码
     * @returns 
     */
    getWeather: async function (citycode) {
        let {
            status,
            data
        } = await axios.get(`https://restapi.amap.com/v3/weather/weatherInfo?city=${citycode}&extensions=all&key=${configs.weather.key}&output=JSON`);
        if (status === 200 && data && data.forecasts && data.forecasts.length) {
            let weeks = ["", "一", "二", "三", "四", "五", "六","日"]
            let {
                city,
                casts
            } = data.forecasts[0];
            let i=0,str_weather ="";
            while(i<casts.length){
                let {
                    date,
                    week,
                    dayweather,
                    nightweather,
                    daytemp,
                    nighttemp,
                    daywind,
                    nightwind,
                    daypower,
                    nightpower
                } = casts[i];
                i++;
                str_weather += `${date} 周${weeks[week]} ${city}天气:
                    <br>白天：
                        <br>&emsp;&emsp;天气：${dayweather}
                        <br>&emsp;&emsp;最高气温：${daytemp}°
                        <br>&emsp;&emsp;风向：${daywind}风
                        <br>&emsp;&emsp;风力：${daypower}级
                    <br>夜间：
                        <br>&emsp;&emsp;天气：${nightweather}
                        <br>&emsp;&emsp;最高气温：${nighttemp}°
                        <br>&emsp;&emsp;风向：${nightwind}风
                        <br>&emsp;&emsp;风力：${nightpower}级<br><br>
                `;
            }

            return str_weather;
        } else {
            return ''
        }
    },
    /**
     * 发送天气邮件
     */
    sendWeatherMail: async function () {
        let _this = this;
        //每天 14h 运行天气预报任务         周几
        schedule.scheduleJob('0 05 11 * * *', async function () {
            console.log('schedule', new Date());
            var object = await _this.getWeather('440113');
            if (!object) {
                console.log("schedule", "获取天气信息失败！");
            }
            var opts = {
                to: configs.email.admin,
                subject: "天气预报",
                html: object
            }

            // 发送邮件
            email.sendSystemEmail(opts);
        })
    },

    /**
     * 测试接口
     */
    testBlogApi: async function(){
        let user = User.init();
        // let userInfo = UserInfo.init();
        // let admin = AdminUser.init();
        // let 
    }

}