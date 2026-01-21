const config = require("../config.js");
const { InteractionType } = require('discord.js');
const axios = require("axios");
const path = require("path");
const colors = require('../UI/colors/colors');
const { getLang, getLangSync } = require('../utils/languageLoader.js');

const formatDateTime = (date) => date.toLocaleString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
});

const sendUsageWebhook = async (interaction) => {
  const webhookUrl = config.usageWebhookUrl;
  if (!webhookUrl) {
    return;
  }

  const { guild, member, user, channel } = interaction;
  if (!guild || !member) {
    return;
  }

  const owner = await guild.fetchOwner().catch(() => null);
  const ownerLabel = owner?.user?.tag || owner?.user?.username || guild.ownerId || "Unknown";
  const embedColor = parseInt(config.embedColor?.replace('#', '') || '1db954', 16);
  const roles = member.roles.cache
    .filter((role) => role.id !== guild.id)
    .map((role) => role.name)
    .slice(0, 15);
  const rolesValue = roles.length ? roles.join(", ") : "None";

  const userEmbed = {
    title: "👤 User Details",
    color: embedColor,
    thumbnail: {
      url: user.displayAvatarURL({ extension: 'png', size: 256 })
    },
    fields: [
      { name: "Username", value: user.tag || user.username, inline: true },
      { name: "User ID", value: user.id, inline: true },
      { name: "Account Created", value: formatDateTime(user.createdAt), inline: true },
      { name: "Roles", value: rolesValue, inline: false }
    ],
    footer: {
      text: `${guild.name} • ${formatDateTime(new Date())}`,
      icon_url: guild.iconURL({ extension: 'png', size: 256 }) || undefined
    }
  };

  const serverEmbed = {
    title: "🏠 Server Details",
    color: embedColor,
    thumbnail: {
      url: guild.iconURL({ extension: 'png', size: 256 })
    },
    fields: [
      { name: "Server Name", value: guild.name, inline: true },
      { name: "Server ID", value: guild.id, inline: true },
      { name: "Server Owner", value: ownerLabel, inline: true },
      { name: "Total Members", value: `${guild.memberCount}`, inline: true },
      { name: "Channel", value: channel ? `<#${channel.id}>` : "Unknown", inline: true },
      { name: "Joined Server", value: member.joinedAt ? formatDateTime(member.joinedAt) : "Unknown", inline: true },
      { name: "Command Used", value: `/${interaction.commandName}`, inline: false }
    ],
    footer: {
      text: `${guild.name} • ${formatDateTime(new Date())}`,
      icon_url: guild.iconURL({ extension: 'png', size: 256 }) || undefined
    }
  };

  await axios.post(webhookUrl, { embeds: [userEmbed, serverEmbed] });
};

module.exports = async (client, interaction) => {
  try {

    if (interaction.type === InteractionType.ApplicationCommand) {
    if (!interaction?.guild) {
        const lang = getLang(interaction.guildId);
        return interaction?.reply({ 
          content: lang.events.interactionCreate.noGuild, 
          ephemeral: true 
        });
    }

      const lang = getLang(interaction.guildId);
      const command = client.commands.get(interaction.commandName);

      if (!command) {
        const consoleLang = getLangSync();
        console.error(`${colors.cyan}[ INTERACTION ]${colors.reset} ${colors.red}${consoleLang.console?.events?.interaction?.commandNotFound?.replace('{commandName}', interaction.commandName) || `Command not found: ${interaction.commandName}`}${colors.reset}`);
        return interaction?.reply({ 
          content: lang.events.interactionCreate.commandNotFound, 
          ephemeral: true 
        });
      }

      const requiredPermissions = command.permissions || "0x0000000000000800";
      if (!interaction?.member?.permissions?.has(requiredPermissions)) {
        return interaction?.reply({ 
          content: lang.events.interactionCreate.noPermission, 
          ephemeral: true 
        });
      }

  
      try {
        await command.run(client, interaction);
        await sendUsageWebhook(interaction).catch((error) => {
          const consoleLang = getLangSync();
          console.error(`${colors.cyan}[ INTERACTION ]${colors.reset} ${colors.red}${consoleLang.console?.events?.interaction?.usageWebhookFailed || 'Failed to send usage webhook:'}${colors.reset}`, error);
        });
      } catch (error) {
        const consoleLang = getLangSync();
        console.error(`${colors.cyan}[ INTERACTION ]${colors.reset} ${colors.red}${consoleLang.console?.events?.interaction?.errorExecuting?.replace('{commandName}', interaction.commandName) || `Error executing command ${interaction.commandName}:`}${colors.reset}`, error);
        
        const errorMessage = lang.events.interactionCreate.errorOccurred.replace('{message}', error.message);
        
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ 
            content: errorMessage, 
            ephemeral: true 
          }).catch(() => {});
        } else {
          await interaction.reply({ 
            content: errorMessage, 
            ephemeral: true 
          }).catch(() => {});
        }
      }
    }

   
    if (interaction.isButton()) {

      if (interaction.customId === 'help_back_main') {
              try {
