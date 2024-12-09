# UffAnunciaProject

## Dependências
Django  
React  
pip install react-scripts --save  
pip install django-cors-headers  
pip install djangorestframework-simplejwt  
pip install whitenoise


## Setup
### Frontend (React)
cd Frontend/anunciafrontend  
npm start  

### Backend (Django)
cd Backend  
python manage.py runserver  

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
