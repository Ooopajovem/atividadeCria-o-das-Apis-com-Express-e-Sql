
const express = require('express')
const mysql = require('mysql2')
const app = express ()




app.post('/api/categorias', (req, res)=> {
    const{nome,descricao} =  req.body;
    
    const sql = 'INSERT INTO categorias (nome, descricao) VALUES (?, ?)'
    connection.query(sql,[nome, descricao], (err, results) => {
        if(err){
            console.error('Erro ao inserir registro: '+err.message)
            res.status(500).json({error:'ERRO ao inserir registro'})
        }
        else{
            console.log('Registro inserido com sucesso!')
            res.status(201).json({message: 'Registro inserido com sucesso'})
        }
    });
});


app.get('/api/categorias', (req, res) => {
    const sql = 'SELECT * FROM categorias';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar registro: ',err+message)
            res.status(500).json({error:' Erro ao buscar registros'})
        }
        else{
            res.status(200).json(results)
        }
    })
})




app.put('/api/categorias/:id', (req, res) => {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    // Verifica se o nome está presente antes de adicionar à consulta SQL
    const nomeCondition = nome ? 'nome LIKE ?' : '1';

    // Monta a consulta SQL com a condição do nome
    const sql = `UPDATE categorias SET nome = ?, descricao = ? WHERE id = ? AND ${nomeCondition}`;
    
    // Monta o valor para a condição do nome
    const nomeValue = nome ? `%${nome}%` : null;

    connection.query(sql, [nome, descricao, id, nomeValue], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar registro: ' + err.message);
            res.status(500).json({ error: 'Erro ao atualizar registro' });
        } else {
            if (result.affectedRows === 0) {
                console.log('Nenhum registro encontrado para atualização.');
                res.status(404).json({ message: 'Nenhum registro encontrado para atualização.' });
            } else {
                console.log('Registro atualizado com sucesso!');
                res.status(200).json({ message: 'Registro atualizado com sucesso' });
            }
        }
    });
});
