import fs from "fs";
import { fileURLToPath } from 'url';
import path from 'path';
import { prefix } from '../../../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileName = path.basename(__filename).split('.')[0];

export const setup = {
    permission: 0, // All permission: 0 = all, 1 = owner, 2 = owner, admin group
    group_required: false, // if true command only works in a group
};

export const helping = {
    text: "Melakukan hunting melawan monster",
    use: `${prefix[0]}${fileName} 1-10`
}

const usersInBattle = [];

export async function run(ctx, obj) {
    const m = obj.message.text.toLowerCase();
    const splitMessage = m.split(' ');

    if (usersInBattle.includes(obj.sender.id)) {
        return ctx.sendMessage(
            obj.room.id,
            { text: 'Kamu sedang dalam pertempuran. Tunggu sampai pertempuran selesai sebelum melakukan hunt lagi.' },
            { quoted: obj.message.rawkey }
        );
    }

    usersInBattle.push(obj.sender.id);

    const huntBattle = usersInBattle.indexOf(obj.sender.id);

    if (!splitMessage[1]) {

        if (huntBattle !== -1) {
            usersInBattle.splice(huntBattle, 1);
        }

        return ctx.sendMessage(
            obj.room.id,
            { text: 'Silakan pilih lantai 1-10' },
            { quoted: obj.message.rawkey }
        );
    }

    let equipmentData;
    try {
        const rawData = fs.readFileSync('database/equipmentRpg.json');
        equipmentData = JSON.parse(rawData);
    } catch (error) {
        console.error('Error read JSON file:', error);
        return;
    }

    let userData;
    try {
        const rawData = fs.readFileSync('database/userRpg.json');
        userData = JSON.parse(rawData);
    } catch (error) {
        console.error('Error reading user data:', error);

        if (huntBattle !== -1) {
            usersInBattle.splice(huntBattle, 1);
        }

        return ctx.sendMessage(
            obj.room.id,
            { text: 'Error reading user data' },
            { quoted: obj.message.rawkey }
        );
    }

    let playerStats = {
        hp: 2000,
        attack: 200
    };

    const user = userData.find((data) => data.id === obj.sender.id);
    const playerEquipment = equipmentData.find(player => player.id === obj.sender.id);

    let userHp = 0;
    let userDamage = 0;

    if (user) {
        if (user.hp <= 0) {

            if (huntBattle !== -1) {
                usersInBattle.splice(huntBattle, 1);
            }

            let teks = 'HP kamu tidak cukup untuk melakukan hunt';
            return ctx.sendMessage(
                obj.room.id,
                { text: teks },
                { quoted: obj.message.rawkey }
            )
        }
        if (playerEquipment) {
            if (playerEquipment.equipment) {
                for (const item of playerEquipment.equipment) {
                    if (item.use == true) {
                        // userHp += item.hp || 0;
                        userDamage += item.power || 0;
                    }
                }
            }
        }

        userHp += user.hp;
        userDamage += user.damage;

        playerStats = {
            hp: userHp,
            attack: userDamage,
        };

    } else {

        if (huntBattle !== -1) {
            usersInBattle.splice(huntBattle, 1);
        }

        let teks = 'Belum terdaftar di fitur RPG silakan ketik #rpg untuk mengaktifkan fitur RPG';
        return ctx.sendMessage(
            obj.room.id,
            { text: teks },
            { quoted: obj.message.rawkey }
        )
    }

    const floor = parseInt(splitMessage[1]);

    let loginData;
    try {
        const rawData = fs.readFileSync('database/login.json');
        loginData = JSON.parse(rawData);
    } catch (error) {

        if (huntBattle !== -1) {
            usersInBattle.splice(huntBattle, 1);
        }

        console.error('Error reading login data:', error);
        return ctx.sendMessage(
            obj.room.id,
            { text: 'Error reading login data' },
            { quoted: obj.message.rawkey }
        );
    }

    const existsLogin = loginData.includes(obj.sender.id);
    if (!existsLogin) {

        if (huntBattle !== -1) {
            usersInBattle.splice(huntBattle, 1);
        }

        return ctx.sendMessage(
            obj.room.id,
            { text: 'Kamu belum login' },
            { quoted: obj.message.rawkey }
        )
    }

    let enemyData;
    try {
        const rawData = fs.readFileSync('database/huntRpg.json');
        enemyData = JSON.parse(rawData);
    } catch (error) {
        console.error('Error reading enemy data:', error);
        return ctx.sendMessage(
            obj.room.id,
            { text: 'Error reading enemy data' },
            { quoted: obj.message.rawkey }
        );
    }

    let monsterStats = {
        hp: 1000, // Default values if enemy data is not found
        attack: 100, // Default values if enemy data is not found
    };

    const enemy = enemyData.find((data) => data.floor === floor);

    if (enemy) {
        monsterStats = {
            hp: enemy.hp,
            attack: enemy.damage,
        };

    } else {

        if (huntBattle !== -1) {
            usersInBattle.splice(huntBattle, 1);
        }

        return ctx.sendMessage(
            obj.room.id,
            { text: 'Lantai tidak ditemukan' },
            { quoted: obj.message.rawkey }
        )
    }


    // Function to check the winner
    function checkWinner(playerHP, monsterHP) {
        if (monsterHP <= 0) {
            return "Pemain menang!";
        } else if (playerHP <= 0) {
            return "Monster menang!";
        }
        return null;
    }

    // Function to handle player's attack
    function playerAttackMonster() {
        monsterStats.hp -= playerStats.attack;
        if (monsterStats.hp < 0) {
            monsterStats.hp = 0;
        }
        return `Pemain menyerang monster! HP monster sekarang: ${monsterStats.hp}`;
    }

    // Function to handle monster's attack
    function monsterAttackPlayer() {
        playerStats.hp -= monsterStats.attack;
        if (playerStats.hp < 0) {
            playerStats.hp = 0;
        }

        user.hp -= monsterStats.attack;

        // Ensure user's HP doesn't go below 0
        if (user.hp < 0) {
            user.hp = 0;
        }

        // Save updated user data back to the database
        const updatedUserData = userData.map((data) => {
            if (data.id === obj.sender.id) {
                return user;
            }
            return data;
        });

        // Save updated user data to the database file
        fs.writeFileSync('database/userRpg.json', JSON.stringify(updatedUserData, null, 4));

        return `Monster menyerang pemain! HP pemain sekarang: ${playerStats.hp}`;
    }

    let mess;
    const battleResults = [];
    const battleMessage = { text: '' };

    // Main loop pertarungan
    while (playerStats.hp > 0 && monsterStats.hp > 0) {
        const playerAttackResult = playerAttackMonster();
        const monsterAttackResult = monsterAttackPlayer();
        const winner = checkWinner(playerStats.hp, monsterStats.hp);

        battleResults.push(playerAttackResult);

        if (!mess) {
            // Initialize the battle message only once
            const dataHunt = `╓─── Hunt lantai ${splitMessage[1]}\n`
                + `║ \n`
                + `║ Monster : ${enemy.enemy}\n`
                + `║ Lokasi : ${enemy.location}\n`
                + `║ HP : ${enemy.hp}\n`
                + `║ Defense : ${enemy.defense}\n`
                + `║ Damage : ${enemy.damage}\n`
                + `║ \n`
                + `╙────────────`;

            battleMessage.text = dataHunt;

            mess = await ctx.sendMessage(
                obj.room.id,
                battleMessage,
                { quoted: obj.message.rawkey }
            );
        }

        await new Promise(resolve => setTimeout(resolve, 5000));

        // Send player attack results message
        let teksResult = `${battleMessage.text}`;
        for (const result of battleResults) {
            teksResult += '\n\n' + `${result}`;
        }
        await ctx.relayMessage(
            obj.room.id, {
                protocolMessage: {
                    key: mess.key,
                    type: 14,
                    editedMessage: {
                        conversation: teksResult // Send each element as a separate message
                    }
                }
            }, {}
        );

        if (winner) {
            console.log('winner not new winner function')
            if (winner === "Pemain menang!") {
                // Calculate random rewards if the player wins
                const ironReward = Math.floor(Math.random() * (enemy.max_iron - enemy.min_iron + 1)) + enemy.min_iron;
                const platinumReward = Math.floor(Math.random() * (enemy.max_platinum - enemy.min_platinum + 1)) + enemy.min_platinum;
                const mythrilReward = Math.floor(Math.random() * (enemy.max_mythril - enemy.min_mythril + 1)) + enemy.min_mythril;

                // Update player's material
                user.iron += ironReward;
                user.platinum += platinumReward;
                user.mythril += mythrilReward;

                // Calculate and add EXP based on enemy's EXP rewards
                const expReward = Math.floor(Math.random() * (enemy.exp_max - enemy.exp_min + 1)) + enemy.exp_min;
                user.xp_level += expReward;

                // Print the winner and rewards
                const winnerMessage = `${winner}\n\nSisa HP: ${user.hp}/${user.max_hp}\n\nRewards:\nIron: ${ironReward}\nPlatinum: ${platinumReward}\nMythril: ${mythrilReward}\nEXP Gained: ${expReward}`;

                await ctx.sendMessage(
                    obj.room.id,
                    { text: winnerMessage },
                    { quoted: obj.message.rawkey }
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
                break;

            } else if (winner === "Monster menang!") {
                // If the monster wins, don't provide any rewards
                await ctx.sendMessage(
                    obj.room.id,
                    { text: winner+`\n\nSisa HP: ${user.hp}/${user.max_hp}` },
                    { quoted: obj.message.rawkey }
                );
                break;
            }
        }

        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds

        battleResults.push(monsterAttackResult);

        // Send monster attack results message
        teksResult = `${battleMessage.text}`;
        for (const result of battleResults) {
            teksResult += '\n\n' + `${result}`;
        }
        await ctx.relayMessage(
            obj.room.id, {
                protocolMessage: {
                    key: mess.key,
                    type: 14,
                    editedMessage: {
                        conversation: teksResult // Send each element as a separate message
                    }
                }
            }, {}
        );

        const newWinner = checkWinner(playerStats.hp, monsterStats.hp);

        if (newWinner) {
            console.log('new winner not winner function')
            if (newWinner === "Pemain menang!") {
                // Calculate random rewards if the player wins
                const ironReward = Math.floor(Math.random() * (enemy.max_iron - enemy.min_iron + 1)) + enemy.min_iron;
                const platinumReward = Math.floor(Math.random() * (enemy.max_platinum - enemy.min_platinum + 1)) + enemy.min_platinum;
                const mythrilReward = Math.floor(Math.random() * (enemy.max_mythril - enemy.min_mythril + 1)) + enemy.min_mythril;
                const goldReward = Math.floor(Math.random() * (enemy.max_gold - enemy.min_gold + 1)) + enemy.min_gold;

                // Update player's material
                user.iron += ironReward;
                user.platinum += platinumReward;
                user.mythril += mythrilReward;
                user.gold += goldReward;

                // Calculate and add EXP based on enemy's EXP rewards
                const expReward = Math.floor(Math.random() * (enemy.exp_max - enemy.exp_min + 1)) + enemy.exp_min;
                user.xp_level += expReward;

                // Print the winner and rewards
                const winnerMessage = `${newWinner}\n\nSisa HP: ${user.hp}/${user.max_hp}\n\nRewards:\nIron: ${goldReward}\nIron: ${ironReward}\nPlatinum: ${platinumReward}\nMythril: ${mythrilReward}\nEXP Gained: ${expReward}`;

                await ctx.sendMessage(
                    obj.room.id,
                    { text: winnerMessage },
                    { quoted: obj.message.rawkey }
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
                break;

            } else if (newWinner === "Monster menang!") {
                // If the monster wins, don't provide any rewards
                await ctx.sendMessage(
                    obj.room.id,
                    { text: newWinner+`\n\nSisa HP: ${user.hp}/${user.max_hp}` },
                    { quoted: obj.message.rawkey }
                );
                break;
            }
        }
    }

    if (huntBattle !== -1) {
        usersInBattle.splice(huntBattle, 1);
    }
}
