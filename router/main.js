module.exports = function(app)
{
     app.get('/',function(req,res){
        res.render('index.html')
     });

     app.get('/about',function(req,res){
        res.render('about.html');
    });

     app.get('/socket',function(req,res){
        res.render('socket.html');
    });

    app.get('/canvas',function(req,res){
        res.render('canvas.html');
    });

    app.get('/omok',function(req,res){
        res.render('omok.html');
    });

    app.get('/treejs',function(req,res){
        res.render('treejs.html');
    });

}
