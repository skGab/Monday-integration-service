<!-- TITLE -->
<h1 align="center" color="black">Monday Integration Service</h1>

<!-- THUMB -->
<p align="center">
        <img src="./doc_thumb.png" width="250px" style="box-shadow: 1px 2px 4px gray;" alt="Logo do Projeto" object-fit="cover">
</p>

<!-- STATUS -->
<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/skGab/Monday-integration-service.svg)](https://github.com/skGab/Monday-integration-service/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/skGab/Monday-integration-service.svg)](https://github.com/skGab/Monday-integration-service/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<!-- DESCRIPTION -->
<p align="center"> 
        💡 
        Projeto de integração entre plataformas. Com o objetivo de otimizar a transferência de dados entre o CRM Monday e o armazenamento da Google BigQuery.
  <br> 
</p>

<!-- INTRO -->

## Índice

-   [Tecnologias](#tecnologies)
-   [Introdução & O que o sistema deve fazer](#goal)
-   [Funcionalidades](#features)
-   [Requerimentos de qualidade](#quality)
-   [Instruções de Uso](#glossary)
-   [Autor](#authors)

## Tecnologias <a name="tecnologies"></a>

- Node.js
- Typescript
- NestJS

## Objetivo <a name="goal"></a>

 Este serviço realiza a busca dos dados no CRM Monday, executa os tratamentos e validações necessários, e os encaminha para a BigQuery. Além disso, registra todos os logs durante o processo de transferência. Para facilitar a visualização desses registros, foi criado um painel frontend como um projeto separado. Este painel oferece uma interface intuitiva para visualizar os logs e inclui um botão com a funcionalidade de acionamento na rota do serviço.

## Funcionalidades <a name="features"></a>

- Requisição de dados da plataforma monday
- Validação e conversão de dados para padrão de armazenamento BigQuery
- Envio de payload para serviço de armazenamento Google BigQuery
- Controle de logs gerados pelas tarefas 

## Requerimentos de qualidade <a name="quality"></a>

- Escalavel
- Performance
- Sustentável

## Instruções de Uso <a name="glossary"></a>

- MONDAY_TOKEN (ENV): Este é um token de autenticação fornecido pelo CRM Monday para acessar e manipular os dados da plataforma. Você deve definir este token como uma variável de ambiente (ENV) no ambiente de execução do projeto.

- BIGQUERY_PROJECT_ID (ENV): Este é o ID do projeto na Google Cloud Platform que contém o armazenamento BigQuery. É necessário para autenticar e autorizar o acesso ao BigQuery.

- Credentials from '../../security/credentials.json': Este arquivo contém credenciais de segurança necessárias para autenticar o acesso a determinados recursos ou serviços. Certifique-se de que o caminho para este arquivo esteja corretamente configurado, pois ele será utilizado para a autenticação dentro do sistema.

- Certifique-se de ter o Node.js instalado em seu sistema. Em seguida, execute o seguinte comando para instalar as dependências do projeto:

``
npm install
``

<br>

- Para iniciar o servidor de desenvolvimento local, utilize o seguinte comando:

``
npm run start:dev
``

O sistema estará disponível em http://localhost:8080/. As alterações no código serão recarregadas automaticamente no navegador durante o desenvolvimento.

<br>

- Para criar a versão final do projeto otimizada para produção, execute o seguinte comando:

``
npm run build
``

Os arquivos finais serão gerados na pasta 'dist'.

<br>

- Após o processo de build, visualize a versão de produção localmente com o seguinte comando:


``
npm run start:prod
``

O sistema estará disponível em http://localhost:8080/ em uma versão otimizada para produção.

<br>

- O projeto utiliza ESLint para análise estática do código e Prettier para formatação. Verifique problemas de linting ou formate o código automaticamente com os seguintes comandos:

``
npm run lint
``

``
npm run format 
``

## Autor <a name="authors"></a>

-   [@Gabriel Assunção](https://github.com/skGab) - Ideia e Construção
