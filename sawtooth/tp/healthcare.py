import logging
import json
import time
import os
import uuid
from hashlib import sha512
from pymongo import MongoClient
from web3 import Web3, Account
from sawtooth_sdk.processor.exceptions import InvalidTransaction
from sawtooth_sdk.protobuf.transaction_pb2 import TransactionHeader, Transaction
from sawtooth_sdk.processor.handler import TransactionHandler
from sawtooth_sdk.processor.core import TransactionProcessor
from collections import namedtuple
from dotenv import load_dotenv
import os

load_dotenv()

# Connection to the Ethereum node
ethereum_node_url = os.environ.get("ETHEREUM_NODE_URL")
w3 = Web3(Web3.HTTPProvider(ethereum_node_url))

# Set the default account to use for sending transactions
private_key = "INSERT_PRIVATE_SAWTOOTH_KEY"
account = w3.eth.account.privateKeyToAccount(private_key)

# Connect to the MongoDB database
mongo_db_url = "YOUR_MONGODB_URL"  
mongo_db_name = "MONGODB_DATABASE_NAME"
client = MongoClient(mongo_db_url)
db = client[mongo_db_name]

# define the Sawtooth family name and version for the transaction processor
FAMILY_NAME = 'healthcare'
FAMILY_VERSION = '1.0'

# define the prefix for the addresses that the transaction processor will use
NAMESPACE_PREFIX = sha512(FAMILY_NAME.encode('utf-8')).hexdigest()[:6]

contract_json_path = os.path.join("PatientContract.json")

with open(contract_json_path) as f:
    contract_data = json.load(f)

CONTRACT_ABI = contract_data['abi']
CONTRACT_ADDRESS = "..."  # Replace with the actual address of the deployed PatientContract

# Create the contract object
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)

def is_doctor_authorized(doctor_id, patient_id):
    doctor = db.doctors.find_one({"medical_license": doctor_id})
    if doctor is None:
        return False
    patient = db.patients.find_one({"patient_id": patient_id})
    if patient is None:
        return False
    return doctor_id in patient['authorized_doctors']


Attribute = namedtuple("Attribute", ["key", "value"])

def create_event(payload, event_type):
    return {
        "event_type": event_type,
        "attributes": [
            Attribute(key="function", value=payload["function"]),
        ],
        "data": json.dumps(payload).encode("utf-8"),
    }


def get_address(patient_id):
    return NAMESPACE_PREFIX + sha512(patient_id.encode('utf-8')).hexdigest()[:64]


def get_medical_data(context, doctor_id, patient_id):
    if not is_doctor_authorized(doctor_id, patient_id):
        raise InvalidTransaction("Doctor not authorized to view medical data for this patient")
    
    # Retrieve medical data from Ethereum smart contract
    medical_data = contract.functions.getMedicalData(patient_id).call()

    # Emit an event for the client to listen to
    payload = {
        "function": "get_medical_data",
        "doctor_id": doctor_id,
        "patient_id": patient_id,
        "medical_data": medical_data,
    }
    event = create_event(payload, "sawtooth/healthcare/get_medical_data")
    context.add_event(event)

    return True

def submit_feedback(context, doctor_id, patient_id, feedback):
    if not is_doctor_authorized(doctor_id, patient_id):
        raise InvalidTransaction("Doctor not authorized to submit feedback for this patient")

    # Submit feedback to the Ethereum smart contract
    txn = contract.functions.submitFeedback(patient_id, doctor_id, feedback).buildTransaction({
        'from': account.address,
        'gas': 3000000,
        'gasPrice': w3.toWei('20', 'gwei'),
        'nonce': w3.eth.getTransactionCount(account.address),
    })

    signed_txn = w3.eth.account.signTransaction(txn, private_key)
    txn_hash = w3.eth.sendRawTransaction(signed_txn.rawTransaction)

    # Wait for the transaction to be mined
    txn_receipt = w3.eth.waitForTransactionReceipt(txn_hash)

    # Emit an event for the client to listen to
    payload = {
        "function": "submit_feedback",
        "doctor_id": doctor_id,
        "patient_id": patient_id,
        "feedback": feedback,
        "transaction_receipt": txn_receipt
    }
    event = create_event(payload, "sawtooth/healthcare/submit_feedback")
    context.add_event(event)

    return True

