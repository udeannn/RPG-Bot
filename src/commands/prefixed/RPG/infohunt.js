import fs from 'fs'
import { fileURLToPath } from 'url';
import path from 'path'
import { prefix } from '../../../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileName = path.basename(__filename).split('.')[0];

export const setup = {
    permission: 0, // All permission: 0 = all, 1 = owner, 2 = onwer, admin group
    group_required: false, // if true command only work on group
  };
  
  export const helping = {
    text: "Melihat informasi hunt",
    use: `${prefix[0]}${fileName} 1-30`
  }
  
  export async function run(ctx, obj) {
    let userData;
    try {
        const rawData = fs.readFileSync('database/userRpg.json');
        userData = JSON.parse(rawData);
    } catch (error) {
        console.error('Error reading enemy data:', error);
        return ctx.sendMessage(
            obj.room.id,
            { text: 'Error reading enemy data' },
            { quoted: obj.message.rawkey }
        );
    }

    const user = userData.find((data) => data.id === obj.sender.id)

    if (!user) {
        let teks = 'Belum terdaftar di fitur RPG silakan ketik #rpg untuk mengaktifkan fitur RPG'
  
        return ctx.sendMessage(
          obj.room.id, 
          { text: teks }
        )
    }

    let loginData;
    try {
        const rawData = fs.readFileSync('database/login.json');
        loginData = JSON.parse(rawData);
    } catch (error) {
        console.error('Error reading login data:', error);
        return ctx.sendMessage(
            obj.room.id,
            { text: 'Error reading login data' },
            { quoted: obj.message.rawkey }
        );
    }
  
    const existsLogin = loginData.includes(obj.sender.id);
    if (!existsLogin) {
        return ctx.sendMessage(
            obj.room.id, 
            { text: 'Kamu belum login' },
            { quoted: obj.message.rawkey}
        )
    }

    let enemyData;
    try {
        const rawData = fs.readFileSync('database/huntRpg.json');
        enemyData = JSON.parse(rawData);
    } catch (error) {
        console.error('Error reading enemy data:', error);
        return ctx.sendMessage(
            obj.room.id,
            { text: 'Error reading enemy data' },
            { quoted: obj.message.rawkey }
        );
    }

    const m = obj.message.text.toLowerCase()
    const splitMessage = m.split(' ')

    if (!splitMessage[1]) {
        return ctx.sendMessage(
            obj.room.id,
            { text: 'Silakan pilih lantai 1-30' },
            { quoted: obj.message.rawkey }
        );
    }

    const floor = parseInt(splitMessage[1]);

    const enemy = enemyData.find((data) => data.floor === floor)

    if (enemy) {

        let teks = '╓─── Info Hunt\n'
        teks += `║ \n`
        teks += `║ Lantai : ${ enemy.floor }\n`
        teks += `║ Monster : ${ enemy.enemy }\n`
        teks += `║ Lokasi : ${ enemy.location }\n`
        teks += `║ HP : ${ enemy.hp }\n`
        teks += `║ Defense : ${ enemy.defense }\n`
        teks += `║ Damage : ${ enemy.damage }\n`
        teks += `║ \n`
        teks += `╙────────────`

        await ctx.sendMessage(
            obj.room.id,
            { text: teks },
            { quoted: obj.message.rawkey }
        );
    } else {
        return ctx.sendMessage(
            obj.room.id,
            { text: 'Lantai tidak ditemukan' },
            { quoted: obj.message.rawkey }
        )
    }

    
  }
  