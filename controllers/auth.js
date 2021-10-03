const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  usre: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

exports.signin = async (req, res) => {
  try {
    const connection = await db;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        message: "please provide an email and password",
      });
    }
    connection.query(
      `SELECT * FROM login WHERE email="${email}"`,
      [email],
      async (error, results) => {
        if (
          !results || !results.length
        ) {

          res.status(401).send({
            message: "email  or password is incorrect",
          });
        } else if (!(bcrypt.compare(password, results[0].password))) {
          res.status(401).send({
            message: "email or password is incorrect",
          });
        } else {
          const id = results[0].id;

          const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });

          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60
            ),
            httpOnly: true,
          };

          res.cookie("jwt", token, cookieOptions);
          res.status(200).json({
            message: "Successfully Logged In",
            status: 200,
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
exports.signup = async (req, res) => {
  const signUpData = req.body;

  const { name, email, password } = req.body;

  db.query(
    "SELECT email FROM login WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
        throw new Error(error);
      }

      if (results > 0) {
        return res.render("signup", {
          message: "that email is already in use",
        });
      }

      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword, " << hashed");
      console.log(name, password, email);

      db.query(
        `INSERT INTO login  (name, email, password ) VALUES ("${ name }", "${ email }", "${ hashedPassword }" )`,
        { name: name, email: email, password: hashedPassword },
        (error, results) => {
          if (error) {
            console.log(error);
            throw error;
          } else {
            return res.render("signup", {
              message: "user signup",
            });
          }
        }
      );
    }
  );
};
