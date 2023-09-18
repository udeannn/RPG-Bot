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
  text: "Menampilkan inventori",
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

        const inventory = invenData.find(inven => inven.id === obj.sender.id);

        if (inventory) {
            let teks = '╓─── Inventory\n'
            teks += `║ \n`
            teks += `║ - Gold : ${inventory.gold}\n`
            teks += `║ - Iron : ${inventory.iron}\n`
            teks += `║ - Potion : ${inventory.potion}\n`
            teks += `║ \n`
            teks += `╙────────────`

            fs.readFile('database/equipmentRpg.json', 'utf8', (error, equipment) => {
                if (error) {
                    console.error('Error reading JSON file:', error);
                    return;
                }

                try {
                    const equipmentData = JSON.parse(equipment);

                    const playerEquipment = equipmentData.find(equipment => equipment.id === obj.sender.id);

                    if (playerEquipment) {
                        teks += '\n\nList equipment: '
                        for (const item of playerEquipment.equipment) {
                            teks += `\n`
                            if (item.type == 'weapon') {
                              teks += `╓─── ⚔️\n`
                            }else if(item.type == 'armor')  {
                              teks += `╓─── 🛡️\n`
                            }else{
                              teks += `╓─── 🏵️\n`
                            }
                            teks += `║ \n`
                            teks += `║ *${item.name}*\n`
                            teks += `║ Rarity: *${item.rarity}*\n`
                            teks += `║ Level: ${item.level}\n`
                            teks += `║ Digunakan : ${item.use == true ? 'ya':'tidak'}\n`
                            teks += `║ Id : ${item.id}\n`
                            teks += `║ \n`
                            teks += `╙────────────`
                            teks += `\n`
                        }
                    }

                    ctx.sendMessage(
                        obj.room.id,
                        { text: teks }
                    );

                } catch (error) {
                    console.error('Error parsing equipment JSON data:', error);
                }
            });
        } else {
            let teks = 'Belum terdaftar di fitur RPG silakan ketik #rpg untuk mengaktifkan fitur RPG'
            ctx.sendMessage(
                obj.room.id,
                { text: teks },
                { quoted: obj.message.rawkey }
            );
        }
    } catch (error) {
        console.error('Error parsing user JSON data:', error);
    }
});

  }
  