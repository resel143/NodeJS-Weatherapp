let http = require('http');
var requests = require('requests');
const fs = require('fs');

// getting data at backend using Nodejs
const homeFile = fs.readFileSync('home.html',"utf-8");

const replaceVal =(tempVal, origVal)=>{
        let temperature = tempVal.replace("{%tempval%}", origVal.main.temp);
        temperature= temperature.replace("{%tempmin%}", origVal.main.temp_min);
        temperature= temperature.replace("{%tempmax%}", origVal.main.temp_max);
        temperature= temperature.replace("{%location%}", origVal.name);
        temperature= temperature.replace("{%country%}", origVal.sys.country);
        return temperature;
}


// console.log(homeFile);
const server = http.createServer((req, res)=>{
    if(req.url == '/'){
        requests("http://api.openweathermap.org/data/2.5/weather?q=Raipur&appid=6781f1e3836eda9f9ad56a8c83f75302")
        .on('data', (chunk)=> {
            let objData = JSON.parse(chunk);
            const arrData = [objData];
        //   console.log(arrData[0].main.temp);
        const realTimeData = arrData.map((val)=>{
            replaceVal(homeFile, val);
        }).join("");
            // res.write(realTimeData);
            console.log(realTimeData);
        })
        .on('end', (err)=> {
          if (err) return console.log('connection closed due to errors', err);
         res.end();
        });

    }
})

server.listen(8000,'127.0.0.1');
