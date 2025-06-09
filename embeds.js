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
