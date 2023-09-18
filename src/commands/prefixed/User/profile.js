import fs from "fs";

export const setup = {
    permission: 0, // All permission: 0 = all, 1 = owner, 2 = onwer, admin group
    group_required: false, // if true command only work on group
};

export const helping = {
  text: "Menampilkan profil",
  use: `#profile`
}

export async function run(ctx, obj) {

  const ppUrl = await ctx.profilePictureUrl(obj.sender.id, 'image')
  
  let teks = '╓─── Profile\n'
  teks += `║ \n`
  teks += `║ Username : ${obj.sender.name}\n`
  teks += `║ Spam : 0\n`
  teks += `║ Limit : 10\n`
  teks += `║ Level : 1 (0/125)\n`
  teks += `║ Premium : No\n`
  teks += `║ \n`

  fs.readFile('database/userRpg.json', 'utf8', (error, inven) => {
    if (error) {
        console.error('Error reading JSON file:', error);
        return;
    }

    const invenData = JSON.parse(inven);

    const inventory = invenData.find(inven => inven.id === obj.sender.id)
    if (inventory) {
      teks += `╟─── RPG \n`
      teks += `║ \n`
      teks += `║ Tittle : ${inventory.title}\n`
      teks += `║ Level : ${inventory.level}\n`
      teks += `║ XP Level : ${inventory.xp_level}/${2000+(1*100)}\n`
      teks += `║ Gold : ${inventory.gold}\n`
      teks += `║ \n`
      teks += `╙────────────`

      return ctx.sendMessage(
        obj.room.id, 
        { text: teks }
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
      teks += `╙────────────`

      return ctx.sendMessage(
        obj.room.id, 
        { text: teks }
      )
    }
    
  })
        

  }
  