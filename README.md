# 🌍 EcoCircle

EcoCircle is an AI-powered sustainable marketplace platform. The application helps users sell used items or explore creative upcycling ideas with AI-generated suggestions, all while promoting eco-friendly decisions through sustainability scoring and buyer-seller matchmaking.

---

## 💪🏻 Features

- **AI-Powered Assistant**: Interacts with users in a friendly tone to collect item details and provide recycling, reuse, and upcycling suggestions.
- **Sustainability Score Estimator**: Uses a trained linear regression model to score item sustainability based on material, condition, and production method.
- **Smart Buyer Matching**: Leverages sentence embeddings (MiniLM-L6-v2) to semantically match seller items with interested buyers via API.
- **GenAI Integration**: Harnesses the **LLaMA 3.1 70B Instruct model** hosted on **Amazon Bedrock** for natural language interaction and intelligent suggestions.
- **AWS Architecture**:
  - **Lambda**: Stateless compute backend for model inference and data routing.
  - **API Gateway**: Manages REST API endpoints.
  - **DynamoDB**: Stores buyer listings.
  - **S3**: Stores models and assets.

---

## ⚙️ How It Works

The assistant (styled after **Monkey D. Luffy**) chats with users to:
- Collect item details
- Predict sustainability score
- Generate reuse/upcycle suggestions
- Match sellers with potential buyers via semantic search
- Help users decide between selling or repurposing

---

## 🧠 My Contributions

As the lead on the **AI and AWS architecture**, I was responsible for engineering the backend intelligence and deploying it across a scalable AWS infrastructure:


### **Architecture**

EcoCircle's backend is designed around a **serverless, event-driven AWS pipeline** for scalability and real-time inference.

#### Key Components

- **Amazon API Gateway**: Handles secure REST API requests from the frontend.
- **AWS Lambda**: Executes logic on-demand, powering:
  - LLaMA 3.1 prompt generation (via Amazon Bedrock)
  - Sustainability scoring using a regression model
  - Semantic buyer-seller matching via MiniLM
  - Read/write operations for DynamoDB
- **Amazon Bedrock**: Hosts and serves LLaMA 3.1 Instruct for contextual GenAI suggestions.
- **Amazon DynamoDB**: Stores buyer/seller prompts and metadata for quick retrieval and updates.
- **Amazon S3**: Stores fetched media and model files for frontend access.

#### My Role

I designed and implemented this architecture by:

- Architecting the Lambda invocation structure for low-latency, modular execution.
- Integrating LLaMA 3.1 via Bedrock for GenAI-based interaction.
- Connecting the system using RESTful endpoints managed through API Gateway.
- Ensuring reliable stateful interactions by persisting listings in DynamoDB.
- Facilitating asynchronous media handling via S3 for frontend consumption.

- This pipeline enables **real-time, intelligent interaction** between users and the platform while remaining scalable and cost-efficient.
