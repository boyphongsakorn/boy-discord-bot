const Discord = require('discord.js');

const client = new Discord.Client();
//const member = new Discord.GuildMember(client,);

client.on('ready', () => {

    console.log('I am ready!');

    client.user.setStatus('online')
    client.user.setPresence({
        game: {
            name: 'Use f!help',
            type: "Playing",
            url: ""
        }
    });

    //client.user.setPresence({ activity: { name: 'with discord.js' }, status: 'idle' })
    //.then(console.log)
    //.catch(console.error);

    //client.user.setPresence({ game: { name: 'with depression', type: "playing" }}); 

    //client.user.setStatus('online');

    //client.user.setActivity('Minecraft is The Best');

    //client.user.setActivity('discord.js', { type: 'WATCHING' })
    //.then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
    //.catch(console.error);

    //client.user.setActivity('Use f!help.');

    //client.bot.user.setPresence({ activity: { name: 'with discord.js' }, status: 'online' });
    //.then(console.log)
    //.catch(console.error);
});

client.on('message', message => {

    if (message.content === 'มาเล่นเกมกัน') {

       message.reply('อย่าเหลี่ยมล่ะกันน้าาาา');

       //member.kick("สวัสดีครับ");

    }else if (message.content === 'ทำอะไรกันอยู่' || message.content === 'ทำอะไรกัน') {

        message.reply('มีตาดูไหม ฮัลโหล')
        .then(msg => {
            msg.delete(10000);
            message.delete(20000);
        })
        .catch("Error ว่ะ");
 
        //member.kick("สวัสดีครับ");
 
    }else if (message.content === 'แลค') {

        message.reply('แพ็กเกจอินเทอร์เน็ตบ้าน #3BB #GIGATainment #1Gbps พร้อมความบันเทิงระดับ World Class จาก #HBOGO \n สมัครได้แล้ววันนี้ที่ 3BB Shop ทั่วประเทศ โทร.1530 หรือเปลี่ยนแพ็กเกจ ผ่านแอปฯ 3BB Member');
 
        //member.kick("สวัสดีครับ");
 
    }else if (message.content === 'ส้นตีน') {

        message.reply(':foot:')
        .then(msg => {
            msg.delete(10000);
            message.delete(20000);
        })
        .catch("Error ว่ะ");

    }else if (message.content === 'หี'){

        message.reply('(|)')
        .then(msg => {
            msg.delete(10000);
            message.delete(20000);
        })
        .catch('Error ว่ะ');

    }

});

// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);//BOT_TOKEN is the Client Secret
