/*
 * Tệp này là một phần của Payment Bot Discord.
 *
 * Payment Bot Discord là phần mềm miễn phí: bạn có thể phân phối lại hoặc sửa đổi
 * theo các điều khoản của Giấy phép Công cộng GNU được công bố bởi
 * Tổ chức Phần mềm Tự do, phiên bản 3 hoặc (nếu bạn muốn) bất kỳ phiên bản nào sau đó.
 *
 * Payment Bot Discord được phân phối với hy vọng rằng nó sẽ hữu ích,
 * nhưng KHÔNG CÓ BẢO HÀNH; thậm chí không bao gồm cả bảo đảm
 * VỀ TÍNH THƯƠNG MẠI hoặc PHÙ HỢP CHO MỘT MỤC ĐÍCH CỤ THỂ. Xem
 * Giấy phép Công cộng GNU để biết thêm chi tiết.
 *
 * Bạn sẽ nhận được một bản sao của Giấy phép Công cộng GNU cùng với Payment Bot Discord.
 * Nếu không, hãy xem <https://www.gnu.org/licenses/>.
 */


const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const { createPaymentEmbed, createFailureEmbed, createSuccessEmbed, createLogEmbed } = require('./embeds');
const { google } = require('googleapis');
require('dotenv').config();

// === CONFIG ===
const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const SHEET_ID = process.env.SHEET_ID;
const SHEET_RANGE = process.env.SHEET_RANGE;
const SERVICE_ACCOUNT_FILE = process.env.SERVICE_ACCOUNT_FILE;
const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID;
const ALLOWED_ROLE_ID = process.env.ALLOWED_ROLE_ID;
const CUSTOMER_ROLE_ID = process.env.CUSTOMER_ROLE_ID;
const bankAccounts = JSON.parse(process.env.BANK_ACCOUNTS);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const PREFIXES = {
  mbbank: process.env.PREFIX_MBBANK,
  tpbank: process.env.PREFIX_TPBANK
};

// Kiểm tra biến môi trường
const requiredEnvVars = [
  'BOT_TOKEN', 'CLIENT_ID', 'GUILD_ID', 'SHEET_ID', 'SHEET_RANGE',
  'SERVICE_ACCOUNT_FILE', 'LOG_CHANNEL_ID', 'ALLOWED_ROLE_ID', 'CUSTOMER_ROLE_ID',
  'BANK_ACCOUNTS', 'PREFIX_MBBANK', 'PREFIX_TPBANK'
];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  console.error('❌ Thiếu các biến môi trường:');
  missingVars.forEach(v => console.error(`- ${v}`));
  process.exit(1);
}

// Xác thực Google Sheets
const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_FILE,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const paymentHistory = [];
let isCheckingGoogleSheet = false;
let googleSheetInterval = null;

// === Đăng ký lệnh slash ===
const choices = Object.keys(bankAccounts).map((key) => ({
  name: bankAccounts[key].displayName,
  value: key
}));

const commands = [
  new SlashCommandBuilder()
    .setName('taoct')
    .setDescription('Tạo thông tin thanh toán ngân hàng hoặc ví')
    .addStringOption(option =>
      option.setName('bank')
        .setDescription('Chọn ngân hàng hoặc ví')
        .setRequired(true)
        .addChoices(...choices)
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Số tiền cần thanh toán (VND)')
        .setRequired(true)
    )
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);
(async () => {
  try {
    console.log('Đang đăng ký lệnh slash...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );
    console.log('✅ Đăng ký slash command thành công!');
  } catch (error) {
    console.error(error);
  }
})();

// === Xử lý lệnh ===
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== 'taoct') return;

  const member = await interaction.guild.members.fetch(interaction.user.id);
  if (!member.roles.cache.has(ALLOWED_ROLE_ID)) {
    return interaction.reply({ content: 'Bạn không có quyền sử dụng lệnh này!', ephemeral: true });
  }

  const bankKey = interaction.options.getString('bank');
  const amount = interaction.options.getInteger('amount');
  const account = bankAccounts[bankKey];

  if (!account) {
    return interaction.reply({ content: 'Ngân hàng/ví không hợp lệ!', ephemeral: true });
  }

  const description = PREFIXES[bankKey] + Math.random().toString(36).substring(2, 9).toUpperCase();
  const qrUrl = `https://img.vietqr.io/image/${account.bankId}-${account.accountNo}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(account.name)}`;

  let remainingTime = 10;
  const embed = createPaymentEmbed(account, bankKey, amount, description, qrUrl, remainingTime);
  const reply = await interaction.reply({ embeds: [embed], fetchReply: true });

  const payment = {
    bank: bankKey,
    amount,
    description,
    timestamp: new Date(),
    reply,
    interval: null,
    channelId: interaction.channelId
  };
  paymentHistory.push(payment);

  payment.interval = setInterval(async () => {
    remainingTime -= 1;
    if (remainingTime <= 0) {
      clearInterval(payment.interval);
      await reply.edit({ embeds: [createFailureEmbed(description, amount)] });
      paymentHistory.splice(paymentHistory.indexOf(payment), 1);
    } else {
      const updatedEmbed = createPaymentEmbed(account, bankKey, amount, description, qrUrl, remainingTime);
      await reply.edit({ embeds: [updatedEmbed] });
    }
  }, 60000);

  startGoogleSheetCheck();
});

// === Kiểm tra Google Sheet ===
async function checkGoogleSheet() {
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: SHEET_RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return;

    for (const payment of paymentHistory.slice()) {
      const match = rows.find(row => row[0] === payment.description);
      if (match) {
        await payment.reply.delete();

        const guild = await client.guilds.fetch(GUILD_ID);
        const customerRole = guild.roles.cache.get(CUSTOMER_ROLE_ID);
        const customer = customerRole ? customerRole.members.first() : null;
        const customerTag = customer ? `<@${customer.id}>` : 'Không xác định';

        const channel = await client.channels.fetch(payment.channelId);
        await channel.send({ embeds: [createSuccessEmbed(payment, customerTag)] });

        const logChannel = await client.channels.fetch(LOG_CHANNEL_ID);
        await logChannel.send({ embeds: [createLogEmbed(payment, customerTag)] });

        if (payment.interval) clearInterval(payment.interval);
        paymentHistory.splice(paymentHistory.indexOf(payment), 1);
      }
    }
  } catch (error) {
    console.error('Lỗi khi kiểm tra Google Sheet:', error.message);
  }
}

function startGoogleSheetCheck() {
  if (!isCheckingGoogleSheet) {
    isCheckingGoogleSheet = true;
    googleSheetInterval = setInterval(checkGoogleSheet, 5000);
  }
}

client.once('ready', () => {
  console.log(`✅ Bot đã đăng nhập: ${client.user.tag}`);
});

client.login(BOT_TOKEN);
