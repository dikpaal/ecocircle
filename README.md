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
 
## ⚙️ How It Works

The assistant (styled after **Monkey D. Luffy**) chats with users to:
- Collect item details
- Predict sustainability score
- Generate reuse/upcycle suggestions
- Match sellers with potential buyers via semantic search
- Help users decide between selling or repurposing

---

## 🧠 My Contributions

As the lead on the **AI and AWS architecture**, I was responsible for engineering the backend intelligence and deploying it across a scalable AWS infrastructure. My key contributions included:

### 1. **LLM Integration with Amazon Bedrock**
- Integrated **LLaMA 3.1 70B Instruct** via Amazon Bedrock to power conversational interactions and sustainability suggestions.
- Implemented dynamic prompt generation to provide tailored upcycling and reuse ideas based on user input.

### 2. **Semantic Search & Buyer Matching**
- Used `all-MiniLM-L6-v2` sentence transformer to embed seller item descriptions and match them to buyer prompts via semantic similarity.
- Designed and implemented the keyword extraction and buyer-matching pipeline using `sentence-transformers` and fuzzy logic.

### 3. **Sustainability Scoring ML Pipeline**
- Trained a **custom Linear Regression model** using scikit-learn to generate sustainability scores based on material, condition, and production method.
- Preprocessed and encoded categorical features using `OneHotEncoder` with fallback logic for robustness.

### 4. **Full AWS-Powered Architecture**
- Deployed the entire backend on AWS using:
  - **AWS Lambda** for running logic on-demand
  - **API Gateway** for secure endpoints
  - **Amazon Bedrock** for GenAI inference
  - **DynamoDB** for buyer data storage
  - **S3** for model and asset management
- Secured endpoints and optimized runtime latency for faster interaction response.
