'use strict';

const cron = require('cron-scheduler');
const line = require('@line/bot-sdk');
const express = require('express');
var xray = require('x-ray');
var request = require('request');
var http = require('http');
var https = require("https");
var apicache = require('apicache');
var zip = require('express-zip');

var server  = require('./server-config'); //load request url object

var s = require('./scrape'); //load scrape function

// line limit 10 item pada tab gulir,50 karakter pada text dan 40 karakter pada title,
//jika error saat parse respon 404 bearti ada yang melebihi limit atau property tidak sesuai aturan line.


//token IOT arest service
const key_arest ="?key=w7qdxnbaxy9gxmrd"; 

// create LINE SDK config from env variables
const config = {
    channelAccessToken: process.env.CAT,
    channelSecret: process.env.CS,
};



// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

const x=xray(); //scraper
const c=apicache.middleware('1 hour'); //cached middleware

// register a webhook handler with middleware
app.post('/webhook', line.middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});


setInterval(function() {
        http.get('hasana.glitch.me')
    }, 600000); // server refresh every 10 minutes.




// GLOBAL FUNCTION UNTUK BOT ++++++++++++++++


//cek apakah type number
function isNumber(n){   
  return !isNaN(parseFloat(n)) && !isNaN(n - 0) 
}


// untuk generate acak angka
function acak(min, max){ 
  return Math.floor(Math.random() * (max - min + 1)) + min;        
}

// handle addmore tapi untuk endpoint catagory
var addmore_category = async (url,adapter) => {
  app.get(url+'/:kategori'+'/more/:num',async function(req,res){
     
    function isNumber(n){  return !isNaN(parseFloat(n)) && !isNaN(n - 0) }
        
    var num = await req.params.num; //untuk manipulasi parameter jumlah num    
    var category = await req.params.kategori;

            
    if (await isNumber(num) !== true){
      res.json({status: '200',message: 'use number for paramater to show data example '+url+'/more/'+':number',code: 'error'});  
    }else{
      await adapter(res,category,num);        
    }
          
  })      
}



// function untuk menangani router addmore
var addmore = async (url,adapter) => {  
  app.get(url+'/more/:num',async function(req,res){
    var display = await req.params.num; //untuk manipulasi parameter num
    
    if (await isNumber(display) !== true){
        res.json({
                  status: '200',
                  message: 'use number for paramater to show data example '+url+'/more/'+':number',
                  code: 'error'
                 });
      
    }else{  
      await adapter(res,display);
      
    }
  })
}



// router middleware
app.use(c); //use cached middleware on router express


//ROUTER ===================


app.get('/e100',function(req,res){
  s.e100(res);
});


app.get('/upcoming',function (req, res) {
  s.upcoming(res,1); // limit sesuai dengan jumlah item perhalaman
})

app.get('/nime',function (req, res) { //index drivenime
  s.nime(res,1); // limit sesuai dengan jumlah item perhalaman
})

app.get('/nime/:kategori',async function (req, res) { //katagori drivenime
  var category = await req.params.kategori;
  s.nime_katagori(res,category);
})

app.get('/recom',function (req, res) { //top anime drivenime
  s.recom(res,1);
})

app.get('/free',function (req, res) { //index kupon free udemy
  s.smartybro(res,1);
})

app.get('/free/:kategori',async function (req, res) { //katagori kupon free udemy
  var category = await req.params.kategori;
  s.smartybro_katagori(res,category,1);
})

app.get('/diskon',function (req, res) { //index kupon udemy smartybro
  s.diskon(res,1);
})

app.get('/diskon/:kategori',async function (req, res) { //katagori kupon udemy smartybro
  var category = await req.params.kategori;
  s.diskon_katagori(res,category,1);
})

app.get('/ebook',function (req, res) { // index free ebook all programing
  s.ebook(res);
})
  
app.get('/ebook/download',function (req, res) { // download all ebook to zip, belum jadi
  res.zip([
    { path: '/path/to/file1.name', name: '/path/in/zip/file1.name' },
    { path: '/path/to/file2.name', name: 'file2.name' }
  ]);
})

app.get('/ebook/json/:name',async function (req, res) { // getpage or detail page for download ebook
  var name = await req.params.name;
  s.getpage(res,name);
})

/// fungsi router untuk handle endpoint nambah jumlah item diload pada json
addmore('/upcoming',s.upcoming); //new
addmore('/recom',s.recom);
addmore('/free',s.smartybro);
addmore('/diskon',s.diskon);
addmore_category('/diskon',s.diskon_katagori);
addmore_category('/free',s.smartybro_katagori);

//




// BOT AREA ===============================================

