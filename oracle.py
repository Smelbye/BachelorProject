import json
from time import sleep
import threading
import random
import requests
import secp256k1

from sawtooth_sdk.messaging.stream import Stream
from sawtooth_sdk.protobuf.events_pb2 import EventFilter, EventSubscription
from sawtooth_sdk.protobuf.client_event_pb2 import ClientEventsSubscribeRequest
from sawtooth_sdk.protobuf.validator_pb2 import Message
from sawtooth_sdk.protobuf.transaction_pb2 import Transaction
from sawtooth_sdk.protobuf.transaction_pb2 import TransactionHeader
from sawtooth_sdk.protobuf.batch_pb2 import Batch
from sawtooth_sdk.protobuf.batch_pb2 import BatchHeader
from sawtooth_sdk.protobuf.batch_pb2 import BatchList

from web3 import Web3
import os

# Update these with your own values
SAWTOOTH_REST_API = "tcp://sawtooth-validator:4004"
ETH_RPC_URL = "http://localhost:7545"
PATIENT_CONTRACT_ADDRESS = "0x20aa28B238Da964F182AB9F26d614540b5710a13"
PRIVATE_KEY = "95af63806a2dfb11114bbd94ec1e7f75fe7a33231154015bc078297db4f5a0c2"
PUBLIC_KEY = "03215e3df0c40d84e7037b1a16c19d9c4011f16bd0d1922a4b9481de2f2c34fe4f"

# Load the PatientContract ABI
with open(os.path.join("ethereum", "build", "contracts", "PatientContract.json"), "r") as f:
    patient_contract_json = json.load(f)
    patient_contract_abi = patient_contract_json["abi"]

# Initialize Web3 and contracts
w3 = Web3(Web3.HTTPProvider(ETH_RPC_URL))
acct = w3.eth.account.privateKeyToAccount(PRIVATE_KEY)
patient_contract = w3.eth.contract(address=PATIENT_CONTRACT_ADDRESS, abi=patient_contract_abi)

# Function to create and send a sawtooth transaction
def send_sawtooth_transaction(payload):
    private_key = "95af63806a2dfb11114bbd94ec1e7f75fe7a33231154015bc078297db4f5a0c2" # Your Sawtooth private key
    public_key = "03215e3df0c40d84e7037b1a16c19d9c4011f16bd0d1922a4b9481de2f2c34fe4f"  # Your Sawtooth public key

    txn_header = TransactionHeader(
        signer_public_key=public_key,
        family_name="healthcare",
        family_version="1.0",
        inputs=["healthcare"],
        outputs=["healthcare"],
        nonce=str(random.random()),
        payload_sha512=payload.sha512(),
        batcher_public_key=public_key,
    )

    txn_header_bytes = txn_header.SerializeToString()

    txn = Transaction(
        header=txn_header_bytes,
        header_signature=secp256k1.PrivateKey.from_hex(private_key).ecdsa_serialize(secp256k1.PrivateKey.from_hex(private_key).ecdsa_sign(txn_header_bytes)),
        payload=payload.SerializeToString(),
    )

    batch_header = BatchHeader(
        signer_public_key=public_key, transaction_ids=[txn.header_signature]
    )

    batch_header_bytes = batch_header.SerializeToString()

    batch = Batch(
        header=batch_header_bytes,
        header_signature=secp256k1.PrivateKey.from_hex(private_key).ecdsa_serialize(secp256k1.PrivateKey.from_hex(private_key).ecdsa_sign(batch_header_bytes)),
        transactions=[txn],
    )

    batch_list = BatchList(batches=[batch])
    batch_list_bytes = batch_list.SerializeToString()

    # Update this with the appropriate Sawtooth REST API URL
    sawtooth_rest_api = "http://localhost:8008"

    headers = {"Content-Type": "application/octet-stream"}
    response = requests.post(
        f"{sawtooth_rest_api}/batches", data=batch_list_bytes, headers=headers
    )

    if response.status_code == 202:
        print("Transaction submitted successfully")
    else:
        print(f"Error submitting transaction: {response.text}")


# Function to handle Sawtooth events
def handle_event(event):
    # Decode the event payload
    payload = json.loads(event.data.decode())

    # Call the appropriate Ethereum contract function based on the event
    if payload["function"] == "patient_data_uploaded":
        patient_data_uploaded(payload)
    elif payload["function"] == "submit_doctor_feedback":
        submit_doctor_feedback(payload)


def submit_doctor_feedback(payload):
    data_id = payload["data_id"]
    doctor_feedback = payload["feedback"]
    feedback_hash = payload["feedback_hash"]

    txn = patient_contract.functions.submitDoctorFeedback(data_id, doctor_feedback, feedback_hash).buildTransaction({
        'from': acct.address,
        'nonce': w3.eth.getTransactionCount(acct.address),
        'gas': 3000000
    })

    signed_txn = w3.eth.account.signTransaction(txn, acct.privateKey)
    w3.eth.sendRawTransaction(signed_txn.rawTransaction)


def patient_data_uploaded(payload):
    patient_id = payload['patient_id']
    ipfs_hash = payload['ipfs_hash']  # Fetch the IPFS hash
    description = payload['description']

    txn = patient_contract.functions.submitMedicalData(patient_id, ipfs_hash, description).buildTransaction({
        'from': acct.address,
        'nonce': w3.eth.getTransactionCount(acct.address),
        'gas': 3000000
    })

    signed_txn = w3.eth.account.signTransaction(txn, acct.privateKey)
    w3.eth.sendRawTransaction(signed_txn.rawTransaction)

# Main event listening loop
def main():
    # Connect to Sawtooth
    stream = Stream(SAWTOOTH_REST_API)

    # Subscribe to Sawtooth events
    event_filter = EventFilter(key="sawtooth/block-commit", match_string=".*", filter_type=EventFilter.REGEX_ANY)
    event_subscription = EventSubscription(event_type="sawtooth/block-commit", filters=[event_filter])
    request = ClientEventsSubscribeRequest(subscriptions=[event_subscription])
    response = stream.send(Message.CLIENT_EVENTS_SUBSCRIBE_REQUEST, request.SerializeToString())

    # Verify the response status
    assert response.message_type == Message.CLIENT_EVENTS_SUBSCRIBE_RESPONSE
    assert ClientEventsSubscribeRequest.Response.Status.Name(response.content) == "OK"

    print("Listening for Sawtooth events...")

    # Listen for events and handle them
    while True:
        try:
            message = stream.receive()
            assert message.message_type == Message.CLIENT_EVENTS
            events = ClientEventsSubscribeRequest.Response().events
            for event in events:
                handle_event(event)
        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"Error: {e}")
            sleep(1)

def start_event_loop():
    thread = threading.Thread(target=main)
    thread.start()

if __name__ == "__main__":
    start_event_loop()
