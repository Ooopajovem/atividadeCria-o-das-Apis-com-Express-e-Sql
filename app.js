const express = require('express')
const mysql = require('mysql2')

const app = express ();

const PORT = process.env.PORT ||5001;

const connection = mysql.createConnection({
    //host:'127.0.0.1',
    //user:'aluno',
    //password:'ifpecjbg',
    //database:'teste'
    host:'127.0.0.1',
    user:'root',
    password:'251902',
    database:'teste'
})

connection.connect((err)=> {
    if (err) {
        console.error('Erro ao conenctar no MySQL: '+ err.message)
    }
    else{
        console.log('Conectado ao MySQL')
    }
})

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.post('/api/categorias', (req, res)=> {//add alguma coisa
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


app.get('/api/categorias', (req, res) => {//tudo
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




app.put('/api/categorias/:id', (req, res) => {//edita usando o id ou no nome na url
    const { id } = req.params;
    const { nome, descricao } = req.body;

    const nomeCondition = nome ? 'nome LIKE ?' : '1';

    const sql = `UPDATE categorias SET nome = ?, descricao = ? WHERE id = ? AND ${nomeCondition}`;
    
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


app.delete('/api/categorias/:identifier', (req, res) => {
    const { identifier } = req.params;

    const isNumeric = /^\d+$/.test(identifier);
    let sqlGetProducts, sqlDeleteCategory, valuesGetProducts, valuesDeleteCategory;

    if (isNumeric) {
        sqlGetProducts = 'SELECT COUNT(*) AS productCount FROM produtos WHERE id_categoria = ?';
        sqlDeleteCategory = 'DELETE FROM categorias WHERE id = ?';
        valuesGetProducts = [identifier];
        valuesDeleteCategory = [identifier];
    } else {
        sqlGetProducts = 'SELECT COUNT(*) AS productCount FROM produtos WHERE nome = ?';
        sqlDeleteCategory = 'DELETE FROM categorias WHERE nome = ?';
        valuesGetProducts = [identifier];
        valuesDeleteCategory = [identifier];
    }

    connection.query(sqlGetProducts, valuesGetProducts, (err, productResult) => {
        if (err) {
            console.error('Erro ao verificar produtos associados à categoria: ' + err.message);
            res.status(500).json({ message: 'ERRO ao excluir categoria' });
            return;
        }

        const productCount = productResult[0].productCount;

        if (productCount > 0) {
            console.log('Não é possível excluir a categoria, pois há produtos associados a ela');
            res.status(400).json({ message: 'Não é possível excluir a categoria, pois há produtos associados a ela' });
            return;
        }

        connection.query(sqlDeleteCategory, valuesDeleteCategory, (err, result) => {
            if (err) {
                console.error('Erro ao excluir categoria: ' + err.message);
                res.status(500).json({ message: 'ERRO ao excluir categoria' });
            } else {
                if (result.affectedRows > 0) {
                    console.log('Categoria excluída com sucesso');
                    res.status(200).json({ message: 'Categoria excluída com sucesso' });
                } else {
                    console.log('Categoria não encontrada');
                    res.status(404).json({ message: 'Categoria não encontrada' });
                }
            }
        });
    });
});

////////////////////////////////////////////////////////////

app.post('/api/clientes', (req, res)=> {
    const{nome,email,endereco,telefone} =  req.body;
    
    const sql = 'INSERT INTO clientes (nome, email, endereco, telefone) VALUES (?, ?, ?, ?)'
    connection.query(sql,[nome, email,endereco,telefone], (err, results) => {
        if(err){
            console.error('Erro ao inserir Cliente: '+err.message)
            res.status(500).json({error:'ERRO ao inserir Cliente'})
        }
        else{
            console.log('Cliente inserido com sucesso!')
            res.status(201).json({message: 'Cliente inserido com sucesso'})
        }
    });
});


app.get('/api/clientes', (req, res) => {
    const sql = 'SELECT * FROM clientes';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar Cliente: ',err+message)
            res.status(500).json({error:' Erro ao buscar Cliente'})
        }
        else{
            res.status(200).json(results)
        }
    })
})


app.put('/api/clientes/:identifier', (req, res) =>{
    const { identifier } = req.params;
    const { nome, email, endereco, telefone } = req.body; 

    const isNumeric = /^\d+$/.test(identifier);
    let sql, values;

    if (isNumeric) {
        sql = 'UPDATE clientes SET nome = ?, email = ?, endereco = ?, telefone = ? WHERE id = ?';
        values = [nome, email, endereco, telefone, identifier];
    } else {
        sql = 'UPDATE clientes SET nome = ?, email = ?, endereco = ?, telefone = ? WHERE nome = ?';
        values = [nome, email, endereco, telefone, identifier];
    }

    connection.query(sql, values, (err, result) =>{
        if (err){
            console.error('Erro ao atualizar Cliente: ' + err.message);
            res.status(500).json({ message: 'ERRO ao atualizar Cliente' });
        } else {
            if (result.affectedRows > 0){
                console.log('Cliente atualizado com sucesso');
                res.status(200).json({ message: 'Cliente atualizado com sucesso' });
            } else {
                console.log('Cliente não encontrado');
                res.status(404).json({ message: 'Cliente não encontrado' });
            }
        }
    });
});


app.delete('/api/clientes/:identifier', (req, res) => {
    const { identifier } = req.params;

    const isNumeric = /^\d+$/.test(identifier);
    let sqlCheckOrders, sqlDeleteClient, valuesCheckOrders, valuesDeleteClient;

    if (isNumeric) {
        sqlCheckOrders = 'SELECT COUNT(*) AS orderCount FROM pedidos WHERE id_cliente = ?';
        sqlDeleteClient = 'DELETE FROM clientes WHERE id = ?';
        valuesCheckOrders = [identifier];
        valuesDeleteClient = [identifier];
    }

    connection.query(sqlCheckOrders, valuesCheckOrders, (err, orderResult) => {
        if (err) {
            console.error('Erro ao verificar pedidos associados ao cliente: ' + err.message);
            res.status(500).json({ message: 'ERRO ao excluir cliente' });
            return;
        }

        const orderCount = orderResult[0].orderCount;

        if (orderCount > 0) {
            console.log('Não é possível excluir o cliente, pois há pedidos associados a ele');
            res.status(400).json({ message: 'Não é possível excluir o cliente, pois há pedidos associados a ele' });
            return;
        }

        connection.query(sqlDeleteClient, valuesDeleteClient, (err, result) => {
            if (err) {
                console.error('Erro ao excluir cliente: ' + err.message);
                res.status(500).json({ message: 'ERRO ao excluir cliente' });
            } else {
                if (result.affectedRows > 0) {
                    console.log('Cliente excluído com sucesso');
                    res.status(200).json({ message: 'Cliente excluído com sucesso' });
                } else {
                    console.log('Cliente não encontrado');
                    res.status(404).json({ message: 'Cliente não encontrado' });
                }
            }
        });
    });
});


/////////////////////////////////////////////

app.post('/api/pedidos', (req, res) => {
    const { id_cliente, data_pedido, status } = req.body;
    
    const sql = 'INSERT INTO pedidos (id_cliente, data_pedido, status) VALUES (?, ?, ?)'; //"2024-03-16 sem isso aqui:T03:00:00.000Z"
    connection.query(sql, [id_cliente, data_pedido, status], (err, results) => {
        if (err) {
            console.error('Erro ao inserir registro: ' + err.message);
            res.status(500).json({ error: 'ERRO ao inserir pedido' });
        } else {
            console.log('Registro inserido com sucesso!');
            res.status(201).json({ message: 'Pedido inserido com sucesso' });
        }
    });
});


app.get('/api/pedidos', (req, res) => {
    const sql = 'SELECT * FROM pedidos';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar registro: ',err+message)
            res.status(500).json({error:' Erro ao buscar pedidos'})
        }
        else{
            res.status(200).json(results)
        }
    })
})

