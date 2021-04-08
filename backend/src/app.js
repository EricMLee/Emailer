const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');

const mail = require('./mail');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiSpec = path.join(__dirname, '../api/openapi.yaml');

const apidoc = yaml.safeLoad(fs.readFileSync(apiSpec, 'utf8'));
app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));

app.use(
    OpenApiValidator.middleware({
      apiSpec: apiSpec,
      validateRequests: true,
      validateResponses: true,
    }),
);

app.get('/v0/mail', mail.getAll);
app.get('/v0/mail/:id', mail.getByID);
app.post('/v0/mail', mail.post);
app.put('/v0/mail/:id', mail.put);
app.delete('/v0/mail/:id', mail.delete);
// app.read('/v0/mail/:id', mail.read);

app.get('/v0/mailbox', mail.getMailbox);
app.post('/v0/mailbox', mail.postMailbox);
// app.get('/v0/mailbox/:id', mail.getByMailboxID);

app.get('/v0/user', mail.getUsers);
app.post('/v0/user', mail.updateUsers);
app.get('/v0/user/:id', mail.getSpecificUser);

app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});


module.exports = app;
