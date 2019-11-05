# trabalho-microservice
Aula MBA FIAP - Turma 34SCJ - Trabalho Final Microservice

--------------------------------------------------------------
Projetos
--------------------------------------------------------------

Para rodar o container Microserviço de Projetos:

$ docker run --name projects-microservice -it -p 5050:5000 -d fernandalv/projects_microservice

--------------------------------------------------------------
Sprints
--------------------------------------------------------------

Para rodar Microserviço de Sprint no python:

$ source sprints_venv/bin/activate

$ pip3 install flask

$ pip3 install flask-cors

$ pip3 install connexion

$ pip3 install connexion[swagger-ui]

$ python3 server.py


Criar Docker Sprint

$ docker build -t imagem_sprints_microservice .

$ docker run --name sprints-microservice -it -p 5000:5000 -d imagem_sprints_microservice


Para rodar o container Microserviço de Sprints:

$ docker run --name sprints-microservice -it -p 5000:5000 -d fernandalv/sprints_microservice


OBS: Se não conectar Sprints com Projects:
Verificar o IpAddress de Projects e corrigir no sprints.py
OBS2: Solução momentania por não possuir link entre os containers
