const mysql = require('mysql')
const config  = require('../configurations.js')

const connection = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database
})

connection.connect((err) => {
  if (err) {
    console.log('error connecting to the db');
  } else {
    console.log('connected to the db');
  }
})

module.exports.createUser = function(userEmail, password, googleId, callback) {
  connection.query(
    `INSERT INTO users (id, user_email, password, google_id) VALUES (?, ?, ?, ?)`,
    [null, userEmail, password, googleId],
    function(err, response) {
      callback(err, response)
    }
  )
}

module.exports.createPhase = function(data, callback) {
  connection.query(
    `INSERT INTO phases (id, user_id, phase_label, phase_order) VALUES (?, ?, ?, ?)`,
    [null, data.userId, data.phaseLabel, data.phaseOrder],
    function(err) {
      callback(err)
    }
  )
}

module.exports.createApp = function(userId, data, callback) {
  connection.query(
    `INSERT INTO applications (id, user_id, phase_id, job_title, company, date_created, last_update, reminder_id, resume_id, cover_letter_id, point_of_contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [null, userId, data.phaseId, data.jobTitle, data.company, data.date, data.date, data.reminderId, data.resumeId, data.coverLetterId, data.contact],
    function(err, response) {
      if (err) console.error(err);
      callback(err, response)
    }
  )
}

module.exports.addDefaultPhases = function(userId, callback) {
  connection.query(
    `INSERT INTO phases (id, user_id, phase_label, phase_order)
    VALUES (null, ${userId}, 'Not Yet Applied', 0),
    (null, ${userId}, 'Applied', 1),
    (null, ${userId}, 'Received Response', 2),
    (null, ${userId}, 'Interviewed', 3),
    (null, ${userId}, 'Received Job Offer', 4)`,
    function(err) {
      callback(err)
    }
  )
}

module.exports.addFile = function(userId, s3url, filename, callback) {
  connection.query(
    `INSERT INTO files (id, user_id, s3_url, file_name)
    VALUES (null, ${userId}, '${s3url}', "${filename}")`,
    function(err) {
      callback(err)
    }
  )
}

module.exports.addContact = function(userId, data, callback) {
  connection.query(
    `INSERT INTO contacts (id, user_id, app_id, contact_email, contact_phone, first_name, last_name, company, job_title, department) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [null, userId, data.appId, data.contactEmail, data.contactPhone, data.firstName, data.lastName, data.company, data.title, data.department],
    function(err, response) {
      callback(err, response)
    }
  )
}

module.exports.getUser = function(userId, callback) {
  connection.query(
    `SELECT * FROM users WHERE id = ${userId}`,
    function(err, results) {
      callback(err, results)
    }
  )
}

module.exports.getUserCredentials = function(userEmail, callback) {
  connection.query(
    `SELECT * FROM users WHERE user_email = '${userEmail}'`,
    function(err, results) {
      callback(err, results)
    }
  )
}

module.exports.getGoogleCredentials = function(googleId, callback) {
  connection.query(
    `SELECT * FROM users WHERE google_id = '${googleId}'`,
    function(err, results) {
      callback(err, results)
    }
  )
}

module.exports.getUserPhases = function(userId, callback) {
  connection.query(
    `SELECT * FROM phases WHERE user_id = ${userId} ORDER BY phase_order ASC`,
    function(err, results) {
      callback(err, results)
    }
  )
}

module.exports.getUserApps = function(userId, callback) {
  connection.query(
    `SELECT * FROM applications WHERE user_id = ${userId}`,
    function(err, results) {
      callback(err, results)
    }
  )
}

module.exports.getNotes = function(userId, callback) {
  connection.query(
    `SELECT * FROM notes WHERE user_id = ${userId}`,
    function(err, results) {
      callback(err, results)
    }
  )
}

module.exports.getReminders = function(userId, callback) {
  connection.query(
    `SELECT * FROM reminders WHERE user_id = ${userId}`,
    function(err, results) {
      callback(err, results)
    }
  )
}

module.exports.getContacts = function(userId, callback) {
  connection.query(
    `SELECT * FROM contacts WHERE user_id = ${userId}`,
    function(err, results) {
      callback(err, results)
    }
  )
}

