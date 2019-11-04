# trabalho-microservice
Aula MBA FIAP - Turma 34SCJ - Trabalho Final Microservice


Para rodar o container Microserviço de Projetos:
    $ docker run --name projects-microservice -it -p 5050:5000 -d fernandalv/projects_microservice

Para rodar Microserviço de Sprint no python:
    $ source sprints_venv/bin/activate
    $ pip3 install flask
    $ pip3 install flask-cors
    $ pip3 install connexion
    $ pip3 install connexion[swagger-ui]
    $ python3 server.py
