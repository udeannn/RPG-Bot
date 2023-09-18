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
    text: "Mendaftarkan ke fitur RPG",
    use: `${prefix[0]}${fileName}`
}

export async function run(ctx, obj) {

    let teks = 'Berhasil mendaftarkan RPG'
    const itemToAdd = {
        id: obj.sender.id,
        title: 'warrior',
        level: 1,
        xp_level:0,
        hp: 2000,
        max_hp: 2000,
        damage: 200,
        gold: 0,
        iron: 0,
        potion: 0
    };

    const filePath = 'database/userRpg.json';

    fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading JSON file:', err);
        return;
    }

    try {
        const existingData = JSON.parse(data);

        const exists = existingData.some(item => item.id === itemToAdd.id);

        if (exists) {
            return ctx.sendMessage(
                obj.room.id, 
                { text: 'Sudah terdaftar di RPG' },
                { quoted: obj.message.rawkey}
            )
        } else {
        existingData.push(itemToAdd);

        fs.writeFile(filePath, JSON.stringify(existingData, null, 2), 'utf8', (err) => {
            if (err) {
            } else {
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


}