module.exports.getFiles = function(userId, callback) {
  connection.query(
    `SELECT * FROM files WHERE user_id = ${userId}`,
    function(err, results) {
      callback(err, results)
    }
  )
}

module.exports.updateToken = function(userId, accessToken, refreshToken, callback) {
  connection.query(
    `UPDATE users SET access_token = '${accessToken}', refresh_token = '${refreshToken}' WHERE id = ${userId}`,
    function(err) {
      callback(err)
    }
  )
}

module.exports.updatePhaseOrder = function(phases, callback) {
  for (let i = 0; i < phases.length; i++) {
    connection.query(
      `UPDATE phases SET phase_order = ${i} WHERE id = ${phases[i].id}`,
      function(err) {
        callback(err)
      }
    )
  }
}

module.exports.updateReminder = function(data, callback) {
  connection.query(
    `UPDATE applications
    SET reminder_id = ${data.reminderId}
    WHERE id = ${data.id}`,
    function(err) {
      callback(err)
    }
  )
}

module.exports.updateContact = function(data, callback) {
  connection.query(
    `UPDATE applications
    SET point_of_contact = ${data.contact}
    WHERE id = ${data.id}`,
    function(err) {
      callback(err)
    }
  )
}

module.exports.updateResume = function(data, callback) {
  connection.query(
    `UPDATE applications
    SET resume_id = ${data.resume}
    WHERE id = ${data.app}`,
    function(err) {
      callback(err)
    }
  )
}

module.exports.updateCoverLetter = function(data, callback) {
  connection.query(
    `UPDATE applications
    SET cover_letter_id = ${data.coverletter}
    WHERE id = ${data.app}`,
    function(err) {
      callback(err)
    }
  )
}

module.exports.updateStatus = function(data, callback){
  connection.query(
    `UPDATE applications
    SET phase_id=${data.newStatusId}
    WHERE id=${data.appId}`,
    function(err){
      callback(err)
    }
  )
}

module.exports.deletePhase = function(phaseId, callback) {
  connection.query(
    `DELETE FROM phases WHERE id = ${phaseId}`,
    (err) => callback(err)
  )
}

module.exports.deleteApp = function(appId, callback) {
  connection.query(
    `DELETE FROM applications WHERE id = ${appId}`,
    function(err) {
      callback(err)
    }
  )
}

module.exports.deleteNote = function(id, callback) {
  connection.query(
    `DELETE FROM notes WHERE id = ${id}`,
    function(err) {
      callback(err)
    }
  )
}

module.exports.deleteNotes = function(appId, callback) {
  connection.query(
    `DELETE FROM notes WHERE app_id = ${appId}`,
    function(err) {
      callback(err)
    }
  )
}

module.exports.deleteReminders = function(appId, callback) {
  connection.query(
    `DELETE FROM reminders WHERE app_id = ${appId}`,
    function(err) {
      callback(err)
    }
  )
}

module.exports.deleteContacts = function(appId, callback) {
  connection.query(
    `DELETE FROM contacts WHERE app_id = ${appId}`,
    function(err) {
      callback(err)
    }
  )
}

module.exports.addReminder = function(data, callback) {
  connection.query(
    `INSERT INTO reminders (
      id,
      user_id, app_id,
      user_email,
      job_title,
      company,
      due_date,
      text_desc)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [null, data.userId, data.appId, data.email, data.jobTitle, data.company, data.date, data.description],
    function(err, response) {
      callback(err, response)
    }
  )
}

module.exports.addNotes = function(data, callback) {
  connection.query(
    `INSERT INTO notes (
      id,
      app_id,
      note_text,
      user_id)
    VALUES (?, ?, ?, ?)`,
    [null, data.appId, data.text, data.userId],
    function(err) {
      callback(err)
    }
  )
}

module.exports.saveNotificationData = function(data, callback){
  data = JSON.parse(data)
  connection.query(`UPDATE users
    SET notif_endpoint="${data.endpoint}",
    notif_key="${data.keys.p256dh}",
    notif_auth="${data.keys.auth}"
    WHERE id=${data.id}
  `)
}
