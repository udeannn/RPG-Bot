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
    text: "Melihat atau membeli dari shop",
    use: `${prefix[0]}${fileName}\nPenggunaan 2: ${prefix[0]}${fileName} *potionName* atau ${prefix[0]}${fileName} *potionName* *numberOfPotions*\nPenggunaan 3: ${prefix[0]}${fileName} *idItemShop*`
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

    let loginData;
    try {
        const rawData = fs.readFileSync('database/login.json');
        loginData = JSON.parse(rawData);
    } catch (error) {
        console.error('Error reading login data:', error);
        return ctx.sendMessage(
            obj.room.id,
            { text: 'Error reading login data' },
            { quoted: obj.message.rawkey }
        );
    }
  
    const existsLogin = loginData.includes(obj.sender.id);
    if (!existsLogin) {
        return ctx.sendMessage(
            obj.room.id, 
            { text: 'Kamu belum login' },
            { quoted: obj.message.rawkey}
        )
    }

    const m = obj.message.text.toLowerCase()
    const splitMessage = m.split(' ')

    if (!splitMessage[1]) {
        let teks = `╓─── Item\n`
        teks += `║ \n`
        teks += `║ potion 250 G\n`
        teks += `║ \n`
        teks += `╟─── RPG stats\n`
        teks += `║ \n`
        teks += `║ iron 800 G\n`
        teks += `║ platinum 20000 G\n`
        teks += `║ \n`
        teks += `╙────────────`

        return ctx.sendMessage(
            obj.room.id,
            { text: teks },
            { quoted: obj.message.rawkey },
        );
    }

    if (splitMessage[1] == 'potion') {

        if (user.gold >= 250) {

            if (splitMessage[2]) {
                if (!isNaN(parseInt(splitMessage[2]))) {
                    if (user.gold >= parseInt(splitMessage[2]) * 250) {

                        user.gold -= parseInt(splitMessage[2]) * 250;
                        user.potion += parseInt(splitMessage[2]);
        
                        let teks = `Berhasil membeli potion dengan jumlah ${splitMessage[2]}`
                        await ctx.sendMessage(
                            obj.room.id,
                            { text: teks },
                            { quoted: obj.message.rawkey },
                        );
        
                        // Save updated user data back to the database
                        const updatedUserData = userData.map((data) => {
                            if (data.id === obj.sender.id) {
                                return user;
                            }
                            return data;
                        });
        
                        // Save updated user data to the database file
                        fs.writeFileSync('database/userRpg.json', JSON.stringify(updatedUserData, null, 4));

                    }
                } else {
                    let teks = `Harap masukkan nominal yang sesuai`
                    return ctx.sendMessage(
                        obj.room.id,
                        { text: teks },
                        { quoted: obj.message.rawkey },
                    );
                }
            } else {
                user.gold -= 250;
                user.potion += 1;
    
                let teks = `Berhasil membeli potion dengan jumlah 1`
                await ctx.sendMessage(
                    obj.room.id,
                    { text: teks },
                    { quoted: obj.message.rawkey },
                );
    
                // Save updated user data back to the database
                const updatedUserData = userData.map((data) => {
                    if (data.id === obj.sender.id) {
                        return user;
                    }
                    return data;
                });
    
                // Save updated user data to the database file
                fs.writeFileSync('database/userRpg.json', JSON.stringify(updatedUserData, null, 4));
            }

        } else {
            let teks = 'Anda tidak memiliki cukup gold untuk melakukan pembelian'
            await ctx.sendMessage(
                obj.room.id,
                { text: teks },
                { quoted: obj.message.rawkey },
            );
        }
            
    }else if (splitMessage[1] == 'iron') {
        if (user.gold >= 800) {

            if (splitMessage[2]) {
                if (!isNaN(parseInt(splitMessage[2]))) {
                    if (user.gold >= parseInt(splitMessage[2]) * 800) {

                        user.gold -= parseInt(splitMessage[2]) * 800;
                        user.iron += parseInt(splitMessage[2]);
        
                        let teks = `Berhasil membeli iron dengan jumlah ${splitMessage[2]}`
                        await ctx.sendMessage(
                            obj.room.id,
                            { text: teks },
                            { quoted: obj.message.rawkey },
                        );
        
                        // Save updated user data back to the database
                        const updatedUserData = userData.map((data) => {
                            if (data.id === obj.sender.id) {
                                return user;
                            }
                            return data;
                        });
        
                        // Save updated user data to the database file
                        fs.writeFileSync('database/userRpg.json', JSON.stringify(updatedUserData, null, 4));

                    }
                } else {
                    let teks = `Harap masukkan nominal yang sesuai`
                    return ctx.sendMessage(
                        obj.room.id,
                        { text: teks },
                        { quoted: obj.message.rawkey },
                    );
                }
            } else {
                user.gold -= 250;
                user.iron += 1;
    
                let teks = `Berhasil membeli iron dengan jumlah 1`
                await ctx.sendMessage(
                    obj.room.id,
                    { text: teks },
                    { quoted: obj.message.rawkey },
                );
    
                // Save updated user data back to the database
                const updatedUserData = userData.map((data) => {
                    if (data.id === obj.sender.id) {
                        return user;
                    }
                    return data;
                });
    
                // Save updated user data to the database file
                fs.writeFileSync('database/userRpg.json', JSON.stringify(updatedUserData, null, 4));
            }

        } else {
            let teks = 'Anda tidak memiliki cukup gold untuk melakukan pembelian'
            await ctx.sendMessage(
                obj.room.id,
                { text: teks },
                { quoted: obj.message.rawkey },
            );
        }
    } else if (splitMessage[1] == 'platinum') {
        if (user.gold >= 20000) {

            if (splitMessage[2]) {
                if (!isNaN(parseInt(splitMessage[2]))) {
                    if (user.gold >= parseInt(splitMessage[2]) * 20000) {

                        user.gold -= parseInt(splitMessage[2]) * 20000;
                        user.platinum += parseInt(splitMessage[2]);
        
                        let teks = `Berhasil membeli platinum dengan jumlah ${splitMessage[2]}`
                        await ctx.sendMessage(
                            obj.room.id,
                            { text: teks },
                            { quoted: obj.message.rawkey },
                        );
        
                        // Save updated user data back to the database
                        const updatedUserData = userData.map((data) => {
                            if (data.id === obj.sender.id) {
                                return user;
                            }
                            return data;
                        });
        
                        // Save updated user data to the database file
                        fs.writeFileSync('database/userRpg.json', JSON.stringify(updatedUserData, null, 4));

                    }
                } else {
                    let teks = `Harap masukkan nominal yang sesuai`
                    return ctx.sendMessage(
                        obj.room.id,
                        { text: teks },
                        { quoted: obj.message.rawkey },
                    );
                }
            } else {
                user.gold -= 250;
                user.platinum += 1;
    
                let teks = `Berhasil membeli platinum dengan jumlah 1`
                await ctx.sendMessage(
                    obj.room.id,
                    { text: teks },
                    { quoted: obj.message.rawkey },
                );
    
                // Save updated user data back to the database
                const updatedUserData = userData.map((data) => {
                    if (data.id === obj.sender.id) {
                        return user;
                    }
                    return data;
                });
    
                // Save updated user data to the database file
                fs.writeFileSync('database/userRpg.json', JSON.stringify(updatedUserData, null, 4));
            }

        } else {
            let teks = 'Anda tidak memiliki cukup gold untuk melakukan pembelian'
            await ctx.sendMessage(
                obj.room.id,
                { text: teks },
                { quoted: obj.message.rawkey },
            );
        }
    } else {
        let teks = 'Item tidak ditemukan'
        await ctx.sendMessage(
            obj.room.id,
            { text: teks },
            { quoted: obj.message.rawkey },
        );
    }
  }
  