async function handleEvent(event) {

///// GLOBAL FUNCTION UNTUK BOT ===============
    
const stickerAnswers = () => { // fungsi mengolah respon bot dengan sticker by febrian dwi putra
  
    const random_sticker_answers = [{  /// hahah, random stiker dengan fungsi acak yang aku buat.
          "type": "sticker",
          "packageId": "1",
          "stickerId": acak(100,118)
        },
        {
          "type": "sticker",
          "packageId": "1",
          "stickerId": acak(1,17)
        },
        {
          "type": "sticker",
          "packageId": "1",
          "stickerId": acak(119,139)
        },
        {
          "type": "sticker",
          "packageId": "1",
          "stickerId": acak(401,430)
        },
        {
          "type": "sticker",
          "packageId": "1",
          "stickerId": acak(18,20)
        },
        {
          "type": "sticker",
          "packageId": "2",
          "stickerId": acak(22,47)
        },
        {
          "type": "sticker",
          "packageId": "2",
          "stickerId": acak(140,179)
        },
        {
          "type": "sticker",
          "packageId": "2",
          "stickerId": acak(501,527)
        },
        {
          "type": "sticker",
          "packageId": "3",
          "stickerId": acak(180,259)
        },
        {
          "type": "sticker",
          "packageId": "4",
          "stickerId": acak(260,307)
        },
        {
          "type": "sticker",
          "packageId": "4",
          "stickerId": acak(601,632)
        }
        ]
    
    const random_array = random_sticker_answers[Math.floor(Math.random() * random_sticker_answers.length)]; // pick one item by index[i] from array.
  
  return random_array
}
  
  
  // simple reply function
const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({ type: 'text', text }))
  );
};

  
// fungsi ini untuk handle try{}..catch(e){} / ().then() .. ().catch() / ().resolve().. ().reject() callback error bot
var err = () => {
  if (typeof(type) == 'undefined' || typeof(data) == 'undefined' || typeof(actions) == 'undefined'){
    const answer = {
      "type": "text",
      "text": "ouh, i'm don't know what your say. "
    };
  const sticker = stickerAnswers();
  return client.replyMessage(event.replyToken, [answer,sticker]);
  }
}
  
  
  
  // menu utama di load disini
    var menu = () => {
      
      const menu = {
            "type": "template",
            "altText": "MENU UTAMA",
            "template": {
                "type": "carousel",
                "columns": [
                  {
                  "thumbnailImageUrl": "https://bit.ly/2VIFMQc",
                  "imageBackgroundColor": "#FFFFFF",
                  "title": "My Gas Sensor",
                  "text": "Check gas value in the my room",
                  "defaultAction": {
                      "type": "message",
                      "label": "CHECK NOW",
                      "text": "check gas sensor"
                  },
                  "actions": [
                      {
                        "type": "message",
                        "label": "CHECK NOW",
                        "text": "check gas sensor"
                      },
                      {
                        "type": "message",
                        "label": " ",
                        "text": " "
                      },
                      {
                        "type": "message",
                        "label": " ",
                        "text": " " //kosongin biar respon 200. karna harus 3 actionnya.
                      },
                      
                  ]
                },
                  {
                  "thumbnailImageUrl": "https://bit.ly/2VCR2xF",
                  "imageBackgroundColor": "#FFFFFF",
                  "title": "My Lamp",
                  "text": "Control your lamp in the my room",
                  "defaultAction": {
                      "type": "message",
                      "label": "ON",
                      "text": "turn on my lamp"
                  },
                  "actions": [
                      {
                        "type": "message",
                        "label": "TURN ON",
                        "text": "turn on my lamp"
                      },
                      {
                        "type": "message",
                        "label": "TURN OFF",
                        "text": "turn off my lamp"
                      },
                      {
                        "type": "message",
                        "label": " ",
                        "text": " " //kosongin biar respon 200. karna harus 3 actionnya.
                      },
                      
                  ]
                },
                  {
                  "thumbnailImageUrl": "https://i.imgur.com/lGtnHm0.jpg",
                  "imageBackgroundColor": "#FFFFFF",
                  "title": "Batch Anime",
                  "text": "Latest Update Batch Anime",
                  "defaultAction": {
                      "type": "message",
                      "label": "LATEST ANIME",
                      "text": "latest anime today"
                  },
                  "actions": [
                      {
                          "type": "message",
                          "label": "LATEST ANIME",
                          "text": "latest anime today"
                      },
                      {
                          "type": "message",
                          "label": "UPCOMING ANIME",
                          "text": "upcoming anime"
                      },
                      {
                          "type": "message",
                          "label": "ANIME RECOMMENDED",
                          "text": "recommendations"
                      }
                  ]
                },
                {
                  "thumbnailImageUrl": "https://i.imgur.com/toDUruo.png",
                  "imageBackgroundColor": "#000000",
                  "title": "Free Ebook",
                  "text": "Download Reference Ebook Programing",
                  "defaultAction": {
                          "type": "message",
                          "label": "LATEST EBOOK",
                          "text": "latest ebook"
                  },
                  "actions": [
                      {
                          "type": "message",
                          "label": "LATEST EBOOK",
                          "text": "latest ebook"
                      },
                       {
                          "type": "message",
                          "label": "DOWNLOAD EBOOK",
                          "text": "choose ebook"
                      },
                      {
                          "type": "message",
                          "label":" ",
                          "text": " "
                      }
                  ]
                },
                  {
                  "thumbnailImageUrl": "https://i.imgur.com/FePUDRa.png",
                  "imageBackgroundColor": "#FFFFFF",
                  "title": "Udemy Coupon",
                  "text": "Latest Coupon Code",
                  "defaultAction": {
                          "type": "message",
                          "label": "LATEST COUPON CODE",
                          "text": "coupon today"
                  },
                  "actions": [
                      {
                          "type": "message",
                          "label": "LATEST COUPON CODE",
                          "text": "coupon today"
                      },
                      {
                          "type": "message",
                          "label":"CATEGORY COUPON",
                          "text": "choose coupon"
                      },
                      {
                          "type": "message",
                          "label":" ",
                          "text": " "
                      }
                  ]
                },
                  {
                  "thumbnailImageUrl": "https://i.imgur.com/1djYIeZ.png",
                  "imageBackgroundColor": "#FFFFFF",
                  "title": "Free 100% Course",
                  "text": "Latest Coupon Smartybro",
                  "defaultAction": {
                       "type": "message",
                       "label": "LATEST SMARTYBRO",
                       "text": "smartybro today"
                  },
                  "actions": [
                      {
                          "type": "message",
                          "label": "LATEST SMARTYBRO",
                          "text": "smartybro today"
                      },
                      {
                          "type": "message",
                          "label":"CATEGORY SMARTYBRO",
                          "text": "choose smartybro"
                      },
                      {
                          "type": "message",
                          "label":" ",
                          "text": " "
                      }
                  ]
                }
            ],
            "imageAspectRatio": "rectangle",
            "imageSize": "cover"
        }
      }

            return client.replyMessage(event.replyToken, menu);
    
    }
  
        

  /////////////////
  
  ///// END GLOBAL FUNCTION UNTUK BOT ===============
    
    
