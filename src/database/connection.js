import mysql from 'mysql'
const connection = mysql.createConnection({
  host     : 'mysql669.umbler.com',
  user     : 'deliverydb',
  password : 'deliveryapp',
  database : 'deliverydb',
  port:41890
});

connection.connect();
 
connection.query('SELECT * FROM produto', await function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
 
function ObterConexao(){
  connection.connect((error)=>{
    if(error){
      console.log('erro ao abrir a conexão com o banco: '+error.stack)
      return
    }

    console.log('Conexão com o banco bem sucedida!')
  })

  connection.query('SELECT * FROM produto', function (error, results, fields) {
    if (error) console.log('erro ao obter resultado');
    console.log(results)
  });
}

function FecharConexao(){
  connection.end((error)=>{
    if(error){
      console.log('erro ao fechar a conexão com o banco: '+error.stack)
      return
    }

    console.log('Conexão fechada com sucesso!')
  });
}

export {ObterConexao, FecharConexao}