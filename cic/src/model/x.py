import os
import boto3
import json
from botocore.exceptions import ClientError
from dotenv import load_dotenv
import pandas as pd
import numpy as np
import joblib
import requests
from sentence_transformers import SentenceTransformer, util
import json
import re

api_endpoint = "https://5uq5nzn4g3.execute-api.us-west-2.amazonaws.com/v1"
response = requests.get(api_endpoint)
print(response.text)

def extract_keywords(text):
    # Convert to lowercase
    text = text.lower()
    # Remove punctuation
    text = re.sub(r'[^\w\s]', '', text)
    # Split into words
    words = text.split()
    return set(words)



# Load the pre-trained model (do this once at the start)
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')


# Load the trained model and encoder
model = joblib.load('/Users/dikpaal/Desktop/main/code/projects/cic/cic/src/model/linear_regression_model.pkl')
encoder = joblib.load('/Users/dikpaal/Desktop/main/code/projects/cic/cic/src/model/encoder.pkl')


# Load environment variables from .env file
load_dotenv("/Users/dikpaal/Desktop/main/code/projects/cic/cic/src/model/.env")

# Create a Bedrock Runtime client with explicit credentials
session_token = os.environ.get('AWS_SESSION_TOKEN')  # Handle session token if available
client = boto3.client(
    "bedrock-runtime",
    region_name=os.environ.get('AWS_DEFAULT_REGION'),
    aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
    aws_session_token=session_token if session_token else None
)

# Set the model ID, e.g., Llama 3 70b Instruct.
model_id = "meta.llama3-1-70b-instruct-v1:0"

def get_llama_response(prompt):
    # Define the request payload using the model's expected format
    native_request = {
        "prompt": prompt,
        "max_gen_len": 512,
        "temperature": 0.7,
        "stop": ["</s>", "<|endoftext|>"]  # Ensure the model stops at appropriate tokens
    }

    # Convert the native request to JSON
    request = json.dumps(native_request)

    try:
        # Invoke the model with the request
        response = client.invoke_model(modelId=model_id, body=request)

        # Check if the response is as expected
        if "body" in response:
            # Decode the response body
            model_response = json.loads(response["body"].read())

            # Extract and return the response text
            response_text = model_response["generation"]
            return response_text.strip()
        else:
            print(f"Unexpected response structure: {response}")
            return None

    except (ClientError, Exception) as e:
        print(f"ERROR: Can't invoke '{model_id}'. Reason: {e}")
        return None



# def compute_sustainability_score(material, condition, production_method):
#     # Placeholder linear regression model
#     # Assign numerical values to materials and production methods
#     material_scores = {
#         'Organic Cotton': 30,
#         'Hemp': 35,
#         'Linen': 25,
#         'Synthetic': 10,
#         'Recycled Polyester': 20,
#         # Add more materials as needed
#     }
#     production_scores = {
#         'Hand': 20,
#         'Factory': 10
#     }
#     material_score = material_scores.get(material.title(), 15)
#     production_score = production_scores.get(production_method.title(), 10)
#     condition_score = int(condition) * 5  # Assuming condition is between 1 and 10

#     # Simple linear regression formula (for example purposes)
#     sustainability_score = material_score + production_score + condition_score
#     sustainability_score = min(sustainability_score, 100)  # Cap at 100

#     return sustainability_score

def compute_sustainability_score(material, condition, production_method):

    # Standardize user inputs
    material = material.strip().title()
    production_method = production_method.strip().title()

    # Prepare the input data as a DataFrame
    input_data = pd.DataFrame({
        'Material': [material],
        'Handmade_or_Factory': [production_method],
        'Condition_Rating': [condition]
    })

    # Use the loaded encoder to transform the categorical variables
    encoder_feature_names = encoder.get_feature_names_out(['Material', 'Handmade_or_Factory'])
    encoded_features = encoder.transform(input_data[['Material', 'Handmade_or_Factory']])

    # Create a DataFrame for the encoded features
    encoded_df = pd.DataFrame(encoded_features, columns=encoder_feature_names)

    # Combine encoded features with 'Condition_Rating'
    input_processed = pd.concat([encoded_df, input_data[['Condition_Rating']].reset_index(drop=True)], axis=1)

    # Ensure that all expected features are present
    for col in model.feature_names_in_:
        if col not in input_processed.columns:
            input_processed[col] = 0

    # Reorder columns to match the training data
    input_processed = input_processed[model.feature_names_in_]

    # Predict the sustainability score
    sustainability_score = model.predict(input_processed)[0]

    # Ensure the score is between 0 and 100
    sustainability_score = max(0, min(sustainability_score, 100))

    return sustainability_score


