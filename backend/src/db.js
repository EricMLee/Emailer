const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.getMailboxes = async () => {
  const select = 'SELECT mailboxname, mailboxcount FROM mailbox';
  const query = {
    text: select,
  };
  const {rows} = await pool.query(query);
  const mailbox = [];
  for (const row of rows) {
    mailbox.push({
      mailboxname: row.mailboxname,
      nummail: row.nummail,
    });
  }
  return mailbox;
}

exports.selectMail = async (mailbox) => {
  let select = 'SELECT mailbox, id, mail FROM mail';
  let query;
  if (mailbox == 'starred') {
    select += ` WHERE mail->>'star' = $1`;
    query = {
      text: select,
      values: [true],
    };
  } else {
    if (mailbox) {
      select += ' WHERE mailbox = $1';
    }
    query = {
      text: select,
      values: mailbox ? [`${mailbox}`] : [],
    };
  }
  const {rows} = await pool.query(query);
  const mails = [];
  for (const row of rows) {
    mails.push({
      id: row.id,
      name: row.mailbox,
      mail: {
        readd: row.mail.readd,
        to: row.mail.to,
        from: row.mail.from,
        sent: row.mail.sent,
        subject: row.mail.subject,
        received: row.mail.received,
        content: row.mail.content,
        star: row.mail.star,
      },
    });
  }
  return mails;
};

exports.selectMail2 = async (term) => {
  const select = `SELECT mailbox, id, mail FROM mail WHERE
    mail->'from'->>'name' LIKE $1 OR mail->'from'->>'email' LIKE $1
    OR mail->>'subject' LIKE $1 OR mail->>'content' LIKE $1`;
  const query = {
    text: select,
    values: [`%${term}%`],
  };
  const {rows} = await pool.query(query);
  const mails = [];
  for (const row of rows) {
    mails.push({
      id: row.id,
      name: row.mailbox,
      mail: {
        readd: row.mail.readd,
        to: row.mail.to,
        from: row.mail.from,
        sent: row.mail.sent,
        subject: row.mail.subject,
        received: row.mail.received,
        content: row.mail.content,
        star: row.mail.star,
      },
    });
  }
  return mails;
};
exports.getMailboxInfo = async (id) => {
  const select = 'SELECT mailboxname FROM mailbox WHERE id = $1';
  const query = {
    text: select,
    values: [id],
  };
  const {rows} = await pool.query(query);
  return rows.length == 1 ? rows[0].mail : undefined;
};

exports.selectSpecific = async (id) => {

  const select = 'SELECT mail, mailbox FROM mail WHERE id = $1';
  let query = {
    text: select,
    values: [id],
  };
  const {rows} = await pool.query(query);

  
  const mail = rows[0].mail;
  const newMail = {
    "readd": true,
    "to" : mail.to,
    "from" : mail.from,
    "sent" : mail.sent,
    "recieved" : mail.received,
    "content" : mail.content,
    "subject" : mail.subject,
    "star" : mail.star,
  }
  const update = `UPDATE mail SET mail = $2 WHERE id = $1`;
  query = {
    text: update,
    values: [id, newMail],
  };
  await pool.query(query);

  const returnMail = {
    "readd": rows[0].mail.readd,
    "to" : rows[0].mail.to,
    "from" : rows[0].mail.from,
    "sent" : rows[0].mail.sent,
    "recieved" : rows[0].mail.received,
    "content" : rows[0].mail.content,
    "subject" : rows[0].mail.subject,
    "star" : rows[0].mail.star,
    "mailbox": rows[0].mailbox,
  }
  return rows.length == 1 ? returnMail : undefined;
};

exports.deleteEmail = async (id) => {
  const selectDelete = 'DELETE FROM mail WHERE id = $1';
  const query = {
    text: selectDelete,
    values: [id],
  };
  await pool.query(query);
};

// exports.readdMail = async (id) => {
//   const update = `UPDATE mail SET mail->>'readd' = true WHERE id = $1`;
//   const query = {
//     text: update,
//     values: [id],
//   };
//   await pool.query(query);
// };

exports.putEmail = async (id, destination) => {
  const select = 'SELECT mailbox, id, mail FROM mail WHERE id = $1';
  const query2 = {
    text: select,
    values: [id],
  };
  const {rows} = await pool.query(query2);
  if (rows[0] == undefined) {
    return 404;
  }
  if (destination == 'star') {
    const mail = rows[0].mail;
    const starBool = !mail.star;
    const newMail = {
      "readd": mail.readd,
      "to" : mail.to,
      "from" : mail.from,
      "sent" : mail.sent,
      "recieved" : mail.received,
      "content" : mail.content,
      "subject" : mail.subject,
      "star" : starBool,
    }
    const update = `UPDATE mail SET mail = $2 WHERE id = $1`;
    const query = {
      text: update,
      values: [id, newMail],
    };
    await pool.query(query);
  } else if (rows[0].mailbox != destination) {
    if (destination == 'sent') {
      return 409;
    }
    const update = 'UPDATE mail SET mailbox = $2 WHERE id = $1';
    const query = {
      text: update,
      values: [id, destination],
    };
    await pool.query(query);
  }
};

exports.insertMail = async (mail) => {
  const currentTime = new Date();
  const {'to-name': toName} = mail;
  const {'to-email': toEmail} = mail;
  const {'from-name': fromName} = mail;
  const {'from-email': fromEmail} = mail;
  const insert = `INSERT INTO mail(mailbox, mail)
    VALUES ('sent', '{"to" : {"name" : "${toName}", "email" : "${toEmail}"}, 
    "from" : {"name" : "${fromName}", "email" : "${fromEmail}"},
    "content": "${mail.content}",
    "subject": "${mail.subject}",
    "star": false,
    "readd": false,
    "sent": "${currentTime}"}')`;
  const query = {
    text: insert,
  };
  await pool.query(query);
  const select = `SELECT id, mail FROM mail WHERE mail->>'sent' = $1`;
  const query2 = {
    text: select,
    values: [`${currentTime}`],
  };
  const {rows} = await pool.query(query2);
  return rows[0];
};

exports.insertMailbox = async (mailbox) => {
  const insert = `INSERT INTO mailbox(mailboxname, mailboxcount)
    VALUES ('${mailbox.mailboxname}', 0)`;
  const query = {
    text: insert,
  };
  await pool.query(query);
};

exports.getUsers = async () => {
  const select = 'SELECT username, email, avatar FROM userinfo';
  const query = {
    text: select,
  };
  const {rows} = await pool.query(query);
  const users = [];
  for (const row of rows) {
    users.push({
      username: row.username,
      email: row.email,
      avatar: row.avatar,
    });
  }
  return users;
}


exports.changeUser = async (user) => {
  let update = 'UPDATE userinfo SET username = $2 WHERE email = $1';
  let query = {
    text: update,
    values: [user.email, user.username],
  };
  await pool.query(query);
  update = 'UPDATE userinfo SET avatar = $2 WHERE email = $1';
  query = {
    text: update,
    values: [user.email, user.avatar],
  };
  await pool.query(query);
};

exports.selectSpecificUser = async (id) => {

  const select = 'SELECT * FROM userinfo WHERE email = $1';
  let query = {
    text: select,
    values: [id],
  };
  const {rows} = await pool.query(query);
  const user = rows[0];
  return rows.length == 1 ? user : undefined;
};
