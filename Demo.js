const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("./index.html", "utf8");
const replaceVal = (tempVal, orgval) => {
  let temmperature = tempVal.replace("{%tempval%}", orgval.main.temp);
  temmperature = temmperature.replace("{%tempmin%}", orgval.main.temp_min);
  temmperature = temmperature.replace("{%tempmax%}", orgval.main. temp_max);
  temmperature = temmperature.replace("{%location%}", orgval.name);
  temmperature = temmperature.replace("{%country%}", orgval.sys.country);
  temmperature = temmperature.replace("{%tempstatus%}", orgval.weather[0].main);

  return temmperature;
}


const server = http.createServer((req,res)=>{
  if(req.url == "/"){
    requests('https://api.openweathermap.org/data/2.5/weather?q=delhi&units=metric&appid=11d0e7c78d84d0afd47a7c42a81bbb9e')
    .on('data',  (chunk) => {
      const objdata = JSON.parse(chunk)
      const arrData = [objdata];
      const realTimeData = arrData.map((val) => replaceVal(homeFile,val)).join("");

      res.write(realTimeData);

      
    })
    .on('end',  (err) => {
      if (err) return console.log('connection closed due to errors', err);
      res.end();
    });
  }
});

server.listen(4000, "127.0.0.1");
