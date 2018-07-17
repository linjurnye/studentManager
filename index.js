//导入模块 express  svg- captcha path express-session
let express = require("express");
let svgCaptcha = require("svg-captcha");
let path = require("path");
var session = require('express-session');
var bodyParser = require('body-parser');
let myt = require(path.join(__dirname,"tools/myT"))

//创建app
let app = express();

//托管静态资源
app.use(express.static("static"));
app.use(session({
    secret: 'keyboard cat',
}));
app.use(bodyParser.urlencoded({
    extended: false
}));

//路由1
// 使用get方式 访问登录页时 直接读取登录界面 并返回
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "static/views/login.html"));
});
//路由2
// 判断验证码
app.post("/login", (req, res) => {
    let userName = req.body.userName;
    let userPass = req.body.userPass;
    // 验证码
    let code = req.body.code;
    if (code == req.session.captcha) {
        req.session.userInfo = {
            userName,
            userPass
        }
        res.redirect("/index")
    } else {
        res.setHeader("centent-type", "application/javascript");
        res.send('<script>alert("验证码错误");window.location.href = "/login"</script>')
    }
});

//路由3
// 验证码
app.get("/login/captchaImg.png", (req, res) => {
    // 生成一张图片并返回
    var captcha = svgCaptcha.create();
    req.session.captcha = captcha.text.toLowerCase();
    res.type('svg');
    res.status(200).send(captcha.data);
    // 保存session
});
//路由4
// 登录
app.get("/index", (req, res) => {
    if (req.session.userInfo) {
        res.sendFile(path.join(__dirname, "static/views/index.html"));
    } else {
        res.setHeader("centent-type", "text-html");
        res.send('<script>alert("请先登录");window.location.href = "/login"</script>')
    }
});
//路由5 登出
app.get("/loginout", (req, res) => {
    delete req.session.userInfo
    res.redirect("/login")
});
// 路由6 注册页
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "static/views/register.html"));
});
// 路由7 注册
app.post('/register', (req, res) => {

    // 获取用户数据
    let userName = req.body.userName;
    let userPass = req.body.userPass;
    myt.find("userList",{userName},(err,docs)=>{
        if(docs.length == 0){
            // 可以注册
            myt.insert("userList",{ userName,userPass},(err,result)=>{
                if(!err)myt.mess(res,"欢迎加入","/login");
            })
        }else{
            // 不可注册
            myt.mess(res,"已注册","/register")
        }
    })
    // MongoClient.connect(url,  (err, client)=>{
    //     // 连上mongo之后 选择使用的库
    //     const db = client.db(dbName);
    //     // 选择使用的集合
    //     let collection = db.collection('userList');

    //     // 查询数据
    //     collection.find({
    //         userName
    //     }).toArray((err,doc)=>{
    //         console.log(doc);
    //         if(doc.length==0){
    //             // 没有人
    //             // 新增数据
    //             collection.insertOne({
    //                 userName,
    //                 userPass
    //             },(err,result)=>{
    //                 console.log(err);
    //                 // 注册成功了
    //                 res.setHeader('content-type','text/html');
    //                 res.send("<script>alert('欢迎入坑');window.location='/login'</script>")
    //                 // 关闭数据库连接即可
    //                 client.close();
    //             })
    //         }
    //     })
        
    // });
})
//开启监听
app.listen(8090, "127.0.0.1", () => {
    console.log("success");
})