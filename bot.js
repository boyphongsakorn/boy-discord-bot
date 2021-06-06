const Discord = require('discord.js');
const DS = require("discord-slash-commands-client");
const cron = require("cron");
const fetch = require('node-fetch');
const request = require('request');
var fs = require('fs');
//const https = require('https');
const urlExistSync = require("url-exist-sync");
var http = require('http');

require('dotenv').config();

//const client = new Discord.Client({fetchAllMembers: true}); only for get all server and member
const client = new Discord.Client();

const DSclient = new DS.Client(
    process.env.BOT_TOKEN,
    "691610557156950030"
);

// functions

function padLeadingZeros(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

// end functions

//create a server object:
http.createServer(function (req, res) {
    res.write('Hello World!'); //write a response to the client
    res.end(); //end the response
}).listen(8080); //the server object listens on port 8080

client.once('ready', () => {
	client.user.setPresence({ activity: { name: 'use /fthlotto to follow thai lottery' }, status: 'online' });

	console.log('I am ready!');

    client.users.fetch('133439202556641280').then(dm => {
        dm.send('Bot เริ่มต้นการทำงานแล้ว')
    });

    try {
        //console.log(fs.statSync("out.log").size)
        if(fs.statSync("out.log").size > 1000000000){
            fs.unlink("out.log", function (err) {
                if (err) throw err;
                // if no error, file has been deleted successfully
                console.log('File deleted!');
            });
        }
    } catch (error) {
        
    }

    /*client.guilds.cache.forEach(guild => {
        console.log(`${guild.name} | ${guild.id}`);
        const list = client.guilds.cache.get(guild.id);
        list.members.cache.forEach(member => console.log(member.user.username));
    })*/
});

client.on("guildCreate", guild => {

    console.log("Joined a new guild: " + guild.id);
	
	client.users.fetch('133439202556641280').then(dm => {
        dm.send('ดิส '+guild.name+'('+guild.id+') ได้เชิญ บอท PWisetthon.com เข้าเรียบร้อยแล้ว')
    });

    if(guild.systemChannelID != null) {
        console.log("System Channel: "+ guild.systemChannelID);
        
        var options = {
            'method': 'GET',
            'url': process.env.URL+'/discordbot/addchannels.php?chid='+guild.systemChannelID,
            'headers': {
            }
        };

        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
            if(response.body == "debug"){
                client.channels.cache.get(guild.systemChannelID).send('ขอบคุณ! ที่เชิญเราเข้าส่วนหนึ่งในดิสของคุณ')
                .catch(console.error);
            }else{
                client.channels.cache.get(guild.systemChannelID).send('ขอบคุณ! ที่เชิญเราเข้าเป็นส่วนร่วมของดิสคุณ เราได้ทำการติดตามสลากฯให้สำหรับดิสนี้เรียบร้อยแล้ว! \nใช้คำสั่ง /cthlotto เพื่อยกเลิก')
                .catch(console.error);
            }
        });
    }

    DSclient
    .createCommand({
        name: "fthlotto",
        description: "แจ้งเตือนสลากกินแบ่งรัฐบาลเวลาสี่โมงเย็นของวันทึ่ออก",
    },guild.id)
    .then(console.log)
    .catch(console.error);

    DSclient
    .createCommand({
        name: "cthlotto",
        description: "ยกเลิกแจ้งเตือนสลากกินแบ่งรัฐบาลของแชนแนลนี้",
    },guild.id)
    .then(console.log)
    .catch(console.error);
})

// datedata

let date = new Date().getDate();
let month = new Date().getMonth()+1;
let year = new Date().getFullYear()+543;

let monthtext

date = padLeadingZeros(date, 2);
month = padLeadingZeros(month, 2);
year = padLeadingZeros(year, 4);

switch(month){
    case '01' : monthtext="มกราคม"; break;
    case '02' : monthtext="กุมภาพันธ์"; break;
    case '03' : monthtext="มีนาคม"; break;
    case '04' : monthtext="เมษายน"; break;
    case '05' : monthtext="พฤษภาคม"; break;
    case '06' : monthtext="มิถุนายน"; break;
    case '07' : monthtext="กรกฎาคม"; break;
    case '08' : monthtext="สิงหาคม"; break;
    case '09' : monthtext="กันยายน"; break;
    case '10' : monthtext="ตุลาคม"; break;
    case '11' : monthtext="พฤศจิกายน"; break;
    case '12' : monthtext="ธันวาคม"; break;
}

// end datedata

