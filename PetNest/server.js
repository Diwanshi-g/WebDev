var express = require("express");
var path = require("path");
var fileuploader = require("express-fileupload");
var mysql = require("mysql");

var app = express();

app.listen(2003, function () {
    console.log("Server Started!!");
})

var dbConfigurationObj = {
    host: "localhost",
    user: "root",
    password: "",
    database: "project"
}

var db = mysql.createConnection(dbConfigurationObj);
db.connect(function (Err) {
    if (Err == null)
        console.log("Database connected successfully!!!");
    else
        console.log(Err.message);
});

app.use(express.static("public")); //url hadler
app.use(express.urlencoded({ extended: true }));//used M.ware
app.use(fileuploader()); 


app.get("/", function (req, resp) {
    var fullPath = path.join(__dirname, "public", "index.html");
    resp.sendFile(fullPath);

})

app.get("/signup-process", function (req, resp) {
    var email = req.query.email;
    var pwd = req.query.pwd;
    var type = req.query.uType;

    var dataAry = [email, pwd, type];

    db.query("insert into users values(?,?,?,current_date(),1)", dataAry, function (err) {
        if (err)
            console.log(err);
        else
            resp.send("Signed Up Successfully");
    })

})

app.get("/login-process", function (req, resp) {
    var emailid = req.query.email;
    var pass = req.query.pwd;

    var dataAry = [emailid, pass];

    db.query("select * from users where email=? and password=?", dataAry, function (err, table) {
        if (err)
            resp.send(err);
        else if (table.length == 1)
            resp.send(table);
        else
            resp.send("Invalid email or password");
    })
})

app.get("/profile-client", function (req, resp) {
    var fullPath = path.join(__dirname, "public", "profile-client.html");
    resp.sendFile(fullPath);

})

app.post("/profileClient-save", function (req, resp) {
    //console.log(req.body);
    var emailid = req.body.txtUidn;
    var name = req.body.txtNamen;
    var mob = req.body.txtMobn;
    var address = req.body.txtAddn;
    var city = req.body.txtCityn;
    var state = req.body.inputStaten;
    var postal = req.body.txtPostaln;
    var pets = req.body.petsn;
    var newFileName = emailid + "-" + req.files.IDproofn.name;

    var dataAry = [emailid, name, mob, address, city, state, postal, newFileName, pets];

    //  console.log(dataAry);
    var des = path.join(__dirname, "public", "uploads", newFileName);
    req.files.IDproofn.mv(des, function (err) {
        if (err)
            console.log(err);
        else
            console.log(req.files.IDproofn.name + " id proof of client uploaded successfully");

        db.query("insert into profileclients values(?,?,?,?,?,?,?,?,?)", dataAry, function (err) {
            if (err)
                console.log(err);
            else
                console.log("Saved successfully");
        })
    })


})

app.post("/profileClient-edit", function (req, resp) {
    // console.log(req.body);

    var emailid = req.body.txtUidn;
    var name = req.body.txtNamen;
    var mob = req.body.txtMobn;
    var address = req.body.txtAddn;
    var city = req.body.txtCityn;
    var state = req.body.inputStaten;
    var postal = req.body.txtPostaln;
    var pets = req.body.petsn;
    var newFileName = emailid + "-" + req.files.IDproofn.name;

    var dataAry = [name, mob, address, city, state, postal, newFileName, pets, emailid];

    db.query("update profileclients set name=?,number=?,address=?,city=?,state=?,postalCode=?,idProof=?,pets=? where email=?", dataAry, function (err, result) {
        if (err)
            resp.send(err);

        if (result.affectedRows == 1)
            console.log("Data Updated");
        else
            console.log("Invalid email");
    })




})

app.get("/search-details-client", function (req, resp) {
    var data = [req.query.email];
    db.query("select * from profileclients where email=?", data, function (err, table) {

        if (err)
            resp.send(err.sqlMessage);
        else
            resp.send(table);
    })
})

app.get("/dash-admin", function (req, resp) {
    var fullPath = path.join(__dirname, "public", "dash-admin.html");
    resp.sendFile(fullPath);
})

app.get("/client-manager", function (req, resp) {
    var fullPath = path.join(__dirname, "public", "manager-client.html");
    resp.sendFile(fullPath);
})

