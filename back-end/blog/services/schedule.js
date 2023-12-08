/**
 * 定时任务
 */
var schedule = require('node-schedule');
const configs = require('../config/default');
const email = require('./email');
var axios = require('axios');
// var sdate = require('silly-datetime');时间格式化
var User = require('../test/user');
var dataSummary = require('../controllers/dataSummary');

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
            let weeks = ["", "一", "二", "三", "四", "五", "六", "日"]
            let {
                city,
                casts
            } = data.forecasts[0];
            let i = 0,
                str_weather = `<h2 style="text-align: center;">${city}天气</h2>`;
            while (i < casts.length) {
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
                str_weather +=`<table style="border-collapse: collapse;width: 100%; border: 1px solid #999;margin-top:15px;">
                    <thead>
                        <tr>
                            <th colspan="2" style=" border: 1px solid #999;padding: 5px;">${date} 周${weeks[week]} </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style=" border: 1px solid #999;padding: 5px;"> 白天</td>
                            <td style=" border: 1px solid #999;padding: 5px;"> 夜间</td>
                        </tr>
                        <tr>
                            <td style=" border: 1px solid #999;padding: 5px;">天气:${dayweather}</td>
                            <td style=" border: 1px solid #999;padding: 5px;">天气：${nightweather}</td>
                        </tr>
                        <tr>
                            <td style=" border: 1px solid #999;padding: 5px;">最高气温：${daytemp}°</td>
                            <td style=" border: 1px solid #999;padding: 5px;">最高气温：${nighttemp}°</td>
                        </tr>
                        <tr>
                            <td style=" border: 1px solid #999;padding: 5px;">风向：${daywind}风</td>
                            <td style=" border: 1px solid #999;padding: 5px;">风向：${nightwind}风</td>
                        </tr>
                        <tr>
                            <td style=" border: 1px solid #999;padding: 5px;">风力：${daypower}级</td>
                            <td style=" border: 1px solid #999;padding: 5px;">风力：${nightpower}级</td>
                        </tr>
                    </tbody>
                </table >`;
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
        schedule.scheduleJob('0 40 09 * * *', async function () {
            console.log('schedule', new Date());
            var object = await _this.getWeather(configs.weather.citycode);
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
     * 数据统计
     */
    statisticalData: async function () {
        schedule.scheduleJob('0 18 11 * * *', async function () {
            dataSummary.updateDataSummary();
        })
    },

    /**
     * 测试接口
     */
    testBlogApi: async function () {
        let user = User.init();
        // let userInfo = UserInfo.init();
        // let admin = AdminUser.init();
        // let 
    }

}