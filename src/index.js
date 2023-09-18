import * as client from './lib/client.js';

export const event = {};

/**
 * Handle incoming messages
 * @param ctx - socket baileys
 * @param obj - object messages
 * @returns {void}
 */
event.get_messages = async (ctx, obj) => {
  if (obj.message.text === 'ping') {
    await obj.reply('Pong');
  }
};

client.start();
