//导入模块 express  svg- captcha path
let express = require("express");
let svgCaptcha = require("svg-captcha");
let path = require("path");

//创建app
let app = express();

//托管静态资源
app.use(express.static("static"));

//路由1
// 使用get方式 访问登录页时 直接读取登录界面 并返回
app.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname,"static/views/login.html"))
})

//路由2
app.get("/login/captchaImg.png",(req,res)=>{
    var captcha = svgCaptcha.create();
	res.type('svg');
	res.status(200).send(captcha.data);
})
//开启监听
app.listen(8090,"127.0.0.1",()=>{
    console.log("success");
})