require('dotenv').config();

const 
    http = require('http'),
    fs = require('fs'),
    path = require('path'),
    handlebars = require('handlebars');

const articles = [
    {
        url: 'https://examples.com',
        title: 'Kröten drehen durch'
    },
    {
        url: 'https://examples.com',
        title: 'Kayne West zum Präsidenten gewählt'
    } ,
    {
        url: 'https://examples.com',
        title: 'DAX positiv nach Präsidentenwahl'
    }
];


const registerPartials = () => {
    const partials = fs.readdirSync('views/partials');
    partials.forEach(partial => {
        let html = fs.readFileSync('views/partials/' + partial, 'utf-8');
        handlebars.registerPartial(partial.replace('.html', ''), html)
    });
};

registerPartials();

const servePage =(res, pageName, data) => {
    fs.readFile('views/' + pageName, { encoding: 'utf-8'}, (err, html) => {
        if(err) {
            console.log(err);
            res.writeHead(500);
            res.end();
        } else {
            res.writeHead(200);
            const templateFunction = handlebars.compile(html);    
            res.end(templateFunction(data || {}));
        }
    });
};

const servePublicFile = (res, url) => {
    res.writeHead(200);
    let stream = fs.createReadStream(path.join(__dirname, url));
    stream.pipe(res);
}

const port = process.env.PORT;
const server = http.createServer((req, res) => {
    console.log('Requesting ' + req.url);
    
    if(req.url.startsWith('/public')) {
        servePublicFile(res, req.url);
        return;
    }
    
    switch(req.url) {
        case '/settings':
            servePage(res, 'settings.html', {
                title: 'Settings',
                heading: 'Settings',
                settingsActive: true
            })
            break;
        default:
            servePage(res, 'home.html', {
                heading: 'Welcome to the news dashboard!',
                title: 'Home',                
                articles: articles,
                homeActive: true
            })
            break;
    }
    
});

server.listen(port, ()=>{
    console.log('Server is listening at port ' + port);
});