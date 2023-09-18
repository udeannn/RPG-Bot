import { fileURLToPath } from 'url';
import path from 'path'
import { prefix } from '../../../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileName = path.basename(__filename).split('.')[0];

export const setup = {
    permission: 0, // All permission: 0 = all, 1 = owner, 2 = onwer, admin group
    group_required: true, // if true command only work on group
  };
  
  export const helping = {
    text: "Merubah deskripsi group",
    use: `${prefix[0]}${fileName} *newDescGroup*`
  }
  
  export async function run(ctx, obj) {
    const splitMessage = obj.message.text.split(' ')
    let result = splitMessage.slice(1).join(' ');

    await ctx.groupUpdateDescription(obj.room.id, result)
    
    return ctx.sendMessage(
        obj.room.id,
        { text: `Deskripsi group berhasil diubah menjadi *${result}*` },
        { quoted: obj.message.rawkey },
    );
  }
  