require('dotenv').config();
const 
    express = require('express');
    expressHandlebars = require('express-handlebars')
    newsapi = require('newsapi-wrapper');
const port = process.env.PORT;

//express Server aufsetzen
const server = express();

//server mitteilen, wo die views liegen
server.set('viewDir', 'views'); 

//eigene kleine Middleware zum loggen der angeforderten URL
const logURLMiddleware = (req, res, next) => {
    console.log(req.url);
    next();
};
server.use(logURLMiddleware);

//Middleware, die die statischen Dateien im public Verzeichnis liefert
server.use(express.static('public'));

//Dateien vom Format .html werden geliefert
server.engine('html', expressHandlebars({
    extname: 'html'
}));

//views haben die Endung .html, müsste sonst in jedem res.render angegeben werden
server.set('view engine', 'html');

//fetching data from newsAPI
const renderHome = (req, res) => {
    let articles = [];
    let message = '';
    newsapi
        .setApiKey(process.env.NEWS_API_KEY)
        .send()
        .then(response => {
            articles = response.articles;           
        })
        .catch(err => {
            message = 'Error when retriving articles from NewsAPI';            
        })
        .then(() => {
            res.render('home', {
                heading: 'Welcome to the news dashboard!',
                title: 'News Page',                
                homeActive: true,
                articles,
                message  
            });
        });
    };
    
//routing
server.get('/', renderHome);
server.get('/home', renderHome);

const renderSettings = (req, res) => {
    res.render('settings', {
        title: 'Settings',
        heading: 'Settings',
        settingsActive: true
    });
};

server.get('/settings', renderSettings);
server.get('/admin', renderSettings);



server.listen(port, ()=>{
    console.log('Server is listening at port ' + port);
});