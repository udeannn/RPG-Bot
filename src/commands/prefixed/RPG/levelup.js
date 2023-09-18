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
    text: "Melakukan level up",
    use: `${prefix[0]}${fileName}`
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

    const expRequirement = 2000 * user.level

    let teks

    if (user.xp_level >= expRequirement) {
        user.xp_level -= expRequirement

        teks = `*Berhasil*\n\n level up dari level *${user.level}* ke level *${user.level + 1}*`
        
        user.level += 1

        const updatedUserData = userData.map((data) => {
            if (data.id === obj.sender.id) {
                return user;
            }
            return data;
        });

        fs.writeFileSync('database/userRpg.json', JSON.stringify(updatedUserData, null, 4));

    } else {
        teks = `*Gagal*\n\nlevel up dari level *${user.level}* ke level *${user.level + 1}* karena XP kamu tidak cukup\nKamu perlu sebanyak ${expRequirement - user.xp_level} XP lagi untuk meningkatkan level`
    }

    return ctx.sendMessage(
        obj.room.id, 
        { text: teks },
        { quoted: obj.message.rawkey}
    )
  }
  
  