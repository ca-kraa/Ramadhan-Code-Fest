let handler = (m) => m;
handler.before = function (m) {
  let user = global.db.data.users[m.sender];
  if (user.afk > -1) {
    this.reply(
      m.chat,
      `
Kamu berhenti AFK${user.afkReason ? " setelah " + user.afkReason : ""}
Selama ${this.clockString(new Date() - user.afk)}
`.trim(),
      m
    );
    user.afk = -1;
    user.afkReason = "";
  }
  let jids = [
    ...new Set([
      ...(m.mentionedJid || []),
      ...(m.quoted ? [m.quoted.sender] : []),
    ]),
  ];
  for (let jid of jids) {
    let user = global.db.data.users[jid];
    if (!user) continue;
    let afkTime = user.afk;
    if (!afkTime || afkTime < 0) continue;
    let reason = user.afkReason || "";
    this.reply(
      m.chat,
      `
Jangan tag dia!
Dia sedang AFK ${reason ? "dengan alasan " + reason : "tanpa alasan"}
Selama ${this.clockString(new Date() - afkTime)}
`.trim(),
      m
    );
  }
  return true;
};

module.exports = handler;