///// BOT AREA HERE ------------------------------------
    
  // event -> array, type -> property pada object. sample object: {type: 'message'}
  if (event.type !== 'message' || event.message.type !== 'text') {     
        // ignore non-text-message event, const bisa nampung array dan var tidak bisa karna tidak konsisten.
        //return Promise.resolve(null);
        // callback jika dikirim tidak tipe pesan
        const sticker = stickerAnswers();
        return client.replyMessage(event.replyToken, sticker);
    }
  
  var options1 = { // server request pada layanan ai susi
        method: 'GET',
        url: 'http://api.susi.ai/susi/chat.json',
        qs: {
            timezoneOffset: '-330',
            q: event.message.text
        }
    };
  
  
//// switch case ini menghandle static fitur / non server -------------------------
switch(event.message.text.toLowerCase()) {
    
    case 'who febrian':
      const febri = {
          "type": "template",
          "altText": "Febrian Dwi Putra is humble people with skill programing and design",
          "template": {
            "type": "buttons",
            "actions": [
              {
                "type": "uri",
                "label": "FACEBOOK",
                "uri": "https://www.facebook.com/febri.krn"
              },
              {
                "type": "uri",
                "label": "LINKEDIN",
                "uri": "https://www.linkedin.com/in/febrian-dwi-putra-026446163"
              },
              { "type": "uri",
                "label": "GITHUB",
                "uri": "https://github.com/febritecno"
              }
            ],
                "thumbnailImageUrl": "https://avatars2.githubusercontent.com/u/9696688?s=460&v=4",
                "title": "Febrian Dwi Putra",
                "text": "Someone who likes in front of a laptop all day for 20 hours"
          }
        };
        return client.replyMessage(event.replyToken, febri);
      break;
      
    case 'help':
        const help = {
          "type": "template",
          "altText": "help about bot",
          "template": {
            "type": "buttons",
            "actions": [
              {
                "type": "message",
                "label": "CLICK HERE",
                "text": "what can you do"
              },
              {
                "type": "message",
                "label":"RETURN TO MENU",
                "text": "show menu"
              }
            ],
            "thumbnailImageUrl": "https://i.imgur.com/Mo2OOwm.png",
            "title": "Help Me, Captain!",
            "text": "you don't know how to use it?"
          }
        };
    
        return client.replyMessage(event.replyToken, help);
      break;
    
    case 'what can you do':
      const hasana = {
          "type": "text",
          "text": "hasana bot is a bot messager from line messager platform, this bot can answer your chat with susi.ai service and use ability for crawl."
        };
      const coba = {
          "type": "text",
          "text": "try the ability, choose and try typing some skill .. [wikipedia tentang 'isi sendiri'],[how to cook mie],[when it will rain]"
        };
      const answer = {
          "type": "text",
          "text": "you can click button on bottom, then you look more example reference of skill this bot. read and let's try to chat."
        };
      const button = {
          "type": "template",
          "altText": "help",
          "template": {
            "type": "buttons",
            "actions": [
              {
                "type": "uri",
                "label": "VISIT WEBSITE",
                "uri": "https://skills.susi.ai/"
              },
              {
                "type": "message",
                "label":"RETURN TO MENU",
                "text": "show menu"
              }
            ],
            "thumbnailImageUrl": "https://pbs.twimg.com/profile_images/848872694833479680/bEzTC-gn.jpg",
            "title": "What's Website Skill ?",
            "text": "a site that provides examples of using this AI vocabulary"
          }
        };
        
        const answer1 = {
          "type": "sticker",
          "packageId": "1",
          "stickerId": "4"
        };
        return client.replyMessage(event.replyToken, [hasana,coba,answer,button,answer1]);
      break;

    case 'show menu':
        menu();
      break;
      
    case 'catatan':
        replyText(event.replyToken,`TEMPAT DOWNLOAD COURSE https://www.salewebdesign.com/ ATAU http://freecoursesonline.us isinya kursus udemy`);
      break
    
    case 'who am i':
      var id = event.source.userId;
      var push = client.getProfile(id).then((profil)=> {
        replyText(event.replyToken,`NAME: ${profil.displayName} \n USER ID: ${profil.userId} \n IMAGE: ${profil.pictureUrl} \n STATUS: ${profil.statusMessage}`);
      })
      break
    
  // IOT AREST CLOUD  
  case 'turn on my lamp':
    request('https://cloud.arest.io/117925/digital/2/1'+key_arest);
    
    const reply_lamp_on = {
          "type": "text",
          "text": "Ayeee.. Captain Febrian, Your Lamp In The Room Was Turn ON !"
        };
    const emoticon_lamp_on = {
          "type": "sticker",
          "packageId": "4",
          "stickerId": acak(601,632)
        };
        return client.replyMessage(event.replyToken, [emoticon_lamp_on,reply_lamp_on]);
    break
    
  case 'turn off my lamp':
    request('https://cloud.arest.io/117925/digital/2/0'+key_arest);
    const reply_lamp_off = {
          "type": "text",
          "text": "Huff...., Your Lamp In The Room Was Turn OFF !"
        };
    const emoticon_lamp_off = {
          "type": "sticker",
          "packageId": "2",
          "stickerId": acak(22,47)
        };
        return client.replyMessage(event.replyToken, [emoticon_lamp_off,reply_lamp_off]);
    break
    
    case 'led on':
    request('https://cloud.arest.io/117925/digital/1/0'+key_arest);
    
    const emoticon_led_on = {
          "type": "sticker",
          "packageId": "4",
          "stickerId": acak(601,632)
        };
        return client.replyMessage(event.replyToken, [emoticon_led_on]);
    break
    
  case 'led off':
    request('https://cloud.arest.io/117925/digital/1/1'+key_arest);
    const emoticon_led_off = {
          "type": "sticker",
          "packageId": "2",
          "stickerId": acak(22,47)
        };
        return client.replyMessage(event.replyToken, [emoticon_led_off]);
    break
    
    
    default: 
}
        
  ///////////
  
  

  
