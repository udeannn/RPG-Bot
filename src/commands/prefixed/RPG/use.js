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
    text: "Memakai item komsumsi",
    use: `${prefix[0]}${fileName} *potionName*`
  }
  
  export async function run(ctx, obj) {
    let equipmentData;
    try {
        const rawData = fs.readFileSync('database/equipmentRpg.json');
        equipmentData = JSON.parse(rawData);
    } catch (error) {
      console.error('Error read JSON file:', error);
      return;
    }

    let userData;
    try {
        const rawData = fs.readFileSync('database/userRpg.json');
        userData = JSON.parse(rawData);
    } catch (error) {
      console.error('Error read JSON file:', error);
      return;
    }

    const user = userData.find((data) => data.id === obj.sender.id)

    const playerEquipment = equipmentData.find(player => player.id === obj.sender.id);

    if (!user) {
        let teks = 'Belum terdaftar di fitur RPG silakan ketik #rpg untuk mengaktifkan fitur RPG'
        return ctx.sendMessage(
            obj.room.id, 
            { text: teks },
            { quoted: obj.message.rawkey}
        )
    }

    const m = obj.message.text.toLowerCase()
    const splitMessage = m.split(' ')

    if (splitMessage[1] == 'potion') {   
        if (user.hp == user.max_hp) {
          return ctx.sendMessage(
            obj.room.id,
            { text: 'HP sudah penuh tidak bisa menggunakan item' },
            { quoted: obj.message.rawkey }
          );
        }    

        let hpRegend = user.hp + 500;

        if (hpRegend <= user.max_hp) {
            user.hp = hpRegend;
        } else {
            user.hp = user.max_hp;
        }

        user.potion -= 1;

        let teks = 'Menggunakan 1 potion untuk memulihkan 500 HP'
        await ctx.sendMessage(
            obj.room.id,
            { text: teks },
            { quoted: obj.message.rawkey }
        );

        const updatedUserData = userData.map((data) => {
            if (data.id === obj.sender.id) {
                return user;
            }
            return data;
        });

        fs.writeFileSync('database/userRpg.json', JSON.stringify(updatedUserData, null, 4));

    } else {
        let teks = 'Item tidak ditemukan'
        return ctx.sendMessage(
            obj.room.id, 
            { text: teks },
            { quoted: obj.message.rawkey}
        )
    }
  }