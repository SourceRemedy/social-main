const express = require('express')
const sqlite3 = require('sqlite3')
const app = new express()
const db = new sqlite3.Database('./db/social.db')
const users = loadData().users
//3. New posts save on server

//serve client side files
app.use(express.static('public'))
app.use(express.json())

app.get("/posts", (req,res) => {
    const sql = "SELECT * FROM posts;"
    db.all(sql,[],(err, rows) => {
        res.send(rows)
    })
})
//4.1 handle a GET request on /users
app.get("/users",(req, res) => {
    const sql = "SELECT * FROM posts"
    db.all(sql,[],(err, rows) => {
        res.send(rows)
    })
})

app.post("/friends", (req, res) => {
    const friendship = req.body
    const sql = "INSERT INTO users_users (userid1, userid2) VALUES (?,?)"
    //name line
    db.run(sql,[friendship.user_id, friendship.freind_id],(err) => {
        if (err) console.error(err)
        res.send({
            message: "You are now friends!",
            friendshipId: this.lastID
        })
    })
})

//3.2 define request handler for POST on /posts
app.post("/posts", (req,res)=> {
    const post = req.body;
    //3.2.1. verify the post is at least 5 characters long
    if (post.text.length >= 5) {
        //3.2.2. add to posts array if valid
        const sql = "INSERT INTO posts (content, user_id) VALUES (?,?);"
        db.run(sql,[post.text,post.user_id])
        //3.2.3. send response 'New post successfully saved.'
        res.send({
            message: "Post successfully saved"
        })
    }
    //3.2.4. if invalid send error response
    else {
        res.status(401)
        res.send({
            message: "Post is not long enough."
        })
    }
})

app.post("/login", (req, res) => {
    const user = req.body
    //5. retrieve all users from database
    //6. only retrieve users with matching username and password
    const sql2 = "SELECT id, first_name, last_name, FROM users WHERE username = ? AND password = ?"
    db.all(sql2,[user,username, user.password],(err, rows) => {
        if (rows && rows.length > 0) {
            res.send({
                message: "Successful login!",
                user: rows[0]
            })
        }
    

    //let userMatch = users.find( (u) => u.username == user.username && u.password == user.password )
    //Does userMatch exist?
    
    else {
        if (user.username.length >= 4 && user.password.length >= 4) {
            //save new account on server
            //4. New user is stored in database
            const sql = "INSERT INTO users (username, password, first_name, last_name) VALUES (?,?,?,?)"
            db.run(sql,[user.username, user.password, user.firstName, user.lastName],(err) => {
                if (err) console.error(err)
                res.send({
                    message: "Your account was successfully created.",
                    userId: this.lastID
                })
            })
        }
        else {
            res.status(401)
            res.send({
                message: "Username or password is invalid."
            })
        }
    }
    })
})

app.listen(3000, () => console.log("Server started"))

function loadData() {
    return {
        users:
        [
            {
                id: 1,
                username: "jword",
                password: "hello2021"
            },
            {
                id: 2,
                username: "tommyinnit",
                password: "blockgame"
            },
            {
                id: 3,
                username: "joel15",
                password: "kirby"
            }
        ]
    }
}