const express = require("express");
const axios = require("axios");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

// Rota principal - Lista todas as reparações
app.get("/", async (req, res) => {
    try {
        const response = await axios.get("http://localhost:3001/reparacoes");
        res.render("index", { reparacoes: response.data });
    } catch (error) {
        res.status(500).send("Erro ao obter dados da API");
    }
});

// Rota para listar tipos de intervenção
app.get("/intervencoes", async (req, res) => {
    try {
        const response = await axios.get("http://localhost:3001/intervencoes");
        res.render("intervencoes", { intervencoes: response.data });
    } catch (error) {
        res.status(500).send("Erro ao obter dados da API");
    }
});

// Rota para listar marcas e modelos dos carros intervencionados
app.get("/carros", async (req, res) => {
    try {
        const response = await axios.get("http://localhost:3001/reparacoes");
        const carros = response.data.reduce((acc, reparacao) => {
            const key = `${reparacao.viatura.marca} ${reparacao.viatura.modelo}`;
            if (!acc[key]) {
                acc[key] = { marca: reparacao.viatura.marca, modelo: reparacao.viatura.modelo, count: 0 };
            }
            acc[key].count++;
            return acc;
        }, {});
        res.render("carros", { carros: Object.values(carros) });
    } catch (error) {
        res.status(500).send("Erro ao obter dados da API");
    }
});

app.listen(3000, () => {
    console.log("Servidor em: http://localhost:3000");
});