/////// SERVICE BOT DENGAN PIHAK KETIGA/CRAWL/SCRAPING WEBSITE/JSON/REALTIME DATA OBJECT ------------

if (event.message.text.toLowerCase() === "start") {
        request(options1, function(error1, response1, body1) {
          try{
            if (error1) throw new Error(error1);
            // answer fetched from susi
            var ans = (JSON.parse(body1)).answers[0].actions[0].expression;
            const sampleQ = [{
                  type: 'text',
                  text: ans
                },
                {
                  type: 'text',
                  text: 'hey, you can typing word [ show menu ] to send carousel menu in this bot. Try it ...  catatan'
                }]
              return client.replyMessage(event.replyToken, sampleQ);
            
          }catch(e){
            console.log(e);
          return err()
          
          }  
          
          });
  
  //IOT CLOUD AREST
    }else if(event.message.text.toLowerCase() === "check gas sensor"){
    
      request('https://cloud.arest.io/117925/gas'+key_arest, async function(err, res, body) {
      if (!err && res.statusCode == 200) {
       
        var data = await (JSON.parse(body)).variables;
        var status = function(lpg,co,smoke){
          if (lpg >= 100 && co >= 500 && smoke >= 500){
            return "NORMAL";
          }else if(lpg >= 1000 && co >= 2000 && smoke >= 2000){
            return "SIAGA";
          }else if(lpg >= 5000&& co >= 5000 && smoke>= 5000){
            return "BAHAYA";
          }else{
            return "IDLE";
          }
        }
      
          replyText(event.replyToken,`\n LPG : ${data.lpg} ppm \n CO : ${data.co} ppm \n SMOKE : ${data.smoke} ppm \n \n +++STATUS+++ \n FEBRIAN'S ROOM: [ ${status(data.lpg,data.co,data.smoke)} ]`);
      
      }else{
          replyText(event.replyToken,`${err}`);
      
      }
      });
      
//RECOM =========
    }else if(event.message.text.toLowerCase() === "recommendations"){
          request(server.recom,async function(er,req,bo){
        try{
        
          if (er) throw new Error(er);    
            var body=await (JSON.parse(bo).splice(0,10));
            var carousel =await [];
            
            for (var i = 0; i <= 9; i++) {
                var title = await body[i].title;
                var img = await body[i].img;
                var link = await body[i].link;

                 if (title.length >= 53) {
                      title = await title.substring(0, 54);
                      title = await title + "...";
                  }
              
                  carousel[i] = {
                          "thumbnailImageUrl": img,
                          "imageBackgroundColor": "#FFFFFF",
                          "title": "THE MOST WATCHED",
                          "text": title,
                          "defaultAction": {
                                  "type": "uri",
                                  "label": "DOWNLOAD NOW",
                                  "uri": link
                          },
                          "actions": [
                              {
                                  "type": "uri",
                                  "label": "DOWNLOAD NOW",
                                  "uri": link
                              },
                              {
                                  "type": "message",
                                  "label":"RETURN TO MENU",
                                  "text": "show menu"
                              }
                          ]
                        };
              }
          
            const recom = {
                    "type": "template",
                    "altText": "ANIME RECOMMENDED",
                    "template": {
                        "type": "carousel",
                        "columns": [
                                    carousel[0],carousel[1],carousel[2],carousel[3],carousel[4],
                                    carousel[5],carousel[6],carousel[7],carousel[8],carousel[9]
                                   ],
                    "imageAspectRatio": "rectangle",
                    "imageSize": "cover"
                      }
                   }

             return client.replyMessage(event.replyToken,recom);
            }catch(er){
            console.log(er)
              return err()
            }
          })
  
//END RECOM =========  
      
//ANIME =========  
      
    }else if(event.message.text.toLowerCase() === "latest anime today"){
      request(server.nime,async function(er1,req1,bo1){
        try{ 
          if (er1) throw new Error(er1);    
            var body=await (JSON.parse(bo1).splice(1,10));
            var carousel =await [];
          for (var i = 1; i <= 9; i++) {
                var title = await body[i].title;
                var img = await body[i].img;
                var desc = await body[i].desc;
                var link = await body[i].link;

                 if (title.length >= 36) {
                      title = title.substring(0, 37);
                      title = title + "...";
                  }
                 
                  if (desc.length >= 53) {
                      desc = desc.substring(0, 54);
                      desc = desc + "...";
                  }

              carousel[i] = {
                          "thumbnailImageUrl": img,
                          "imageBackgroundColor": "#FFFFFF",
                          "title": title,
                          "text": desc,
                          "defaultAction": {
                                  "type": "uri",
                                  "label": "DOWNLOAD NOW",
                                  "uri": link
                          },
                          "actions": [
                              {
                                  "type": "uri",
                                  "label": "DOWNLOAD NOW",
                                  "uri": link
                              },
                              {
                                  "type": "message",
                                  "label":"RETURN TO MENU",
                                  "text": "show menu"
                              }
                          ]
                        };
              }

            const anime = {
                    "type": "template",
                    "altText": "BATCH ANIME",
                    "template": {
                        "type": "carousel",
                        "columns": [carousel[1],carousel[2],carousel[3],carousel[4],carousel[5],
                                    carousel[6],carousel[7],carousel[8],carousel[9],
                                   {
                                    "thumbnailImageUrl": "https://cdn.onlinewebfonts.com/svg/img_403004.png",
                                    "imageBackgroundColor": "#B0BEC5",
                                    "title": " ",
                                    "text": " ",
                                    "defaultAction": {
                                            "type": "message",
                                            "label": "CLICK HERE",
                                            "text": "more latest anime"
                                    },
                                    "actions": [
                                        {
                                            "type": "message",
                                            "label": "LOAD MORE",
                                            "text": "more latest anime"
                                        },
                                        {
                                            "type": "message",
                                            "label":" ",
                                            "text": " "
                                        }
                                    ]
                                  }
                                   
                                   ],
                        "imageAspectRatio": "rectangle",
                        "imageSize": "cover"
                      }
                   }

        
             return client.replyMessage(event.replyToken,anime);
                           
            }catch(er1){
            console.log(er1)
            return err();
            }
          })       
    
    } else if(event.message.text.toLowerCase() === "more latest anime"){
      request(server.nime,function(er1,req1,bo1){
          if (er1) throw new Error(er1);    
            var body= (JSON.parse(bo1).splice(12,22));
            var carousel = [];
            
          for (var i = 1; i <= 10; i++) {
                var title = body[i].title;
                var img =  body[i].img;
                var desc = body[i].desc;
                var link = body[i].link;

                 if (title.length >= 36) {
                      title = title.substring(0, 37);
                      title = title + "...";
                  }
                 
                  if (desc.length >= 53) {
                      desc = desc.substring(0, 54);
                      desc = desc + "...";
                  }
                    
              carousel[i] = {
                          "thumbnailImageUrl": img,
                          "imageBackgroundColor": "#FFFFFF",
                          "title": title,
                          "text": desc,
                          "defaultAction": {
                                  "type": "uri",
                                  "label": "DOWNLOAD NOW",
                                  "uri": link
                          },
                          "actions": [
                              {
                                  "type": "uri",
                                  "label": "DOWNLOAD NOW",
                                  "uri": link
                              },
                              {
                                  "type": "message",
                                  "label":"RETURN TO MENU",
                                  "text": "show menu"
                              }
                          ]
                        };
              }

            const more_latest = {
                    "type": "template",
                    "altText": "BATCH ANIME",
                    "template": {
                        "type": "carousel",
                        "columns": [carousel[1],carousel[2],carousel[3],carousel[4],carousel[5],
                                    carousel[6],carousel[7],carousel[8],carousel[9],carousel[10]],
                        "imageAspectRatio": "rectangle",
                        "imageSize": "cover"
                      }
                   }

             return client.replyMessage(event.replyToken,more_latest);
            
            })
      
//END ANIME =========  
 
      
      
//UPCOMING =========  
      
    }else if(event.message.text.toLowerCase() === "upcoming anime"){
      request(server.upcoming,async function(er1,req1,bo1){
        try{
        
          if (er1) throw new Error(er1);    
            var body=await (JSON.parse(bo1).splice(0,11));
            var carousel =await [];
            //console.log(body);
          for (var i = 0; i <= 8; i++) {
                var title = await body[i].title;
                var img = await body[i].img;
                var desc = await body[i].data;
                var link = await body[i].link;

                 if (title.length >= 36) {
                      title = title.substring(0, 37);
                      title = title + "...";
                  }
                  if (desc.length >= 53) {
                      desc = desc.substring(0, 54);
                      desc = desc + "...";
                  }

              carousel[i] = {
                          "thumbnailImageUrl": img,
                          "imageBackgroundColor": "#FFFFFF",
                          "title": title,
                          "text": desc,
                          "defaultAction": {
                                  "type": "uri",
                                  "label": "DETAILS",
                                  "uri": link
                          },
                          "actions": [
                              {
                                  "type": "uri",
                                  "label": "DETAILS",
                                  "uri": link
                              },
                              {
                                  "type": "uri",
                                  "label":"WEBSITE",
                                  "uri": "https://myanimelist.net/topanime.php?type=upcoming"
                              }
                          ]
                        };
              }

            const anime = {
                    "type": "template",
                    "altText": "UPCOMING",
                    "template": {
                        "type": "carousel",
                        "columns": [carousel[0],carousel[1],carousel[2],carousel[3],carousel[4],
                                    carousel[5],carousel[6],carousel[7],carousel[8],
                                   {
                                    "thumbnailImageUrl": "https://cdn.onlinewebfonts.com/svg/img_403004.png",
                                    "imageBackgroundColor": "#B0BEC5",
                                    "title": " ",
                                    "text": " ",
                                    "defaultAction": {
                                            "type": "message",
                                            "label": "CLICK HERE",
                                            "text": "more upcoming"
                                    },
                                    "actions": [
                                        {
                                            "type": "message",
                                            "label": "LOAD MORE",
                                            "text": "more upcoming"
                                        },
                                        {
                                            "type": "message",
                                            "label":" ",
                                            "text": " "
                                        }
                                    ]
                                  }
                                   
                                   ],
                        "imageAspectRatio": "rectangle",
                        "imageSize": "cover"
                      }
                   }

        
             return client.replyMessage(event.replyToken,anime);
                           
            }catch(er1){
            console.log(er1)
            return err();
            }
          })       
    
    } else if(event.message.text.toLowerCase() === "more upcoming"){
      request(server.upcoming,function(er1,req1,bo1){
          if (er1) throw new Error(er1);    
            var body= (JSON.parse(bo1).splice(9,21));
            var carousel = [];
            
          for (var i = 0; i <= 9; i++) {
                var title = body[i].title;
                var img =  body[i].img;
                var desc = body[i].data;
                var link = body[i].link;

                 if (title.length >= 36) {
                      title = title.substring(0, 37);
                      title = title + "...";
                  }
            
                if (desc.length >= 53) {
                      desc = desc.substring(0, 54);
                      desc = desc + "...";
                  }
                    
              carousel[i] = {
                          "thumbnailImageUrl": img,
                          "imageBackgroundColor": "#FFFFFF",
                          "title": title,
                          "text": desc,
                          "defaultAction": {
                                  "type": "uri",
                                  "label": "DETAILS",
                                  "uri": link
                          },
                          "actions": [
                              {
                                  "type": "uri",
                                  "label": "DETAILS",
                                  "uri": link
                              },
                              {
                                  "type": "uri",
                                  "label":"WEBSITE",
                                  "uri": "https://myanimelist.net/topanime.php?type=upcoming"
                              }
                          ]
                        };
              }

            const more_upcoming = {
                    "type": "template",
                    "altText": "UPCOMING ANIME",
                    "template": {
                        "type": "carousel",
                        "columns": [carousel[0],carousel[1],carousel[2],carousel[3],carousel[4],
                                    carousel[5],carousel[6],carousel[7],carousel[8],carousel[9]],
                        "imageAspectRatio": "rectangle",
                        "imageSize": "cover"
                      }
                   }

             return client.replyMessage(event.replyToken,more_upcoming);
            
            })
      
//END UPCOMING =========  
       
      

//FREE LEARN UDEMY =========  
            
    }else if(event.message.text.toLowerCase() === "coupon today"){
        request(server.diskon,async function(er1,req1,bo1){
          if (er1) throw new Error(er1);    
            var body= await (JSON.parse(bo1).splice(0,10));
            var carousel = await [];
            
          for (var i = 0; i <= 8; i++) {
                var title = await body[i].title;
                var img =  await body[i].img;
                var coupon = await body[i].coupon;

                 if (title.length >= 53) {
                      title = await title.substring(0, 54);
                      title = await title + "...";
                  }
      
              carousel[i] = {
                          "thumbnailImageUrl": img,
                          "imageBackgroundColor": "#FFFFFF",
                          "title": "LATEST COUPON CODE",
                          "text": title,
                          "defaultAction": {
                                  "type": "uri",
                                  "label": "ENROLL NOW",
                                  "uri": coupon
                          },
                          "actions": [
                              {
                                  "type": "uri",
                                  "label": "ENROLL NOW",
                                  "uri": coupon
                              },
                              {
                                  "type": "message",
                                  "label":"RETURN TO MENU",
                                  "text": "show menu"
                              }
                          ]
                        };
              }

            const udemy = {
                    "type": "template",
                    "altText": "COUPON",
                    "template": {
                        "type": "carousel",
                        "columns": [carousel[0],carousel[1],carousel[2],carousel[3],carousel[4],
                                    carousel[5],carousel[6],carousel[7],carousel[8],
                                   {
                                    "thumbnailImageUrl": "https://cdn.onlinewebfonts.com/svg/img_403004.png",
                                    "imageBackgroundColor": "#B0BEC5",
                                    "title": " ",
                                    "text": " ",
                                    "defaultAction": {
                                            "type": "message",
                                            "label": "CLICK HERE",
                                            "text": "more coupon"
                                    },
                                    "actions": [
                                        {
                                            "type": "message",
                                            "label": "LOAD MORE",
                                            "text": "more coupon"
                                        },
                                        {
                                            "type": "message",
                                            "label":" ",
                                            "text": " "
                                        }
                                    ]
                                  }
                                   ],
                        "imageAspectRatio": "rectangle",
                        "imageSize": "cover"
                      }
                   }

             return client.replyMessage(event.replyToken,udemy);     
           
        })
      
      }else if(event.message.text.toLowerCase() === "more coupon"){
          
       request(server.diskon,async function(er1,req1,bo1){
          if (er1) throw new Error(er1);    
            var body= await (JSON.parse(bo1).splice(8,20));
            var carousel = [];
            
          for (var i = 1; i <= 10; i++) {
                var title = await body[i].title;
                var img =  await body[i].img;
                var coupon = await body[i].coupon;

                 if (title.length >= 53) {
                      title = await title.substring(0, 54);
                      title = await title + "...";
                  }
      
              carousel[i] = {
                          "thumbnailImageUrl": img,
                          "imageBackgroundColor": "#FFFFFF",
                          "title": "LATEST COUPON CODE",
                          "text": title,
                          "defaultAction": {
                                  "type": "uri",
                                  "label": "ENROLL NOW",
                                  "uri": coupon
                          },
                          "actions": [
                              {
                                  "type": "uri",
                                  "label": "ENROLL NOW",
                                  "uri": coupon
                              },
                              {
                                  "type": "message",
                                  "label":"RETURN TO MENU",
                                  "text": "show menu"
                              }
                          ]
                        };
              }

            const more_udemy = {
                    "type": "template",
                    "altText": "COUPON",
                    "template": {
                        "type": "carousel",
                        "columns": [carousel[1],carousel[2],carousel[3],carousel[4],carousel[5],
                                    carousel[6],carousel[7],carousel[8],carousel[9],carousel[10]],
                        "imageAspectRatio": "rectangle",
                        "imageSize": "cover"
                      }
                   }

             return client.replyMessage(event.replyToken,more_udemy);     
           
        })         

//END FREE LEARN UDEMY =========  

//SMARTYBRO UDEMY =========  
                   
    }else if(event.message.text.toLowerCase() === "smartybro today"){
        request(server.free,async function(er1,req1,bo1){
          if (er1) throw new Error(er1);    
            var body= await (JSON.parse(bo1).splice(0,10));
            var carousel = await [];
            
          for (var i = 0; i <= 8; i++) {
                var title = await body[i].title;
                var img =  await body[i].img;
                var coupon = await body[i].coupon;

                 if (title.length >= 53) {
                      title = await title.substring(0, 54);
                      title = await title + "...";
                  }
      
              carousel[i] = {
                          "thumbnailImageUrl": img,
                          "imageBackgroundColor": "#FFFFFF",
                          "title": "LATEST COUPON CODE",
                          "text": title,
                          "defaultAction": {
                                  "type": "uri",
                                  "label": "DETAILS",
                                  "uri": coupon
                          },
                          "actions": [
                              {
                                  "type": "uri",
                                  "label": "DETAILS",
                                  "uri": coupon
                              },
                              {
                                  "type": "message",
                                  "label":"RETURN TO MENU",
                                  "text": "show menu"
                              }
                          ]
                        };
              }

            const smartybro = {
                    "type": "template",
                    "altText": "COUPON",
                    "template": {
                        "type": "carousel",
                        "columns": [carousel[0],carousel[1],carousel[2],carousel[3],carousel[4],
                                    carousel[5],carousel[6],carousel[7],carousel[8],
                                   {
                                    "thumbnailImageUrl": "https://cdn.onlinewebfonts.com/svg/img_403004.png",
                                    "imageBackgroundColor": "#B0BEC5",
                                    "title": " ",
                                    "text": " ",
                                    "defaultAction": {
                                            "type": "message",
                                            "label": "CLICK HERE",
                                            "text": "more coupon"
                                    },
                                    "actions": [
                                        {
                                            "type": "message",
                                            "label": "LOAD MORE",
                                            "text": "more smartybro"
                                        },
                                        {
                                            "type": "message",
                                            "label":" ",
                                            "text": " "
                                        }
                                    ]
                                  }
                                   ],
                        "imageAspectRatio": "rectangle",
                        "imageSize": "cover"
                      }
                   }
          
             return client.replyMessage(event.replyToken,smartybro);     
           
        })
      
      }else if(event.message.text.toLowerCase() === "more smartybro"){
          
       request(server.free,async function(er1,req1,bo1){
          if (er1) throw new Error(er1);    
            var body= await (JSON.parse(bo1).splice(8,20));
            var carousel = await [];

// index terakhir sebelumnya  8 jadi dibuat 8 pada splicenya index 0 pd body dan untuk loop di mulai dari 1 jadi index awal dimulai dari angka 9

         for (var i = 1; i <= 10; i++) { 
                var title = await body[i].title;
                var img =  await body[i].img;
                var coupon = await body[i].coupon;

                 if (title.length >= 53) {
                      title = await title.substring(0, 54);
                      title = await title + "...";
                  }
      
              carousel[i] = {
                          "thumbnailImageUrl": img,
                          "imageBackgroundColor": "#FFFFFF",
                          "title": "LATEST COUPON CODE",
                          "text": title,
                          "defaultAction": {
                                  "type": "uri",
                                  "label": "DETAILS",
                                  "uri": coupon
                          },
                          "actions": [
                              {
                                  "type": "uri",
                                  "label": "DETAILS",
                                  "uri": coupon
                              },
                              {
                                  "type": "message",
                                  "label":"RETURN TO MENU",
                                  "text": "show menu"
                              }
                          ]
                        };
              }

            const more_smartybro = {
                    "type": "template",
                    "altText": "COUPON",
                    "template": {
                        "type": "carousel",
                        "columns": [carousel[1],carousel[2],carousel[3],carousel[4],carousel[5],
                                    carousel[6],carousel[7],carousel[8],carousel[9],carousel[10]],
                        "imageAspectRatio": "rectangle",
                        "imageSize": "cover"
                      }
                   }

             return client.replyMessage(event.replyToken,more_smartybro);     
           
        })      

//END SMARTYBRO UDEMY =========  
  
// EBOOK GOALKICKER =========  
  
    }else if(event.message.text.toLowerCase() === "latest ebook"){
      request(server.ebook,async function(er1,req1,bo1){
        try{
          if (er1) throw new Error(er1);
            var body= await (JSON.parse(bo1).splice(acak(1,30),acak(31,48)).reverse())
            var carousel = await [];
          for (var i = 1; i <= 11; i++) {
                var title = await body[i].title;
                var img = await body[i].img;
                var link = await body[i].link;

                 if (title.length >= 53) {
                      title = await title.substring(0, 54);
                      title = await title + "...";
                  }
      
              carousel[i] = {
                          "thumbnailImageUrl": img,
                          "imageBackgroundColor": "#FFFFFF",
                          "title": "EBOOK REFERENCE",
                          "text": title,
                          "defaultAction": {
                                  "type": "uri",
                                  "label": "DETAILS",
                                  "uri": link
                          },
                          "actions": [
                              {
                                  "type": "uri",
                                  "label": "DETAILS",
                                  "uri": link
                              },
                              {
                                  "type": "uri",
                                  "label":"WEBSITE",
                                  "uri": "https://goalkicker.com"
                              }
                          ]
                        };
              }

            const latest_ebook = {
                    "type": "template",
                    "altText": "GOALKICKER",
                    "template": {
                        "type": "carousel",
                        "columns": [carousel[1],carousel[2],carousel[3],carousel[4],carousel[5],
                                    carousel[6],carousel[7],carousel[8],carousel[9],carousel[10]],
                        "imageAspectRatio": "rectangle",
                        "imageSize": "cover"
                      }
                   }

            return client.replyMessage(event.replyToken,latest_ebook); 
          
            }catch(e){
            console.log(e);
              return err()
            }
        })

// END EBOOK GOALKICKER =========  

      

// SERVICE SUSI.AI =========  
            
    }else{
        request(options1, async function(error1, response1, body1) {
        if (error1) throw new Error(error1);
          try {
            // answer fetched from susi
            var type = await (JSON.parse(body1)).answers[0].actions;
            var ans = await (JSON.parse(body1)).answers[0].actions[0].expression;
            
            if (((JSON.parse(body1)).answers[0].data[0].lon) || ((JSON.parse(body1)).answers[0].data[0].lat) ) {
                var lat = await JSON.parse(body1).answers[0].data[0].lat;
                var lon = await JSON.parse(body1).answers[0].data[0].lon;
                var address = await JSON.parse(body1).answers[0].data[0].locationInfo;
                var title = await JSON.parse(body1).answers[0].data[0][1]; //nunggu sampai janjinya ditepati kalau gak ya dilempar ke catch :'(
                
                const answer = {
                    type: "location",
                    title: title,
                    address: title,
                    latitude: lat,
                    longitude: lon
                };
                // use reply API
                return client.replyMessage(event.replyToken, answer)
                .catch((err) => {
                    console.log('Error - '+err);
                });   
            }else if (JSON.parse(body1).answers[0].data[0].type === 'gif') {
                let videoUrl = await JSON.parse(body1).answers[0].data[0].v1.original.mp4;
                let previewUrl = await JSON.parse(body1).answers[0].data[0].images["480w_still"].url;
                const answer = {
                    type: 'video',
                    originalContentUrl: videoUrl,
                    previewImageUrl: previewUrl
                };
                // use reply API
                return client.replyMessage(event.replyToken, answer)
                .catch((err) => {
                    console.log('Error - '+err);
                });
            } else if (type.length == 1 && type[0].type == "answer") {
                let answer;
                if((JSON.parse(body1)).answers[0].data[0].type === 'photo'){
                    answer = {
                        type: 'image',
                        originalContentUrl: ans,
                        previewImageUrl: ans
                    };
                } else {
                    answer = {
                        type: 'text',
                        text: ans
                    };
                }
                // use reply API
                return client.replyMessage(event.replyToken, answer);

            } else if (type[0].type == "table") {
                var data = await JSON.parse(body1).answers[0].data;
                var columns = await type[0].columns;
                var key = await Object.keys(columns);
                var msg = [];
                console.log(key);

                for (var i = 0; i < 5; i++) {
                    msg[i] = "";
                    msg[i] = {
                        type: 'text',
                        text: key[0].toUpperCase() + ": " + data[i][key[0]] + "\n" + key[1].toUpperCase() + ": " + data[i][key[1]] + "\n" + key[2].toUpperCase() + ": " + data[i][key[2]]
                    }
                }
                return client.replyMessage(event.replyToken, msg);

            } else if (type.length == 2 && type[1].type == "rss") {
                var data = JSON.parse(body1).answers[0].data;
                var columns = type[1];
                var key = Object.keys(columns);
                var msg, title, link, query;
                var carousel = [];
                console.log(key);

                for (var i = 1; i < 4; i++) {
                    title = key[1].toUpperCase() + ": " + data[i][key[1]];
                    query = title;
                    msg = key[2].toUpperCase() + ": " + data[i][key[2]];
                    link = data[i][key[3]]
                    if (title.length >= 40) {
                        title = title.substring(0, 36);
                        title = title + "...";
                    }

                    if (msg.length >= 60) {
                        msg = msg.substring(0, 56);
                        msg = msg + "...";
                    }

                    carousel[i] = {
                        "title": title,
                        "text": msg,
                        "actions": [{
                                "type": "uri",
                                "label": "View detail",
                                "uri": link
                            },
                            {
                                "type": "message",
                                "label": "Ask hasana again",
                                "text": query
                            }
                        ]
                    };
                }
                const answer = [{
                        type: 'text',
                        text: ans
                    },
                    {
                        "type": "template",
                        "altText": "Web Search", // (XX) gagal parsing websearch , search for dog tampil duckduckgo carousel. sama lokasi gagal. ntar aja
                        "template": {
                            "type": "carousel",
                            "columns": [
                                carousel[1],
                                carousel[2],
                                carousel[3]
                            ]
                        }
                    }
                ]
                return client.replyMessage(event.replyToken, answer);
            }
            
          }catch(e){ // handle error undefined callback
              console.log(e);
            return err()
          }
          
        })      
    }
  
// END SERVICE SUSI.AI =========  
      
}

// listen on port
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`serve port ${port}`);
});