app.put('/api/pedidos/:id', (req, res) => {
    const { id } = req.params;
    const { id_cliente, data_pedido, status } = req.body;

    const sql = 'UPDATE pedidos SET id_cliente = ?, data_pedido = ?, status = ? WHERE id = ?';
    const values = [id_cliente, data_pedido, status, id];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao atualizar pedido: ' + err.message);
            res.status(500).json({ message: 'ERRO ao atualizar pedido' });
        } else {
            if (result.affectedRows > 0) {
                console.log('Pedido atualizado com sucesso');
                res.status(200).json({ message: 'Pedido atualizado com sucesso' });
            } else {
                console.log('Registro não encontrado');
                res.status(404).json({ message: 'Pedido não encontrado' });
            }
        }
    });
});


app.delete('/api/pedidos/:id', (req, res) => {
    const { id } = req.params
    
    const sql = 'DELETE FROM pedidos WHERE id = ?'
    connection.query(sql, [id], (err, result) =>{
        if (err){
            console.error('Erro ao excluir registro: '+ err.message)
            res.status(500).json({message:'ERRO ao excluido com registro'})
        }
        else {
            if (result.affectedRows > 0){
                console.log('Pedido excluido com sucesso')
                res.status(200).json({message: 'Pedido excluido com sucesso'})
            }
            else {
                console.log('Registro nao encontrado')
                res.status(404).json({message: 'Pedido nao encntrado'})
            }
        }
    })

})


//////////////////////////////////////////////

