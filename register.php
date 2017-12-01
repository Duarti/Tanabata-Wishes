<?php
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *');

$conn = new PDO("mysql:host=localhost;dbname=tanabata_wishes", 'root', '');
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


/*$_GET['modo'] = 'new';

$str = "Also, parentheses are used to enclose the list of parameters to be passed to built-in functions, user-defined functions and stored routines. However, when no parameter is passed to a stored procedure, parentheses are optional. For builtin functions and user-defined functions, spaces are not allowed between the function name and the open parenthesis, unless the IGNORE_SPACE SQL_MODE is set. For stored routines (and for functions if IGNORE_SPACE is set) spaces are allowed before the open parenthesis, including tab characters and new line characters.";

$_POST['desejo'] = $str;*/


if($_GET['modo'] == 'search'){
	$sttm = $conn->query('SELECT * FROM palavra ORDER BY quantidade DESC LIMIT 10');
	$data = $sttm->fetchAll();
	$palavras = [];
	foreach ($data as $palavra) {
		$p = [];
		$p['id'] = $palavra['id'];
		$p['palavra'] = $palavra['palavra'];
		$p['quantidade'] = $palavra['quantidade'];
		$palavras[] = $p;
	}
	$data = json_encode($palavras, JSON_PRETTY_PRINT);
	echo $data;
}

if($_GET['modo'] == 'new'){

	$desejo = isset($_POST['desejo']) ? $_POST['desejo'] : "";

	if (empty($desejo)) {
		$json = ["success"=>false, "error"=>true, "msg:"=> 'O campo precisa ser preenchido!'];
	}else{
		try{
			$sttm = $conn->prepare("INSERT INTO desejo (texto) value (?)");
			$sttm->bindValue(1, $desejo);
			$sttm->execute();

			$palavras = str_replace(",", "", $desejo);
			$palavras = str_replace("!", "", $palavras);
			$palavras = str_replace(".", "", $palavras);
			$palavras = str_replace("@", "", $palavras);
			$palavras = str_replace("*", "", $palavras);
			$palavras = str_replace(";", "", $palavras);
			$palavras = str_replace(":", "", $palavras);
			$palavras = str_replace("/", "", $palavras);
			$palavras = str_replace("\\", "", $palavras);

			$palavras = explode(" ", $palavras);

			foreach ($palavras as $palavra) {

				$sttm = $conn->prepare("SELECT * FROM palavra WHERE palavra = ?");
				$sttm->execute([$palavra]);
				$data = $sttm->fetchAll();

				if(sizeof($data) > 0){

					$id = $data[0]['id'];
					$quantidade = $data[0]['quantidade']+1;

					$sttm = $conn->prepare("UPDATE palavra SET quantidade = ? WHERE id = ?");
					$sttm->execute([$quantidade, $id]);				
				
				}else{
					$sttm = $conn->prepare('INSERT INTO palavra (palavra) value (?)');
					$sttm->bindValue(1, $palavra);
					$sttm->execute();
				}
			}

			$sttm = $conn->query('SELECT * FROM desejo');
			$data = $sttm->fetchAll();
			$desejos = [];
			
			foreach ($data as $d) {
				//$p = [];
				$desejo = [];
				$desejo['id'] = $d['id'];
				$desejo['texto'] = $d['texto'];
				
				array_push($desejos, $desejo);
			}
			$data = $desejos;
			$data = json_encode($data, JSON_PRETTY_PRINT);
			
			//echo $data;

			//$json = ["msg: "=> 'Enviado com sucesso'];


			}catch(PDOException $e){
			$json = ["erro: "=> $e->getMessage];
		}
	}

	//$data = json_encode($json);
	echo $data;

	//return $json;

}
