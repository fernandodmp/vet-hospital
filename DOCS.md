## **Retorna os Doutores**

Retorna todos os doutores cadastrados no sistema

- **URL**

  /doctors

- **Method:**

  `GET`

* **Success Response:**

  - **Code:** 200 <br />
    **Content:**

    `[{"id": 1, "nome": joao, "especialidade": "Cardiologista"}]`

---

## **Cadastra Doutor**

Efetua o cadastro de um novo doutor no sistema

- **URL**

  /doctors

- **Method:**
  `POST`

- **Request Data**

  - **Body** <br/>
    **Required:**

    `nome: string | especialidade: string`

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**

    `{"id": 1, "nome": "Joao", "especialidade": "Cardiologista"}`

- **Error Response:**

  - **Code:** 500 INTERNAL SERVER ERROR<br />

---

## **Atualiza Doutor**

Efetua a atualização das informações de um doutor já cadastrado

- **URL**

  /doctors/:id

- **Method:**

  `PATCH`

- **Request Data**

  **Required:**

  `id: number`

- **Request Data**

  - **Body** <br/>
    **Optional:**

    `nome: string | especialidade: string`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**

    `{"id": 1, "nome": "Joao", "especialidade": "Cardiologista"}`

- **Error Response:**

  - **Code:** 500 INTERNAL SERVER ERROR <br />

  OR

  - **Code:** 404 NOT FOUND <br />

---

## **Deleta Doutor**

Efetua a remoção de um doutor já cadastrado

- **URL**

  /doctors/:id

- **Method:**

  `DELETE`

- **Request Data**

  **Required:**

  `id: number`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**

    `{"id": 1, "nome": "Joao", "especialidade": "Cardiologista"}`

- **Error Response:**

  - **Code:** 500 INTERNAL SERVER ERROR <br />

  OR

  - **Code:** 404 NOT FOUND <br />

---

## **Cadastra Atendimento**

Efetua o cadastro de um novo atendimento

- **URL**

  /appointments

- **Method:**

  `POST`

- **Request Data**

  -**Body** <br />
  **Required:**

  `nome: string | especie: string | raca: string | atendimento: string | urgente: boolean`

- **Success Response:**

  - **Code:** 201 CREATED<br />
    **Content:**

    `{ "id": 2, "nome": "Apolo", "especie": "Cachorro", "raca": "SRD", "atendimento": "Ortopedia", "urgencia": false, "status": "PENDENTE" }`

- **Error Response:**

  - **Code:** 500 INTERNAL SERVER ERROR <br />

---

## **Busca Atendimentos**

Retorna todos os atendimentos já cadastrados no sistema

- **URL**

  /appointments

- **Method:**

  `GET`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**

    `[ { "id": 2, "nome": "Apolo", "especie": "Cachorro", "raca": "SRD", "atendimento": "Ortopedia", "urgencia": false, "status": "PENDENTE" } ]`

- **Error Response:**

  - **Code:** 500 INTERNAL SERVER ERROR <br />

---

## **Atualiza Atendimento**

Atualiza as informações de status de um atendimento já cadastrado

- **URL**

  /appointments

- **Method:**

  `PATCH`

- **URL Params**

  **Required:**

  `id: number`

- **Request Data**

  - **Body:** <br/>
    **Required:**

    `status: Enum("PENDENTE" | "ATENDIDO" | "CANCELADO")`

- **Success Response:**
- - **Code:** 200 <br />
    **Content:**

    `[ { "id": 2, "nome": "Apolo", "especie": "Cachorro", "raca": "SRD", "atendimento": "Ortopedia", "urgencia": false, "status": "PENDENTE" } ]`

- **Error Response:**

  - **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `{ error : "Log in" }`

- **Notes:**

  Este endpoint foi idelizado pra suprir duas das funcionalidades exigidas de atualização de status visto que ambas faziam a mesma coisa variando apenas o valor do status

---

## **Busca próximo atendimento**

Efetua a busca do próximo atendimento de um doutor já cadastradol, sendo este atendimento o primeiro atendimento de urgencia da fila ou o primeiro atendimento geral caso não hajam atendimentos de urgência

- **URL**

  /appointments/doctor:id

- **Method:**

  `GET`

- **URL Params**

  **Required:**

  `id: number`

* **Success Response:**

  - **Code:** 200 <br />
    **Content:** `{ "id": 2, "nome": "Apolo", "especie": "Cachorro", "raca": "SRD", "atendimento": "Ortopedia", "urgencia": false, "status": "PENDENTE" }`

    OR

  - **Code:** 204 <br/>

* **Error Response:**
  - **Code:** 500 INTERNAL SERVER ERROR <br />
