const express=require('express');
const db=require('mongoose');
const bodyparser=require('body-parser');
const cors=require('cors');

const app=express();
app.use(bodyparser.json());
app.use(cors());

db.connect('mongodb://localhost:27017/todo',{
    family:4
});

db.connection.on('error',console.error.bind(console,"error throw while connecting to db"));

db.connection.once('open',()=>{
    console.log('db connected');
});

const List=db.model('list',new db.Schema({
    description:String,
    date:String

}));

app.post('/post',async(req,res)=>{
const lists=await new List(req.body).save();
res.send(lists);
});

app.get('/getAll',async(req,res)=>{
const lis=await List.find();
res.send(lis);
});

app.get('/getById/:id',async(req,res)=>{
const id=req.params.id;
const li=await  List.findOne({_id:id});
res.send(li);
});

app.delete('/delete/:id',async(req,res)=>{
const id=req.params.id;
const l=await  List.deleteOne({_id:id});
res.send(l);
});

app.put('/update/:id',async(req,res)=>{
const id=req.params.id;
const {title,description}=req.body;
const l=await List.updateOne({_id:id},{$set:{title:title,description:description }});
res.send(l);
});

app.listen(3000);

