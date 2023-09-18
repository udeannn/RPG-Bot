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
    text: "Memakai perlengkapan tempur",
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
  
    const user = userData.find((data) => data.id === obj.sender.id);
  
    if (!user) {
      let teks = 'Belum terdaftar di fitur RPG silakan ketik #rpg untuk mengaktifkan fitur RPG';
      return ctx.sendMessage(obj.room.id, { text: teks }, { quoted: obj.message.rawkey });
    }
  
    const m = obj.message.text.toLowerCase();
    const splitMessage = m.split(' ');
  
    fs.readFile('database/equipmentRpg.json', 'utf8', (error, equipment) => {
      if (error) {
        console.error('Error reading JSON file:', error);
        return;
      }
      try {
        const equipmentData = JSON.parse(equipment);
  
        const playerEquipment = equipmentData.find((player) => player.id === obj.sender.id);
        if (!playerEquipment) {
          return ctx.sendMessage(obj.room.id, { text: 'Player tidak ditemukan' }, { quoted: obj.message.rawkey });
        }
  
        const itemToUse = playerEquipment.equipment.find((equip) => equip.id == splitMessage[1]);
        if (!itemToUse) {
          return ctx.sendMessage(obj.room.id, { text: 'Item tidak ditemukan' }, { quoted: obj.message.rawkey });
        }
  
        playerEquipment.equipment.forEach((equip) => {
          if (equip.type === itemToUse.type) {
            equip.use = false;
          }
        });
  
        if (!itemToUse.use) {
          user.max_hp += itemToUse.hp ?? 0;
  
          const updatedUserData = userData.map((data) => {
            if (data.id === obj.sender.id) {
              return user;
            }
            return data;
          });
  
          fs.writeFileSync('database/userRpg.json', JSON.stringify(updatedUserData, null, 4));
  
          itemToUse.use = true;
          fs.writeFile('database/equipmentRpg.json', JSON.stringify(equipmentData, null, 2), 'utf8', (err) => {
            if (err) {
              console.error('Error writing JSON data:', err);
            } else {
              ctx.sendMessage(obj.room.id, { text: 'Item telah digunakan' }, { quoted: obj.message.rawkey });
            }
          });
        } else {
          ctx.sendMessage(obj.room.id, { text: 'Item sudah digunakan' }, { quoted: obj.message.rawkey });
        }
      } catch (error) {
        console.error('Error parsing user JSON data:', error);
      }
    });
  }
  
  