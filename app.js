const express = require('express')
const app = express()
const path = require('path')
const session = require('express-session')

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))

const dias = 2
app.use(session({
    secret: 'afuckingdifficulthash',
    resave: false,
    saveUninitialized:true,
    cookie: {
        maxAge: 1000 * 60 * 24 * dias
    }
}))


const passwords = {1:'H1Ka70kebP3veo1MAg1', 2:'malbolge', 3:'hakonlie', 4:'banana', 5:'bielgomes'}
const levels = {'chave':1, 'linguagem':2, 'webdesign':3, 'letras':4, 'morse':5}

app.get('/', (req, res)=>{
    session.level = 1
    res.render('home.ejs')
})


app.get('/fase', (req, res)=>{
    let {id} = req.query
    if(session.level >= levels[id]){
        res.render(`fase${levels[id]}`)
    }else{
        res.render('error', {error_skip:true})
    }
})
app.post('/fase', (req, res)=>{
    let {id} = req.query
    id_ = levels[id]
    let {answ} = req.body
    if(answ == passwords[id_]){
        let prox_fase = id_ += 1
        session.level = prox_fase
        res.render(`fase${prox_fase}`)  
    }else{
        res.redirect(`fase?id=${id}`)
    }
})

app.get('/final', (req, res)=>{
    if(session.level >= 6){
        res.render('final')
    }else{
        res.render('error', {error_skip:true})
    }
})

app.get('*', (req, res) =>{
    res.render('error', {error_skip:false})
})




app.listen(process.env.PORT || 3000, ()=>{console.log('rodando')})