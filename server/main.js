const express       = require('express');
const fileupload    = require('express-fileupload');
const bcrypt        = require('bcrypt');
const mysql         = require('promise-mysql');
const cookie_parser = require('cookie-parser');
const fs            = require('fs');
const util          = require('util');

const read = util.promisify(fs.readFile);

function randint(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const mpool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'nell',
  connectionLimit: 10
});

const auth_map = {};
const snips = {};

const get_id = (req) => {
  const auth_token = req.cookies['auth_token']
  const id = auth_map[auth_token];
  if (id === undefined) {
    return false;
  }
  return id;
}

const profile = async (req, res) => {
  try {
     const id = get_id(req)
     if (id === false) {
       res.send({'success':false, 'error':'You are not authenticated !'});
       return
     }
     res.send({'success': true, 'id': id})
   } catch(err) {
     res.send({'success': false,'error':`Unknown error: ${err}`});
   }
}

const login = async (req, res) => {
  try {
    const password = req.query['password'];
    const email = req.query['email'];

    const rows = await mpool.query(`SELECT role, phash, id FROM users WHERE email=?`, email)

    if (rows.length < 1) {
      res.send({'success':false, 'error':`User with email ${email} does not exist`});
    } else if (await bcrypt.compare(password, rows[0]['phash'])) {
      const auth_token = await bcrypt.genSalt(46);
      const id = rows[0]['id'];
      const role =  rows[0]['role'];
      auth_map[auth_token] = {'id': id, 'role': role};
      res.cookie('auth_token', auth_token, {maxAge: 10 * 365 * 24 * 60 * 60 * 1000, httpOnly: false });
      res.cookie('role', role, {maxAge: 10 * 365 * 24 * 60 * 60 * 1000, httpOnly: false });
      res.send({'success':true, 'auth_token': auth_token, 'role': role});
    } else {
      res.send({'success':false, 'error': 'Wrong password for this email !'});
    }

  } catch(err) {
    res.send({'success': false,'error':`Unknown error: ${err}`});
  }
};

const get_mails = async (req, res) => {
  const rows = await mpool.query(`SELECT email FROM users WHERE role=client`)
  const emails = [];
  for (row of rows) {
    emails.push(row[0]);
  }
  res.send({'emails': emails});
}

const handle_upload = async (req, res) => {
  try {

    const rows = await mpool.query(`SELECT id FROM users WHERE email=?`, req.body.email);
    if (rows.length < 1 || rows.length > 2) {
      res.status(404).send();
    } else {

      const auth_obj = auth_map[req.cookies['auth_token']]

      if (auth_obj['role'] !== 'laboratory') {
        console.log("Non laboratory user trying to update report !");
        res.status(404).send();
        return
      }
      const user_id = rows[0]['id'];
      const type = req.body.type === 'blood' ? 'blood' : 'DNA';
      const timestamp = Math.floor(Date.now() / 1000);
      const fname = `${user_id}_${timestamp}_${randint(1,4000)}.txt`

      const succ = await mpool.query(`INSERT INTO reports SET ?`,
        {'type': type, 'user_id': user_id, 'lab_id': auth_obj['id'], 'fname': fname});

      req.files.file.mv(`reports/${fname}`);
      res.redirect('/#!/update_reports');

    }

  } catch(err) {
    console.log(err);
    res.status(404).send();
  }
}

const validate_report = async (req, res) => {
  try {

    const auth_obj = auth_map[req.cookies['auth_token']];
    if (auth_obj['role'] === 'doctor') {
      const succ = await mpool.query(`UPDATE reports SET valid=true WHERE id=?`, req.query['id']);
      res.send({'success':true, 'message': 'validated'});
    } else {
      res.send({'success':false, 'message': 'Not allowed to validate this report !'});
    }
  } catch(err) {
    console.log(err);
    res.status(404).send();
  }
}

const get_reports = async (req, res) => {
  try {
    const auth_obj = auth_map[req.cookies['auth_token']];
    let rows = null;
    if(auth_obj['role'] === 'client') {
      rows = await mpool.query(`SELECT * FROM reports WHERE user_id=? and valid=true`, auth_obj['id']);
    } else if (auth_obj['role'] === 'doctor') {
      rows = await mpool.query(`SELECT * FROM reports WHERE valid=false`);
    } else {
      res.send({'success': false,'error':`Permission denied !`});
      return;
    }

    const files = [];
    for (let row of rows) {
      const fname = 'reports/' + row['fname'];
      const content = await read(fname, 'utf8');
      if (row['type'] === 'DNA') {
        const conditions = [];
        for (rrow of content.split('\n')) {
          const row = rrow.split('\t');
          if (snips[row[0]] !== undefined) {
            conditions.push(snips[row[0]]);
          }
        }
        files.push(conditions)
      } else {
        files.push(content)
      }
    }
    res.send({'rows':rows,'contents': files});
  } catch(err) {
    res.send({'success': false,'error':`Unknown error: ${err}`});
  }
}

// Use async fs in the future, for now this will do
fs.readFile('snips.tsv', 'utf8', (err, data) => {
  const rows = data.split('\n').map(x => x.split('\t'));
  for (let row of rows) {
    snips[row[0]] = {
      'effect': row[5]
      ,'snip': row[0]
      ,'supplement': row[3]
      ,'supplement info': row[4]
    }
  }

  const app = express();

  app.use(cookie_parser());
  app.use(fileupload());

  app.use('/', express.static('../client/'));
  app.get('/login', login);
  app.get('/profile', profile);

  app.get('/user_emails', get_mails);
  app.get('/reports', get_reports);
  app.get('/validate', validate_report);
  app.post('/upload_report', handle_upload);

  app.listen(7800, '127.0.0.1');
});
