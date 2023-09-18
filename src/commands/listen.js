import { prefix, owner_id } from '../config.js';
import fs from 'fs/promises';

async function listCommands() {
  const path = `./src/commands/prefixed/`;
  const Cmdlist = [];
  const files = await fs.readdir(path);

  for (const file of files) {
    const nestedFile = await fs.readdir(path + file);

    nestedFile.forEach((name) => {
      if (!name.endsWith('.js')) return;
      const names = name.replace(/\.js/g, '');
      Cmdlist.push({
        name: names,
        group: file,
        path: `./prefixed/${file}/${name}`,
      });
    });
  }

  return Cmdlist;
}

export async function Execute(ctx, obj) {
  const { room, sender, message } = obj;
  const ids = sender.id.replace(/@s.whatsapp.net/g, '');
  const [arg, ...args] = message.text.trim().split(' ');
  const command = arg.replace(/[^\w\s]/gi, '');

  try {
    const list = await listCommands();
    const cmds = list.find((data) => data.name === command);

    if (cmds) {
      const { run, setup } = await import(cmds.path);
      const is_owner = owner_id.includes(ids);

      /* Check commands permission*/
      if (setup.permission === 1 && !is_owner) {
        return obj.reply('Ups. Only owner can run this commands.');
      }
      if (setup.group_required && !room.is_group) {
        return obj.reply('Ups. Only on group can run this commands');
      }

      await run(ctx, obj, args);
    }
    if (command === 'menu') {
      const groups = {};
      let text = '*List all commands*\n\n';
      text += `Note: Jika ingin melihat penggunaan serta informasi command silakan ketik ${prefix}help *namaCommand*\n\n`

      list.forEach((item) => {
        if (!groups[item.group]) groups[item.group] = [];
        groups[item.group].push(item.name);
      });

      for (const group in groups) {
        const member = groups[group].join('\n║ '+prefix);
        text += `╓─── *${group}* (${groups[group].length})\n`
        text += `║ \n`;
        text += `║ ${prefix}${member}\n`;
        text += `║ \n╙────────────\n\n`;
      }

      await ctx.sendMessage(room.id, {
        text: text.trim(),
      });
    }
    //help
    if (command === 'help') {
      const groups = {};

      const split = obj.message.text.split(' ')
      const text = split[1]

      if (!split[1]) {
        await ctx.sendMessage(room.id, {
          text: `Commandnya apa kak?\n\nPenggunaan : ${prefix}help *namaCommand*`
        });
      }

      if (split[1]) {
        const rootPath = './src/commands/prefixed/';
        const files = await fs.readdir(rootPath);
        let commandFound = false; // Flag to keep track if the command is found
      
        for (const file of files) {
          const nestedFiles = await fs.readdir(rootPath + file);
      
          for (const nestedFile of nestedFiles) {
            const names = nestedFile.replace(/\.js/g, '');
      
            if (names === split[1]) {
              const fullPath = './prefixed/' + file + '/' + nestedFile;
              const { helping } = await import(fullPath);
      
              commandFound = true; // Set the flag to true since the command was found
              return ctx.sendMessage(room.id, {
                text: `${helping.text}\n\nPenggunaan : ${helping.use}`,
              });
            }
          }
        }
      
        // If the loop completes without finding the command, send the "not found" message
        if (!commandFound) {
          return ctx.sendMessage(room.id, {
            text: `Nama command tidak ditemukan silakan ketik ${prefix}menu untuk melihat list command yang tersedia`,
          });
        }
      }

    }

  } catch (error) {
    console.log(error);
    owner_id.forEach((id) =>
      ctx.sendMessage(id + '@s.whatsapp.net', {
        text: `Error found at ${room.id}: ${error.message}`,
      }),
    );
  }
}
