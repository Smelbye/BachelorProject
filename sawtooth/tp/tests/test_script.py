from sawtooth.tp.healthcare import submit_feedback
import json

doctor_id = "KAR987654"
patient_id = "0x267b26c35f7670F39DcC92910ce2FC9EA5c173A0"
blood_pressure_data = [[117, 69], [113, 71], [119, 75], [104, 66]]
feedback = f"Based on the blood pressure data, the patient appears to have normal blood pressure."

submit_feedback(None, doctor_id, patient_id, feedback)