def suggest_buyers_to_seller(seller_item, seller_material):
    # Fetch buyer prompts from the API
    buyers_data = fetch_buyer_prompts()

    # Find matching buyers
    matching_buyers = find_matching_buyers(seller_item, seller_material, buyers_data)

    # Check if there are any matching buyers
    if matching_buyers:
        # Prepare the list of matching buyers to display
        buyers_list = "\n".join(
            [f"{i+1}. {buyer['name']}: {buyer['prompt']}" for i, buyer in enumerate(matching_buyers)]
        )
        print(f"Assistant: Here are some potential buyers interested in your item:\n{buyers_list}")
        return matching_buyers
    else:
        print("Assistant: There are no immediate buyers, but you can publish your posting to the marketplace.")
        return []



def find_matching_buyers(seller_item, seller_material, buyers_data):
    matching_buyers = []

    # Extract keywords from seller's item and material
    seller_item_keywords = extract_keywords(seller_item)
    seller_material_keywords = extract_keywords(seller_material)
    seller_keywords = seller_item_keywords.union(seller_material_keywords)

    for buyer in buyers_data:
        buyer_name = buyer.get('buyer_name')
        buyer_prompt = buyer.get('prompt')

        if not buyer_prompt or not buyer_name:
            continue  # Skip if data is missing

        # Normalize buyer's prompt
        buyer_prompt_normalized = buyer_prompt.lower()

        # Check if any of the seller's keywords are in the buyer's prompt
        match_found = any(keyword in buyer_prompt_normalized for keyword in seller_keywords)

        if match_found:
            matching_buyers.append({
                'name': buyer_name,
                'prompt': buyer_prompt,
                # Optionally, include the matched keywords
                # 'matched_keywords': [kw for kw in seller_keywords if kw in buyer_prompt_normalized]
            })

    return matching_buyers


def fetch_buyer_prompts():
    api_endpoint = "https://5uq5nzn4g3.execute-api.us-west-2.amazonaws.com/v1"

    try:
        response = requests.get(api_endpoint)
        response.raise_for_status()
        data = response.json()

        # Extract the 'body' field which is a JSON string
        body = data.get('body', '')

        # Parse the 'body' string as JSON to get the list of buyers
        buyers_data = json.loads(body)

        return buyers_data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching buyer prompts: {e}")
        return []
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return []



