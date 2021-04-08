DROP TABLE IF EXISTS mail;
DROP TABLE IF EXISTS mailbox;
DROP TABLE IF EXISTS userinfo;
-- Your database schema goes here --
CREATE TABLE mail (
  id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
  mailbox VARCHAR(32),
  mail jsonb
);

CREATE TABLE mailbox (
  mailboxname VARCHAR(32),
  mailboxcount INTEGER,
  PRIMARY KEY(mailboxname)
);

CREATE TABLE userinfo (
  username VARCHAR(32),
  email VARCHAR(32),
  avatar VARCHAR(256),
  showavatar BOOLEAN,
  PRIMARY KEY(username)
);