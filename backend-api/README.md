# Backend API Service

## Identity & Access Management (IAM) & Secrets Management
* **Zero Hardcoded Passwords:** No production passwords, private keys, or API credentials are hardcoded into the GitHub repository.
* **AWS Secrets Manager & `.env` Support:** Database credentials (`DATABASE_URL`), Polygon/DLT private keys (`ADMIN_PRIVATE_KEY`), and API secrets (`API_SECRET_KEY`) are dynamically injected via environment variables or fetched at runtime via AWS Secrets Manager using IAM role-based policies.


## Running the API locally:
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

## API Documentation (Swagger UI):
Because this is built in FastAPI, you can view the fully interactive Swagger API documentation by running the server and visiting http://localhost:8000/docs.