def chatbot():
    conversation_history = []
    user_responses = {}
    sustainability_score = None
    potential_buyers = []
    required_info = ['item', 'material', 'condition', 'production_method']
    info_prompts = {
        'item': "What item would you like to sell?",
        'material': "What is the material of the {item}?",
        'condition': "On a scale of 1-10, what is the condition of the {item}?",
        'production_method': "Was the {item} made by hand or in a factory?"
    }

    while True:
        # Determine what information we still need
        for key in required_info:
            if key not in user_responses:
                # Construct the prompt for the assistant
                prompt = (
                    "You are a helpful assistant for a sustainable marketplace who talks like Monkey D. Luffy from One Piece.\n"
                    "Your task is to collect information from the seller by asking one question at a time and waiting for the user's response before proceeding.\n"
                    "Please ask the following question:\n"
                    f"{info_prompts[key].format(item=user_responses.get('item', 'item'))}\n"
                    "\nAssistant:"
                )

                # Get the assistant's response
                assistant_response = get_llama_response(prompt)
                if assistant_response:
                    print(f"Assistant: {assistant_response.strip()}")
                    conversation_history.append(f"Assistant: {assistant_response.strip()}")
                else:
                    print("Assistant: Sorry, I couldn't generate a response at this time.")
                    break

                # Get user input
                user_input = input("You: ").strip()
                conversation_history.append(f"You: {user_input}")

                # Save the user's response
                if key == 'condition':
                    try:
                        condition_value = int(user_input)
                        if 1 <= condition_value <= 10:
                            user_responses[key] = condition_value
                        else:
                            print("Assistant: Please enter a number between 1 and 10.")
                            conversation_history.append("Assistant: Please enter a number between 1 and 10.")
                            continue
                    except ValueError:
                        print("Assistant: Please enter a valid number between 1 and 10.")
                        conversation_history.append("Assistant: Please enter a valid number between 1 and 10.")
                        continue
                else:
                    user_responses[key] = user_input

                break  # Break the for loop and re-evaluate what information we need

        # Check if we have collected all necessary information
        if all(key in user_responses for key in required_info) and sustainability_score is None:
            # Compute sustainability score
            sustainability_score = compute_sustainability_score(
                user_responses['material'],
                user_responses['condition'],
                user_responses['production_method']
            )

            # Generate assistant's response with sustainability suggestions using Llama model
            assistant_prompt = (
                "You are a helpful assistant for a sustainable marketplace.\n"
                "Provide ways the seller can upcycle, recycle, and reuse the item, and present the sustainability score.\n\n"
                f"Item: {user_responses['item']}\n"
                f"Material: {user_responses['material']}\n"
                f"Condition: {user_responses['condition']}\n"
                f"Production Method: {user_responses['production_method']}\n"
                f"Sustainability Score: {sustainability_score}\n\n"
                "Assistant:"
            )

            assistant_response = get_llama_response(assistant_prompt)
            if assistant_response:
                print(f"Assistant: {assistant_response.strip()}")
                conversation_history.append(f"Assistant: {assistant_response.strip()}")
            else:
                print("Assistant: Sorry, I couldn't generate suggestions at this time.")
                conversation_history.append("Assistant: Sorry, I couldn't generate suggestions at this time.")

            # Ask if the seller still wants to sell it
            print("Assistant: Do you still want to sell it?")
            conversation_history.append("Assistant: Do you still want to sell it?")

            # Get user input
            user_input = input("You: ").strip()
            conversation_history.append(f"You: {user_input}")

            if user_input.lower() in ['no', 'n']:
                print("Assistant: Nice! Glad you found a sustainable way to keep using your item.")
                conversation_history.append("Assistant: Nice! Glad you found a sustainable way to keep using your item.")
                break
            # After the seller decides to sell
            elif user_input.lower() in ['yes', 'y']:
                user_responses['decision'] = 'yes'

                # Use the seller's item and material for matching
                seller_item = user_responses['item']
                seller_material = user_responses['material']

                # Suggest buyers
                matching_buyers = suggest_buyers_to_seller(seller_item, seller_material)

                if matching_buyers:
                    print("Assistant: Would you like to sell it to one of them? (Enter the number or type 'no')")
                    user_input = input("You: ").strip()
                    if user_input.strip().isdigit():
                        selected_index = int(user_input.strip()) - 1
                        if 0 <= selected_index < len(matching_buyers):
                            selected_buyer = matching_buyers[selected_index]
                            print(f"Assistant: Good! We've notified {selected_buyer['name']} about your item. They'll contact you soon.")
                        else:
                            print("Assistant: Invalid selection. You can publish your posting to the marketplace.")
                    elif user_input.lower() in ['no', 'n']:
                        print("Assistant: You can publish your posting to the marketplace.")
                    else:
                        print("Assistant: Please enter a valid option.")
                else:
                    print("Assistant: There are no immediate buyers, but you can publish your posting to the marketplace.")
            else:
                print("Assistant: Nice! Glad you found a sustainable way to keep using your item.")


if __name__ == "__main__":
    chatbot()