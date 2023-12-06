Ponderada 4 do módulo 6 de Engenharia de Software - 2023

# API de Gerenciamento de Usuários & Histórias

## Descrição
Este projeto é uma API simples para gerenciamento de usuários e histórias, utilizando o framework FastAPI e a API do Inferkit (antigo TalkToTransform).

## Instalação
1. Clone o repositório para sua máquina local:
   ```bash
   git clone https://github.com/Vitorhrds2/ES-MOD06-2023-ponderada04.git
   ```

2. Instale as dependências:
   ```bash
   pip install nome-da-dependencia
   ```

## Execução
1. Navegue até o diretório do projeto:
   ```bash
   cd api
   ```

2. Execute o servidor FastAPI:
   ```bash
   python main.py
   ```

   O servidor estará disponível em [http://127.0.0.1:8000](http://127.0.0.1:8000).

3. Acesse a documentação interativa da API em [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) para explorar os endpoints e testar as solicitações.

## Uso
- Para acessar o frontend, abra um navegador e vá para [http://127.0.0.1:8000](http://127.0.0.1:8000).

## Estrutura do Projeto
- `app`: Módulo principal contendo os arquivos relacionados ao FastAPI.
- `static e templates`: Pasta contendo arquivos estáticos, como HTML, CSS e JavaScript.
- `main.py`: Arquivo principal de execução do projeto e que contém todos os endpoints.
- `test.db`: Arquivo de banco de dados SQLite que armazena as tabelas e os dados presentes nelas.