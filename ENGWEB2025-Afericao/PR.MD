# AFERIÇÃO


## EX-1

### Q1
db.livros.find({ title: /Love/i })



### Q2
db.livros.find(
    { author: /Austen$/i }, 
    { _id: 0, title: 1 }
).sort({ title: 1 })



### Q3

db.livros.aggregate([
    { $unwind: "$author" },  
    { $group: { _id: "$author" } }
    { $sort: { _id: 1 } },  
    { $project: { _id: 0, author: "$_id" } }
])





### Q4

db.livros.aggregate([
    { $unwind: "$genres" },  
    { $group: { _id: "$genres", count: { $sum: 1 } } },  
    { $sort: { count: -1 } }  
])


### Q5

db.livros.find(
    { characters: "Sirius Black" }, 
    { _id: 0, title: 1, isbn: 1 }
).sort({ title: 1 })


