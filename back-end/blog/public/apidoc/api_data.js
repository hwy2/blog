define({ "api": [
  {
    "type": "post",
    "url": "api/user",
    "title": "注册功能",
    "description": "<p>注册功能</p>",
    "group": "user",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "username",
            "description": "<p>账号</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "tel",
            "description": "<p>手机号</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>密码</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n code: '10400',\n message: '请完善表单信息'\n}\n{\n code: '10666',\n message: '注册成功'\n}\n{\n code: '10606',\n message: '该用户已注册'\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "/api/user"
      }
    ],
    "version": "1.0.0",
    "filename": "api/users.js",
    "groupTitle": "user",
    "name": "PostApiUser"
  }
] });
