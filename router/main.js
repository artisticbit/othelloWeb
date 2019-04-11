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

    app.get('/othello',function(req,res){
        res.render('othello.html');
    });

    app.get('/omok',function(req,res){
        res.render('omok.html');
    });

    app.get('/treejs',function(req,res){
        res.render('treejs.html');
    });

    app.get('/threejs_obj',function(req,res){
        res.render('threejs_obj.html');
    });

    app.get('/paint',function(req,res){
        res.render('paint.html');
    });

    app.get('/test',function(req,res){
        res.render('test.html');
    });

    app.get('/ball',function(req,res){
        res.render('ball.html');
    });


}