app.get("/user-manager", function (req, resp) {
    var fullPath = path.join(__dirname, "public", "manager-user.html");
    resp.sendFile(fullPath);
})

app.get("/fetch-all-clients", function (req, resp) {

    db.query("select * from profileclients", function (err, table) {
        if (err)
            resp.send(err.sqlMessage);
        else
            resp.json(table);
    })
})

app.get("/delete-client", function (req, resp) {

    var dataAry = [req.query.emailid];
    db.query("delete from profileclients where email=?", dataAry, function (err, table) {
        console.log(table);
        if (err)
            resp.send(err.sqlMessage);
        else
            if (table.affectedRows == 1)
                resp.send("Deleted");
            else
                resp.send("invalid id");
    })
})
app.get("/fetch-all-users", function (req, resp) {

    db.query("select * from users", function (err, table) {
        if (err)
            resp.send(err.sqlMessage);
        else
            resp.json(table);
    })
})
app.get("/block-user", function (req, resp) {

    var dataAry = [req.query.emailid];
    db.query("update users set status=0 where email=?", dataAry, function (err, result) {
        if (err)
            resp.send(err);

        if (result.affectedRows == 1)
            resp.send("Data Updated");
        else
            resp.send("Invalid email");
    })
})

app.get("/resume-user", function (req, resp) {

    var dataAry = [req.query.emailid];
    db.query("update users set status=1 where email=?", dataAry, function (err, result) {
        if (err)
            resp.send(err);

        if (result.affectedRows == 1)
            resp.send("Data Updated");
        else
            resp.send("Invalid email");
    })
})
app.get("/profile-careTaker",function(req,resp){
    var fullPath = path.join(__dirname, "public", "profile-caretaker.html");
    resp.sendFile(fullPath);

})
app.post("/profileCareTaker-save", function (req, resp) {
    var emailid = req.body.txtUidn;
    var name = req.body.txtNamen;
    var mob = req.body.txtMobn;
    var firm = req.body.txtFirmn
    var address = req.body.txtAddn;
    var city = req.body.txtCityn;
    var province = req.body.inputProvn;
    var pets = req.body.inputPetsn.toString();
    var text = req.body.txtarean;

    var dataAry = [emailid, name, mob, firm, address, city, province, pets, text];

    db.query("insert into profilecaretakers values(?,?,?,?,?,?,?,?,?)", dataAry, function (err) {
        if (err)
            console.log(err);
        else
            console.log("Saved successfully");
    })

})
app.post("/profileCareTaker-edit",function(req,resp){
    var emailid = req.body.txtUidn;
    var name = req.body.txtNamen;
    var mob = req.body.txtMobn;
    var firm = req.body.txtFirmn
    var address = req.body.txtAddn;
    var city = req.body.txtCityn;
    var province = req.body.inputProvn;
    var pets = req.body.inputPetsn.toString();
    var text = req.body.txtarean;
    var dataAry = [ name, mob, firm, address, city, province, pets, text,emailid];
    db.query("update profilecaretakers set name=?,contact=?,firmweb=?,address=?,city=?,province=?,petTypes=?,information=? where email=?", dataAry, function (err, result) {
        if (err)
            resp.send(err);

        if (result.affectedRows == 1)
            console.log("Data Updated");
        else
            console.log("Invalid email");
    })
})
app.get("/search-details-careTaker",function(req,resp){
    var data = [req.query.email];
    db.query("select * from profilecaretakers where email=?", data, function (err, table) {

        if (err)
            resp.send(err.sqlMessage);
        else if (table.length == 1)
            resp.send(table);
        else
           {
            resp.send(table);
           }
    })
})
app.get("/careTaker-finder",function(req,resp){
    var fullPath = path.join(__dirname, "public", "careTaker-Finder.html");
    resp.sendFile(fullPath);
})
app.get("/fetch-all-distinct-cities",function(req,resp){
   
    db.query("select distinct city from profilecaretakers",function(err,table){
        console.log(table);
        if(err)
        {
            resp.send(err.sqlMessage);
        }
        else
        resp.send(table);
    })
})
app.get("/fetchInfo",function(req,resp){
    var data = [req.query.city, "%" + req.query.pet + "%"];
    db.query("select * from profilecaretakers where city=? and petTypes like ?",data,function(err,table){
        if (err)
        resp.send(err.sqlMessage);
    else
        resp.send(table);
        console.log(table);
    })
})