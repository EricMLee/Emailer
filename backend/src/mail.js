const db = require('./db');

exports.getUsers = async (req, res) => {
  let users = await db.getUsers();
  res.status(200).json(users);
};

exports.updateUsers = async (req, res) => {
  await db.changeUser(req.body);
  res.status(201).send();
}

exports.getAll = async (req, res) => {
  let mails;
  if (req.query.from) {
    mails = await db.selectMail2(req.query.from);
  } else {
    mails = await db.selectMail(req.query.mailbox);
  }
  if (req.query.mailbox == undefined) {
    res.status(200).json(mails);
  } else {
    res.status(201).json(mails);
  }
};

exports.getByID = async (req, res) => {
  const email = await db.selectSpecific(req.params.id);
  if (email == undefined) {
    res.status(200).json({});
  } else {
    res.status(200).json(email);
  }
};

exports.put = async (req, res) => {
  const email = await db.putEmail(req.query.id, req.query.mailbox);
  if (email == 404) {
    res.status(404).send();
  } else if (email == 409) {
    res.status(409).send();
  } else {
    res.status(204).send();
  }
};

exports.delete = async (req, res) => {
  await db.deleteEmail(req.query.id);
  res.status(204).send();
};

exports.post = async (req, res) => {
  await db.insertMail(req.body);
  res.status(201).send();
};

exports.getMailbox = async (req, res) => {
  const mailboxes = await db.getMailboxes();
  res.status(200).json(mailboxes);
};

exports.postMailbox = async (req, res) => {
  await db.insertMailbox(req.body);
  res.status(201).send();
};

exports.getSpecificUser = async (req, res) => {
  const user = await db.selectSpecificUser(req.params.id);
  if (user == undefined) {
    res.status(200).json({});
  } else {
    res.status(200).json(user);
  }
};
// exports.read = async (req, res) => {
//   await db.readMail(req.query.id);
//   res.status(204).send();
// }
// exports.getByMailboxID = async (req, res) => {
//   const mailbox = await db.getMailboxInfo(req.params.id);
//   if (email == undefined) {
//     res.status(404).send();
//   } else {
//     res.status(200).json(mailbox);
//   }
// }