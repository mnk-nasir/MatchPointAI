import cv2
import numpy as np
from deepface import DeepFace

def map_extended_emotion(emotions_dict):
    dominant = max(emotions_dict, key=emotions_dict.get)
    confidence = emotions_dict[dominant]

    # Add custom logic to infer extra emotions
    if dominant == "neutral" and confidence > 70:
        return "Sleepy"
    elif dominant == "happy" and emotions_dict["surprise"] > 20:
        return "Excited"
    elif dominant == "neutral" and emotions_dict["sad"] > 20:
        return "Tired"
    elif dominant == "sad" and confidence > 50:
        return "Bored"
    else:
        return dominant.capitalize()

# Start camera
cap = cv2.VideoCapture(0)
print("Camera started. Press 'q' to quit.")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    try:
        result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
        emotions = result[0]["emotion"]
        emotion_label = map_extended_emotion(emotions)

        # Display emotion
        cv2.putText(frame, f'Emotion: {emotion_label}', (40, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

    except Exception as e:
        cv2.putText(frame, 'Detecting...', (40, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

    # Show the camera feed
    cv2.imshow("Real Emotion Detector", frame)

    # Press 'q' to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release everything
cap.release()
cv2.destroyAllWindows()