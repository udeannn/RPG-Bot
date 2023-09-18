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
    text: "Melihat informasi perlengkapan",
    use: `${prefix[0]}${fileName} *IdItem*`
  }
  
  export async function run(ctx, obj) {
    let userData;
    try {
        const rawData = fs.readFileSync('database/userRpg.json');
        userData = JSON.parse(rawData);
    } catch (error) {
      console.error('Error read JSON file:', error);
      return;
    }

    const user = userData.find((data) => data.id === obj.sender.id)

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

    if (!splitMessage[1]) {
        return ctx.sendMessage(
            obj.room.id, 
            { text: 'Harap masukkan id item kamu bisa melihatnya di *#inventory*' },
            { quoted: obj.message.rawkey}
        );
    }

    fs.readFile('database/equipmentRpg.json', 'utf8', (error, equipment) => {
        if (error) {
            console.error('Error reading JSON file:', error);
            return;
        }
        try {
          const equipmentData = JSON.parse(equipment);
  
          const playerEquipment = equipmentData.find(player => player.id === obj.sender.id);
          if (!playerEquipment) {
            return ctx.sendMessage(
              obj.room.id, 
              { text: 'Player tidak ditemukan' },
              { quoted: obj.message.rawkey}
            );
          }
  
          const item = playerEquipment.equipment.find(equip => equip.id == splitMessage[1]);
  
          if (item) {
            const keyMapping = {
                "id": "ID",
                "name": "Nama",
                "type": "Tipe",
                "rarity": "Rarity",
                "use": "Digunakan",
                "level": "Level",
                "hp": "HP",
                "defense": "Defense",
                "power": "Damage",
                "crit_damage": "Damage Crit",
                "additional_stat": "Stat Tambahan",
              };

            let teks = '╓─── Item\n'
            teks += `║ \n`
            for (const key in item) {
                if (Object.hasOwnProperty.call(item, key)) {
                    const value = item[key];
                    let formattedValue = value;
              
                    if (key === "use" && value === false) {
                        formattedValue = "Tidak";
                    } 
                    if (key === "use" && value === true) {
                        formattedValue = "Ya";
                    } 
              
                    const mappedKey = keyMapping[key] || key; 
                    teks += `║ ${mappedKey}: ${formattedValue}\n`;
                  }
            }
            teks += `║ \n`
            teks += `╙────────────`

            return ctx.sendMessage(
                obj.room.id, 
                { text: teks },
                { quoted: obj.message.rawkey}
            )
          } else {
            ctx.sendMessage(
              obj.room.id, 
              { text: 'Item tidak ditemukan' },
              { quoted: obj.message.rawkey}
            );
          }
      
        } catch (error) {
          console.error('Error parsing user JSON data:', error);
        }
      })
  }
  