def get_doctor_balance(context, doctor_id):
    # Retrieve doctor balance from Ethereum smart contract
    balance = contract.functions.getDoctorBalance(doctor_id).call()

    # Emit an event for the client to listen to
    payload = {
        "function": "get_doctor_balance",
        "doctor_id": doctor_id,
        "balance": balance
    }
    event = create_event(payload, "sawtooth/healthcare")
    context.add_event(event)

    return True

def submit_doctor_feedback_hash(context, doctor_id, data_id, feedback_hash):
    # Save feedback hash to MongoDB
    feedback = {
        "_id": str(uuid.uuid4()),
        "doctor_id": doctor_id,
        "data_id": data_id,
        "feedback_hash": feedback_hash,
        "timestamp": int(time.time()),
    }
    db.feedback_hashes.insert_one(feedback)

    # Emit an event for the client to listen to
    payload = {
        "function": "submit_doctor_feedback_hash",
        "doctor_id": doctor_id,
        "data_id": data_id,
        "feedback_hash": feedback_hash,
    }
    event = create_event(payload, "sawtooth/healthcare")
    context.add_event(event)

    return True

def get_doctor_info(context, doctor_public_key):
    # Retrieve doctor information from MongoDB
    doctor = db.doctors.find_one({"public_key": doctor_public_key})

    if doctor is None:
        raise InvalidTransaction("No doctor found with the given public key")

    # Emit an event for the client to listen to
    payload = {
        "function": "get_doctor_info",
        "doctor_public_key": doctor_public_key,
        "doctor": doctor,
    }
    event = create_event(payload, "sawtooth/healthcare")
    context.add_event(event)

    return True


class HealthcareTransactionHandler(TransactionHandler):
    def __init__(self):
        super(HealthcareTransactionHandler, self).__init__(
            family_name=FAMILY_NAME,
            family_versions=[FAMILY_VERSION],
            namespaces=[NAMESPACE_PREFIX],
        )


    def apply(self, transaction, context):
        # parse the transaction header and payload
        header = TransactionHeader(serialized=transaction.header)
        payload = json.loads(transaction.payload.decode())
        # get the public key of the transaction signer
        signer_public_key = header.signer_public_key
        # get the function name and arguments from the payload
        function_name = payload['function']
        args = payload['args']

        # call the appropriate function based on the function name in the payload
        if function_name == "submit_doctor_feedback_hash":
            doctor_id, data_id, feedback_hash = args
            return submit_doctor_feedback_hash(context, doctor_id, data_id, feedback_hash)
        elif function_name == "get_doctor_info":
            doctor_public_key, = args
            return get_doctor_info(context, doctor_public_key)
        elif function_name == "get_medical_data":
            doctor_id, patient_id = args
            return get_medical_data(context, doctor_id, patient_id)
        elif function_name == "submit_feedback":
            doctor_id, patient_id, feedback = args
            return submit_feedback(context, doctor_id, patient_id, feedback)
        elif function_name == "get_doctor_balance":
            doctor_id, = args
            return get_doctor_balance(context, doctor_id)
        else:
            raise InvalidTransaction("Invalid function name: {}".format(function_name))


def main():
    # set up the logging
    logging.basicConfig(level=logging.DEBUG)

    # create a Sawtooth transaction processor
    processor = TransactionProcessor(url="tcp://localhost:4004")

    # create a handler for the healthcare transaction family
    handler = HealthcareTransactionHandler()

    # add the handler to the transaction processor
    processor.add_handler(handler)

    # start the transaction processor
    processor.start()

if __name__ == '__main__':
    main()


