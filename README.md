# UffAnunciaProject

## Dependências
Django  
React 
```cmd
pip install react-scripts --save  
pip install django-cors-headers  
pip install djangorestframework-simplejwt  
pip install whitenoise
```

## Setup
### Frontend (React)
```cmd
cd Frontend/anunciafrontend  
npm start  
```
### Backend (Django)
```cmd
cd Backend  
python manage.py runserver  
```

## Workflow
### Pegar versão mais recente da develop
```cmd
git checkout develop
git pull
```

### Criar nova branch e colocar no repositório
```cmd
git checkout -b [nome da branch ex: FEAT-5]
git push -u origin [nome da branch que você criou]
```

### Após desenvolver na branch, fazer o push
```cmd
git commit -am "mensagem"
git push
```

### Fazer pull request se necessário

## Arquivos úteis
### Backend/uffanuncia/uffanunciaapp
models.py : classes com as entidades do banco de dados em forma de objetos (Model do Django)  
serializers.py : serializers convertem um objeto para json, para utilizar no frontend  
urls.py: associa um endpoint da API a uma view do Django  
views.py : possui classes/funções auxiliares (views) que recebem uma requisição e retornam uma resposta  
-> cada requisição para a API feita no frontend vira um endpoint e uma função em views.py

### Frontend/anunciafrontend/src
App.js: associa as rotas do app a elementos da interface  
/components: possui elementos da interface (cada elemento representa uma página)  
-> Navegação entre elementos feita por 'navigate('/nome-rota-elemento')'  

## Como alterar o banco de dados

Use:
```
python manage.py makemigrations
python manage.py migrate
```
Para salvar alterações no banco de dados

## Testes
Ir para o diretório Backend e utilizar o comando
```
python manage.py test uffanunciaapp
```
Adicionar testes em test_views.py ou criar outro arquivo com 'test' no início.

### GitHub Workflow
O arquivo de configuração dos testes está em .github/workflows  
Está configurado para executar os comandos em 'run:' em cada push ou pull request  
