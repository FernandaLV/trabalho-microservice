from datetime import datetime
from flask import jsonify, make_response, abort
import requests
import json

def get_timestamp():
	return datetime.now().strftime(("%Y-%m-%d %H:%M:%S"))

SPRINTS = {
	"Sprint1": {
		"name": "Sprint1",
		"description": "Primeiro sprint do projeto",
		"timestamp_start": get_timestamp(),
        "timestamp_end": "",
        "projectId": "Projeto1"
	},
}

def get_project_info(projectId):
    api_url_base = 'project_microservice://projects-microservice:5000/api/projects'
    headers = {'Content-Type': 'application/json'}

    api_url = '{0}/{1}'.format(api_url_base, projectId)

    response = requests.get(api_url, headers=headers)

    if response.status_code == 200:
        return json.loads(response.content.decode('utf-8'))
    else:
        return None

def read_all():
	dict_sprints = [SPRINTS[key] for key in sorted(SPRINTS.keys())]
	sprints = jsonify(dict_sprints)
	qtd = len(dict_sprints)
	content_range = "sprints 0-"+str(qtd)+"/"+str(qtd)
	# Configura headers
	sprints.headers['Access-Control-Allow-Origin'] = '*'
	sprints.headers['Access-Control-Expose-Headers'] = 'Content-Range'
	sprints.headers['Content-Range'] = content_range
	return sprints

def read_one(name):
    if name in SPRINTS:
        project = SPRINTS.get(name)
    else:
        abort(
            404, "Sprint {name} não encontrado".format(name=name)
        )
    return project

def create(sprint):
    name = sprint.get("name", None)
    description = sprint.get("description", None)
    projectId = sprint.get("projectId", None)
    if name not in SPRINTS and name is not None:
        
        project_info = get_project_info(projectId)
        if project_info is not None:

            SPRINTS[name] = {
                "name": name,
                "description": description,
                "projectId": projectId,
                "timestamp_start": get_timestamp(),
                "timestamp_end": "",
            }
            return make_response(
                "{name} criado com sucesso".format(name=name), 201
            )
        else:
            abort(
                406,
                "Projeto com nome {projectId} não existe".format(projectId=projectId),
            )
    else:
        abort(
            406,
            "Sprint com nome {name} já existe".format(name=name),
        )

def update(name, sprint):
    if name in SPRINTS:
        SPRINTS[name]["description"] = sprint.get("description")
        SPRINTS[name]["timestamp_end"] = sprint.get("timestamp_end")

        return SPRINTS[name]
    else:
        abort(
            404, "Sprint com nome {name} não encontrado".format(name=name)
        )

def delete(name):
    if name in SPRINTS:
        del SPRINTS[name]
        return make_response(
            "{name} deletado com sucesso".format(name=name), 200
        )
    else:
        abort(
            404, "Sprint com nome {name} não encontrado".format(name=name)
        )