let scheduledMessage = new cron.CronJob('*/5 * 15-17 * * *', () => {

    let url = "https://thai-lottery1.p.rapidapi.com/?date="+date+""+month+""+year+"&fresh";

    //let url = "https://lottsanook.vercel.app/api/?date="+date+""+month+""+year+"&fresh";

    let settings = {"method": "GET", "headers": { "x-rapidapi-key": "c34ed3c573mshbdf38eb6814e7a7p1e0eedjsnab10f5aef137", "x-rapidapi-host": "thai-lottery1.p.rapidapi.com"}};

    //let settings = { method: "Get" };

    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        console.log(json.length)
        if (json.length == 7 || json.length == 8 || json.length == 9) {
            if (json[0][1] == "0" || json[0][1] == 0 || json[0][1] == "xxxxxx" || json[0][1] == "XXXXXX") {

                /*client.users.fetch('133439202556641280').then(dm => {
                    dm.send('Bot ทำงานปกติและเช็คได้ว่าวันนี้หวยไม่ได้ออกหรือหวยยังออกไม่หมด')
                })*/

                if (json[0][1] == "xxxxxx" || json[0][1] == "XXXXXX") {
                    console.log('Bot ทำงานปกติและเช็คได้ว่าวันนี้หวยออกแต่ยังออกไม่หมด');

                    console.log('--------------------------------');
                } else {
                    console.log('Bot ทำงานปกติและเช็คได้ว่าวันนี้หวยไม่ได้ออก');

                    console.log('--------------------------------');
                }

                var fileContents = null;
                try {
                    fileContents = fs.readFileSync('check.txt');
                } catch (err) {

                }

                if (fileContents) {
                    if (fileContents != 0) {
                        fs.writeFile('check.txt', '0', function (err) {
                            if (err) {
                                throw err
                            };
                            console.log('Saved!');
                        });
                    }
                } else {
                    fs.writeFile('check.txt', '0', function (err) {
                        if (err) {
                            throw err
                        };
                        console.log('Saved!');
                    });
                }
                /*fs.readFile('check.txt', function(err, data) {
                    if(data != "0"){
                        fs.writeFile('check.txt', '0', function (err) {
                            if (err){
                                throw err
                            };
                            console.log('Saved!');
                        });
                    }
                });*/

            } else {

                let imgurl = 'https://boy-discord-bot.herokuapp.com/?date=';

                console.log("หวยออกครบแล้ว")

                var fileContents = null;
                try {
                    fileContents = fs.readFileSync('check.txt');
                } catch (err) {

                }

                if (fileContents) {
                    if (fileContents != "1") {
                        fs.writeFile('check.txt', '1', function (err) {
                            if (err) {
                                throw err
                            };
                            console.log('Saved!');
                        });

                        if (urlExistSync("https://lotimg.pwisetthon.com/?date=" + date + '' + month + '' + year)) {
                            imgurl = 'https://lotimg.pwisetthon.com/?date=';
                        }

                        const msg = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle('ผลสลากกินแบ่งรัฐบาล')
                            .setURL('https://www.glo.or.th/')
                            //.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
                            .setDescription('งวดวันที่ ' + new Date().getDate() + ' ' + monthtext + ' ' + year)
                            .setThumbnail('https://www.glo.or.th/_nuxt/img/img_sbout_lottery_logo.2eff707.png')
                            .addFields(
                                { name: 'รางวัลที่หนึ่ง', value: json[0][1] },
                                //{ name: '\u200B', value: '\u200B' },
                                { name: 'เลขหน้าสามตัว', value: json[1][1] + ' | ' + json[1][2], inline: true },
                                { name: 'เลขท้ายสามตัว', value: json[2][1] + ' | ' + json[2][2], inline: true },
                                { name: 'เลขท้ายสองตัว', value: json[3][1] },
                            )
                            //.addField('เลขท้ายสองตัว', json[3][1], true)
                            //.attachFiles(['today.png'])
                            //.setImage('attachment://today.png')
                            //.setImage(process.env.URL+'/tmpimage/'+date+''+month+''+year+'.png')
                            .setImage(imgurl + '' + date + '' + month + '' + year)
                            .setTimestamp()
                            .setFooter('ข้อมูลจาก github.com/Quad-B/lottsanook \nบอทจัดทำโดย Phongsakorn Wisetthon \nซื้อกาแฟให้ผม ko-fi.com/boyphongsakorn');

                        fetch(process.env.URL + "/discordbot/chlist.txt", settings)
                            .then(res => res.json())
                            .then((json) => {

                                for (i in json) {
                                    client.channels.cache.get(json[i]).send(msg)
                                        .then((log) => {
                                            console.log(log);
                                        })
                                        .catch((error) => {
                                            console.error(error);
                                            client.users.fetch('133439202556641280').then(dm => {
                                                dm.send('Bot ไม่สามารถส่งข้อความไปยังแชทแนว ' + json[i] + ' ได้เนี่องจาก ' + error)
                                            })
                                        });
                                }

                            });
                    }
                }

            }
        }

    });

});
  
// When you want to start it, use:
scheduledMessage.start()
// You could also make a command to pause and resume the job

client.on('message', message => {
});

client.ws.on('INTERACTION_CREATE', async (interaction) => {
    const command = interaction.data.name.toLowerCase();

    if (command === 'fthlotto') {
        var options = {
            'method': 'GET',
            'url': process.env.URL+'/discordbot/addchannels.php?chid='+interaction.channel_id,
            'headers': {
            }
        };

        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
            if(response.body == "debug"){
                reply(interaction, 'ห้องนี้ติดตามสลากฯอยู่แล้ว')
            }else{
                reply(interaction, 'ติดตามสลากฯในห้องนี้เสร็จเรียบร้อย')
            }
        });
    }

    if (command === 'cthlotto') {
        var options = {
            'method': 'GET',
            'url': process.env.URL+'/discordbot/delchannels.php?chid='+interaction.channel_id,
            'headers': {
            }
        };

        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
            reply(interaction, 'ยกเลิกการติดตามสลากฯในห้องนี้เสร็จเรียบร้อย')
        });
    }
})

const reply = (interaction, response) => {
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4, 
            data: {
                content: response,
            }
        }
    })
}

client.login(process.env.BOT_TOKEN);