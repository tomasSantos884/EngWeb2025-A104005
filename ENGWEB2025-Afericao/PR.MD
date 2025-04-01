# AFERIÇÃO


## EX-1

### Q1
-QUERY: db.livros.find({ title: /Love/i })

- RESULTADO: 366  

### Q2
- QUERY: db.livros.find(
    { author: /Austen$/i }, 
    { _id: 0, title: 1 }
).sort({ title: 1 })

- RESULTADO: [
  { title: 'Emma' },
  { title: 'Mansfield Park' },
  { title: 'Northanger Abbey' },
  { title: 'Persuasion' },
  { title: 'Pride and Prejudice' },
  { title: 'Pride and Prejudice and Zombies' },
  { title: 'Pride and Prejudice and Zombies: The Graphic Novel' },
  { title: 'Sense and Sensibility' },
  { title: 'The Complete Novels' }
]

### Q3

- QUERY: db.livros.aggregate([
    { $unwind: "$author" },  // Separa os autores armazenados em listas
    { $group: { _id: "$author" } },  // Agrupa para remover duplicates
    { $sort: { _id: 1 } },  // Ordena alfabeticamente
    { $project: { _id: 0, author: "$_id" } }  // Renomeia o campo para "author"
])


- RESULTADO: [
  { author: '#1-3)' },
  { author: '#4-5)' },
  { author: '(Goodreads Author)' },
  { author: ')' },
  { author: '50 Cent' },
  { author: "A'Mera Frieman" },
  { author: 'A. Elizabeth Delany' },
  { author: 'A. Kirk (Goodreads Author)' },
  { author: 'A. Lee Martinez (Goodreads Author)' },
  { author: 'A. Meredith Walters (Goodreads Author)' },
  { author: 'A. Merritt' },
  { author: 'A. Poulin Jr. (Translator)' },
  { author: 'A. Roger Merrill' },
  { author: 'A. Rose (Goodreads Author)' },
  { author: 'A. Vivanti Salmon (Translator)' },
  { author: 'A.A. Attanasio (Goodreads Author)' },
  { author: 'A.A. Milne' },
  { author: 'A.C. Bextor (Goodreads Author)' },
  { author: 'A.C. Crispin' },
  { author: 'A.C. Gaughen (Goodreads Author)' }
]


### Q4

-QUERY: db.livros.aggregate([
    { $unwind: "$genres" },  // Separa os gêneros armazenados como lista
    { $group: { _id: "$genres", count: { $sum: 1 } } },  // Conta quantos livros há por gênero
    { $sort: { count: -1 } }  // Ordena do gênero mais frequente para o menos frequente
])

-RESULTADO: [
  { _id: 'Fiction', count: 14461 },
  { _id: 'Fantasy', count: 7189 },
  { _id: 'Romance', count: 6746 },
  { _id: 'Young Adult', count: 5875 },
  { _id: 'Contemporary', count: 4709 },
  { _id: 'Novels', count: 4181 },
  { _id: 'Adult', count: 3927 },
  { _id: 'Audiobook', count: 3721 },
  { _id: 'Classics', count: 3707 },
  { _id: 'Historical Fiction', count: 3511 },
  { _id: 'Mystery', count: 3335 },
  { _id: 'Adventure', count: 3280 },
  { _id: 'Literature', count: 3149 },
  { _id: 'Paranormal', count: 2816 },
  { _id: 'Historical', count: 2764 },
  { _id: 'Nonfiction', count: 2626 },
  { _id: 'Science Fiction', count: 2440 },
  { _id: 'Magic', count: 2156 },
  { _id: 'Thriller', count: 2119 },
  { _id: 'Childrens', count: 2088 }
]

### Q5

-QUERY: db.livros.find(
    { characters: "Sirius Black" }, 
    { _id: 0, title: 1, isbn: 1 }
).sort({ title: 1 })


-RESULTADO: [
  {
    title: 'Harry Potter and the Deathly Hallows',
    isbn: '9780545010221'
  },
  {
    title: 'Harry Potter and the Goblet of Fire',
    isbn: '9999999999999'
  },
  {
    title: 'Harry Potter and the Order of the Phoenix',
    isbn: '9780439358071'
  },
  {
    title: 'Harry Potter and the Prisoner of Azkaban',
    isbn: '9780439655484'
  }
]

