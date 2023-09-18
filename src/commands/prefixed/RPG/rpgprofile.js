import fs from "fs";
import { fileURLToPath } from 'url';
import path from 'path'
import { prefix, name_bot } from '../../../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileName = path.basename(__filename).split('.')[0];

export const setup = {
    permission: 0, // All permission: 0 = all, 1 = owner, 2 = onwer, admin group
    group_required: false, // if true command only work on group
  };
  
  export const helping = {
    text: "Menampilkan profil RPG",
    use: `${prefix[0]}${fileName}`
  }
  
  export async function run(ctx, obj) {

    const ppUrl = await ctx.profilePictureUrl(obj.sender.id, 'image')

    let equipmentData;
    try {
        const rawData = fs.readFileSync('database/equipmentRpg.json');
        equipmentData = JSON.parse(rawData);
    } catch (error) {
      console.error('Error read JSON file:', error);
      return;
    }

    fs.readFile('database/userRpg.json', 'utf8', (error, user) => {
      if (error) {
          console.error('Error reading JSON file:', error);
          return;
      }
  
      const userData = JSON.parse(user);
      let userHp = 0
      let userMaxHp = 0
      let userDamage = 0

      let itemCount = 0;
  
      const userRpg = userData.find(user => user.id === obj.sender.id)

      const playerEquipment = equipmentData.find(player => player.id === obj.sender.id);

      if (userRpg) {
        

        for (const item of playerEquipment.equipment){
          if (item.use == true) {
            userDamage += item.power || 0
          }
        }

        userHp += userRpg.hp
        userMaxHp += userRpg.max_hp
        userDamage += userRpg.damage

        let teks = `╓─── RPG profil\n`
        teks += `║ \n`
        teks += `║ Tittle : ${userRpg.title}\n`
        teks += `║ Level : ${userRpg.level}\n`
        teks += `║ XP Level : ${userRpg.xp_level}/${2000 * userRpg.level}\n`
        teks += `║ Gold : ${userRpg.gold}\n`
        teks += `║ \n`
        teks += `╟─── RPG stats\n`
        teks += `║ Hp : ${userHp}/${userMaxHp}\n`
        teks += `║ Damage : ${userDamage}\n`
        teks += `║ \n`
        teks += `╟─── List item dipakai\n`
        teks += `║ \n`

        for (const item of playerEquipment.equipment){
          if (item.use == true) {
            itemCount++;
   
            teks += `║ ${itemCount}. *${item.name}*\n`
            teks += `║ Id : ${item.id}\n`
            teks += `║ \n`
          }
        }
        
        teks += `╙────────────`
  
        return ctx.sendMessage(
          obj.room.id, 
          { text: teks },
          { quoted: obj.message.rawkey }
        )

        return ctx.sendMessage(
          obj.room.id, 
          {
            image: {url:ppUrl},
            caption: teks
          },
          { quoted: obj.message.rawkey }
        )

      }else {
        let teks = 'Belum terdaftar di fitur RPG silakan ketik #rpg untuk mengaktifkan fitur RPG'
  
        return ctx.sendMessage(
          obj.room.id, 
          { text: teks },
          { quoted: obj.message.rawkey }
        )
      }
      
    })
  }
  