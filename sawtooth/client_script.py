from secp256k1 import PrivateKey, PublicKey
import hashlib
import json
import time

from sawtooth_sdk.messaging.stream import Stream
from sawtooth_sdk.protobuf.events_pb2 import EventFilter, EventSubscription
from sawtooth_sdk.protobuf.client_event_pb2 import ClientEventsSubscribeRequest, ClientEventsSubscribeResponse

from sawtooth_sdk.protobuf.transaction_pb2 import Transaction
from sawtooth_sdk.protobuf.transaction_pb2 import TransactionHeader
from sawtooth_sdk.protobuf.batch_pb2 import Batch, BatchHeader,BatchList 
from sawtooth_sdk.messaging.future import FutureTimeoutError


FAMILY_NAME = "healthcare"
FAMILY_VERSION = "1.0"
NAMESPACE_PREFIX = hashlib.sha512(FAMILY_NAME.encode('utf-8')).hexdigest()[0:6]

def sendSawtoothTransaction(fn_name, args, sawtooth_endpoint):
    private_key = PrivateKey()
    public_key = private_key.pubkey

    payload = {
        "function": fn_name,
        "args": args
    }
    payload_bytes = json.dumps(payload).encode('utf-8')

    inputs = [NAMESPACE_PREFIX]
    outputs = [NAMESPACE_PREFIX]
    signer_public_key = public_key.serialize().hex()
    batcher_public_key = signer_public_key

    txn_header = create_transaction_header(inputs, outputs, signer_public_key, batcher_public_key, payload_bytes)

    txn = create_transaction(txn_header, payload_bytes, private_key)

    batch_header = create_batch_header([txn.header_signature], signer_public_key)

    batch = create_batch(batch_header, [txn], private_key)

    batch_list = create_batch_list([batch])

    try:
        with Stream(url=sawtooth_endpoint) as stream:
            future = stream.send(
                message_type="CLIENT_BATCH_SUBMIT_REQUEST",
                content=batch_list.SerializeToString()
            )
            result = future.result(timeout=300)
            return result
    except FutureTimeoutError as e:
        print("Error: Timed out while waiting for batch result: {}".format(e))

def subscribe_to_events(sawtooth_endpoint, event_handler):
    with Stream(url=sawtooth_endpoint) as stream:
        # Create an event filter for the healthcare events
        event_filter = EventFilter(
            key="function",
            match_string="^get_medical_data$|^submit_feedback$",
            filter_type=EventFilter.REGEX_ANY
        )

        # Create the event subscription
        event_subscription = EventSubscription(
            event_type="sawtooth/healthcare",
            filters=[event_filter]
        )

        # Send the subscription request
        request = ClientEventsSubscribeRequest(
            subscriptions=[event_subscription],
            last_known_block_ids=["0000000000000000"]  # Subscribe from the genesis block
        ).SerializeToString()

        future = stream.send(
            message_type="CLIENT_EVENTS_SUBSCRIBE_REQUEST",
            content=request
        )
        response = ClientEventsSubscribeResponse()
        response.ParseFromString(future.result().content)

        if response.status != ClientEventsSubscribeResponse.OK:
            raise Exception("Failed to subscribe to events")

        # Listen for events and call the event_handler function
        while True:
            message = stream.receive()
            event_list = EventList()
            event_list.ParseFromString(message.content)
            for event in event_list.events:
                event_handler(event)

def event_handler(event):
    payload = json.loads(event.data.decode("utf-8"))

    if payload["function"] == "submit_feedback":
        doctor_address = payload["doctor_address"]
        patient_address = payload["patient_address"]
        feedback = payload["feedback"]
        ipfs_hash = payload["ipfs_hash"]
        cost = payload["cost"]

        # Send a notification to the patient with the provided information
        serverAPI.emit("feedback_submitted", {
            "doctor_address": doctor_address,
            "patient_address": patient_address,
            "feedback": feedback,
            "ipfs_hash": ipfs_hash,
            "cost": cost,
        })

    elif payload["function"] == "get_medical_data":
        doctor_id = payload["doctor_id"]
        patient_id = payload["patient_id"]
        medical_data = payload["medical_data"]
        ipfs_hash = payload["ipfs_hash"]
        timestamp = payload["timestamp"]

        # Send a notification to the patient with the provided information
        serverAPI.emit("medical_data_requested", {
            "doctor_id": doctor_id,
            "patient_id": patient_id,
            "medical_data": medical_data,
            "ipfs_hash": ipfs_hash,
            "timestamp": timestamp,
        })


def submit_feedback(doctor_address, patient_address, feedback, ipfs_hash, sawtooth_endpoint):
    payload = {
        "operation": "submit_feedback",
        "doctor_address": doctor_address,
        "patient_address": patient_address,
        "feedback": feedback,
        "ipfs_hash": ipfs_hash,
    }
    sendSawtoothTransaction(payload, sawtooth_endpoint)

def create_transaction_header(inputs, outputs, signer_public_key, batcher_public_key, payload_bytes):
    return TransactionHeader(
        signer_public_key=signer_public_key,
        family_name=FAMILY_NAME,
        family_version=FAMILY_VERSION,
        inputs=inputs,
        outputs=outputs,
        nonce=str(time.time()),
        batcher_public_key=batcher_public_key,
        dependencies=[],
        payload_sha512=hashlib.sha512(payload_bytes).hexdigest()
    ).SerializeToString()

def create_transaction(header, payload_bytes, private_key):
    return Transaction(
        header=header,
        header_signature=private_key.ecdsa_serialize(private_key.ecdsa_sign(header)).hex(),
        payload=payload_bytes
    )

def create_batch_header(transaction_ids, signer_public_key):
    return BatchHeader(
        signer_public_key=signer_public_key,
        transaction_ids=transaction_ids
    ).SerializeToString()

def create_batch(header, transactions, private_key):
    return Batch(
        header=header,
        header_signature=private_key.ecdsa_serialize(private_key.ecdsa_sign(header)).hex(),
        transactions=transactions
    )

def create_batch_list(batches):
    return BatchList(batches=batches)



if __name__ == '__main__':
    sawtooth_endpoint = "http://localhost:4004"
    subscribe_to_events(sawtooth_endpoint, event_handler)
