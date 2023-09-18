import fs from "fs";
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
  text: "Melakukan login RPG",
  use: `${prefix[0]}${fileName}`
}

export async function run(ctx, obj) {

  fs.readFile('database/userRpg.json', 'utf8', (error, inven) => {
    if (error) {
        console.error('Error reading JSON file:', error);
        return;
    }

    try {
      const invenData = JSON.parse(inven);

      const existingIndex = invenData.findIndex(inven => inven.id === obj.sender.id);

      if (existingIndex !== -1) {
        fs.readFile('database/login.json', 'utf8', (err, data) => {
          if (err) {
            console.error('Error reading JSON file:', err);
            return;
          }
    
          try {
            const existingData = JSON.parse(data);
    
            const exists = existingData.includes(obj.sender.id);
    
            if (exists) {
              return ctx.sendMessage(
                obj.room.id, 
                { text: 'Kamu sudah melakukan login' },
                { quoted: obj.message.rawkey}
              )
            } else {
              existingData.push(obj.sender.id);
    
              fs.writeFile('database/login.json', JSON.stringify(existingData, null, 2), 'utf8', (err) => {
                if (err) {
                  console.error('Error writing JSON data:', err);
                } else {
                  invenData[existingIndex].gold += 6000;
                  invenData[existingIndex].iron += 2;
                  invenData[existingIndex].potion += 1;
                  invenData[existingIndex].hp = invenData[existingIndex].max_hp;

                  fs.writeFile('database/userRpg.json', JSON.stringify(invenData, null, 2), 'utf8', (err) => {
                    if (err) {
                      console.error('Error writing JSON data:', err);
                      return;
                    }
                  })

                  let teks = '╓─── Berhasil Login\n'
                  teks += `║ \n`
                  teks += `║ Selamat kamu mendapatkan :\n`
                  teks += `║ Gold : 6000\n`
                  teks += `║ Iron : 2\n`
                  teks += `║ Potion : 1\n`
                  teks += `║ Reset HP\n`
                  teks += `║ \n`
                  teks += `╙────────────`
    
                  return ctx.sendMessage(
                    obj.room.id, 
                    { text: teks },
                    { quoted: obj.message.rawkey}
                  )
                }
              });
            }
          } catch (error) {
            console.error('Error parsing JSON data:', error);
          }
        });
      }else{
        let teks = 'Belum terdaftar di fitur RPG silakan ketik #rpg untuk mengaktifkan fitur RPG'
        return ctx.sendMessage(
          obj.room.id, 
          { text: teks },
          { quoted: obj.message.rawkey}
        )
      }

    } catch (error) {
      console.error('Error parsing JSON data:', error);
    }

  })
}
  