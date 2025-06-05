/*
 * This file is part of Payment Bot Discord.
 *
 * Payment Bot Discord is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Payment Bot Discord is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Payment Bot Discord.  If not, see <https://www.gnu.org/licenses/>.
 */

const { EmbedBuilder } = require('discord.js');

function createPaymentEmbed(account, bankKey, amount, description, qrUrl, remainingTime) {
  return new EmbedBuilder()
    .setColor(0xFFFF00)
    .setAuthor({ name: 'DST STUDIO PAYMENT', iconURL: 'https://cdn.discordapp.com/attachments/1378363930573017140/1379134369754779669/logo.png?ex=683f2278&is=683dd0f8&hm=c95588d128df933623cd11b034f15c5711545047e6b18452791b714f1a2dcf1a&' })
    .setDescription([
      `>  **\`NGƯỜI THỤ HƯỞNG:\`**    ***${account.name}***`,
      ``,
      `>  **\`NGÂN HÀNG:\`**    ***${bankKey.toUpperCase()}***`,
      ``,
      `>  **\`SỐ TK:\`**    ***${account.accountNo}***`,
      ``,
      `>  **\`SỐ TIỀN:\`**    ***${amount} VND***`,
      ``,
      `>  **\`NỘI DUNG:\`**    ***${description}***`,
      ``,
      `>  **\`THỜI GIAN CÒN LẠI:\`**    ***${remainingTime} phút***`
    ].join('\n'))
    .setImage(qrUrl)
    .setThumbnail('https://cdn.discordapp.com/attachments/1378363930573017140/1379134369754779669/logo.png?ex=683f2278&is=683dd0f8&hm=c95588d128df933623cd11b034f15c5711545047e6b18452791b714f1a2dcf1a&');
}

function createFailureEmbed(description, amount) {
  return new EmbedBuilder()
    .setColor(0xFF0000)
    .setTitle('Giao dịch thất bại')
    .setDescription([
      `>  **\`NỘI DUNG:\`**    ***${description}***`,
      ``,
      `>  **\`SỐ TIỀN:\`**    ***${amount} VND***`,
      ``,
      `>  **\`TRẠNG THÁI:\`**    ***Thất bại***`,
      ``,
      `> **\`]|I{•------»   🎀  𝙓𝙞𝙣 𝘾ả𝙢 Ơ𝙣  🎀   »------•{I|]\`**`,
      ``,
      `>  **\`LÝ DO:\`**    ***Hết thời gian thanh toán***`,
    ].join('\n'))
    .setTimestamp();
}

function createSuccessEmbed(payment, customerTag) {
  return new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle('XÁC NHẬN GIAO DỊCH THÀNH CÔNG')
    .setAuthor({ name: 'DST STUDIO PAYMENT', iconURL: 'https://cdn.discordapp.com/attachments/1378363930573017140/1379134369754779669/logo.png?ex=683f2278&is=683dd0f8&hm=c95588d128df933623cd11b034f15c5711545047e6b18452791b714f1a2dcf1a&' })
    .setDescription([
      `>  **\`NỘI DUNG:\`**    ***${payment.description}***`,
      ``,
      `>  **\`SỐ TIỀN:\`**    ***${payment.amount} VND***`,
      ``,
      `>  **\`KHÁCH HÀNG:\`**    ${customerTag}`,
      ``,
      `>  **\`TRẠNG THÁI:\`**    ***THANH TOÁN THÀNH CÔNG***`,
      ``,
      `> **\`]|I{•------»   🎀  𝙓𝙞𝙣 𝘾ả𝙢 Ơ𝙣  🎀   »------•{I|]\`**`,
    ].join('\n'))
    .setThumbnail('https://cdn.discordapp.com/attachments/1378363930573017140/1379134369754779669/logo.png?ex=683f2278&is=683dd0f8&hm=c95588d128df933623cd11b034f15c5711545047e6b18452791b714f1a2dcf1a&')
    .setTimestamp();
}

function createLogEmbed(payment, customerTag) {
  return new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle('Log thanh toán')
    .setDescription([
      `>  **\`NỘI DUNG:\`**    ***${payment.description}***`,
      ``,
      `>  **\`SỐ TIỀN:\`**    ***${payment.amount} VND***`,
      ``,
      `>  **\`KHÁCH HÀNG:\`**    ${customerTag}`,
      ``,
      `>  **\`TRẠNG THÁI:\`**    ***Thành công***`,
      ``,
      `> **\`]|I{•------»   🎀  𝙓𝙞𝙣 𝘾ả𝙢 Ơ𝙣  🎀   »------•{I|]\`**`,
    ].join('\n'))
    .setTimestamp();
}

module.exports = {
  createPaymentEmbed,
  createFailureEmbed,
  createSuccessEmbed,
  createLogEmbed
};