app.post('/api/produtos', (req, res) => {
    const { nome, descricao, preco, id_categoria, disponivel } = req.body;
    
    const sql = 'INSERT INTO produtos (nome, descricao, preco, id_categoria, disponivel) VALUES (?, ?, ?, ?, ?)'; //"2024-03-16 sem isso aqui:T03:00:00.000Z"
    connection.query(sql, [nome, descricao, preco, id_categoria, disponivel], (err, results) => {
        if (err) {
            console.error('Erro ao inserir registro: ' + err.message);
            res.status(500).json({ error: 'ERRO ao inserir produtos' });
        } else {
            console.log('Registro inserido com sucesso!');
            res.status(201).json({ message: 'Produtos inserido com sucesso' });
        }
    });
});



app.get('/api/produtos', (req, res) => {
    const sql = 'SELECT * FROM produtos';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar registro: ',err+message)
            res.status(500).json({error:' Erro ao buscar produtos'})
        }
        else{
            res.status(200).json(results)
        }
    })
})



app.put('/api/produtos/:id', (req, res) => {
    const { id } = req.params;
    const {nome, descricao, preco, id_categoria, disponivel } = req.body;

    const sql = 'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, id_categoria = ?, disponivel = ? WHERE id = ?';
    const values = [nome, descricao, preco, id_categoria, disponivel, id];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao atualizar produto: ' + err.message);
            res.status(500).json({ message: 'ERRO ao atualizar produto' });
        } else {
            if (result.affectedRows > 0) {
                console.log('Produto atualizado com sucesso');
                res.status(200).json({ message: 'Produto atualizado com sucesso' });
            } else {
                console.log('Produto não encontrado');
                res.status(404).json({ message: 'Produto não encontrado' });
            }
        }
    });
});


app.delete('/api/produtos/:id', (req, res) => {
    const { id } = req.params
    
    const sql = 'DELETE FROM produtos WHERE id = ?'
    connection.query(sql, [id], (err, result) =>{
        if (err){
            console.error('Erro ao excluir produto: '+ err.message)
            res.status(500).json({message:'ERRO ao excluido com produto'})
        }
        else {
            if (result.affectedRows > 0){
                console.log('Produto excluido com sucesso')
                res.status(200).json({message: 'Produto excluido com sucesso'})
            }
            else {
                console.log('Registro nao encontrado')
                res.status(404).json({message: 'Produto nao encntrado'})
            }
        }
    })

})

////////////////////////////////////////////////

app.post('/api/itenspedido', (req, res) => {
    const { id_pedido, id_produto, quantidade, preco_unitario } = req.body;
    
    const sql = 'INSERT INTO itenspedido (id_pedido, id_produto, quantidade, preco_unitario) VALUES (?, ?, ?, ?)'; //"2024-03-16 sem isso aqui:T03:00:00.000Z"
    connection.query(sql, [id_pedido, id_produto, quantidade, preco_unitario], (err, results) => {
        if (err) {
            console.error('Erro ao inserir item: ' + err.message);
            res.status(500).json({ error: 'ERRO ao inserir item' });
        } else {
            console.log('Item inserido com sucesso!');
            res.status(201).json({ message: 'Item inserido com sucesso' });
        }
    });
});



app.get('/api/itenspedido', (req, res) => {
    const sql = 'SELECT * FROM itenspedido';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar registro: ',err+message)
            res.status(500).json({error:' Erro ao buscar item'})
        }
        else{
            res.status(200).json(results)
        }
    })
})



app.put('/api/itenspedido/:id', (req, res) => {
    const { id } = req.params;
    const {id_pedido, id_produto, quantidade, preco_unitario } = req.body;

    const sql = 'UPDATE itenspedido SET id_pedido = ?, id_produto = ?, quantidade = ?, preco_unitario = ? WHERE id = ?';
    const values = [id_pedido, id_produto, quantidade, preco_unitario, id];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao atualizar item: ' + err.message);
            res.status(500).json({ message: 'ERRO ao atualizar item' });
        } else {
            if (result.affectedRows > 0) {
                console.log('Item atualizado com sucesso');
                res.status(200).json({ message: 'Item atualizado com sucesso' });
            } else {
                console.log('Item não encontrado');
                res.status(404).json({ message: 'Item não encontrado' });
            }
        }
    });
});


app.delete('/api/itenspedido/:id', (req, res) => {
    const { id } = req.params
    
    const sql = 'DELETE FROM itenspedido WHERE id = ?'
    connection.query(sql, [id], (err, result) =>{
        if (err){
            console.error('Erro ao excluir item: '+ err.message)
            res.status(500).json({message:'ERRO ao excluido com item'})
        }
        else {
            if (result.affectedRows > 0){
                console.log('Item excluido com sucesso')
                res.status(200).json({message: 'Item excluido com sucesso'})
            }
            else {
                console.log('Item nao encontrado')
                res.status(404).json({message: 'Item nao encntrado'})
            }
        }
    })

})



app.listen(PORT, console.log(`Servidor iniciado na porta ${PORT}`))