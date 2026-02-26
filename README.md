# Gibhun: Real-Time Emotion Enhancer

**Gibhun** is a real-time facial emotion recognition system built using OpenCV and DeepFace. It analyzes a user's facial expression from live webcam input and intelligently maps it to extended emotional states like *Sleepy*, *Tired*, *Bored*, and *Excited*.

## 🔥 Features
- Real-time emotion detection using your webcam
- Extended emotion mapping beyond basic facial expressions
- Uses [DeepFace](https://github.com/serengil/deepface) for facial analysis
- Simple OpenCV interface

## 🧠 How It Workss

The program captures video frames and uses DeepFace to detect the dominant emotion. A custom function then extends these emotions to interpret more nuanced feelings based on combinations and intensity levels.

## 🖥️ Demo

![Demo GIF or Screenshot Placeholder](link-to-image-or-demo.gif)

## 🛠️ Requirements

- Python 3.7+
- OpenCV
- DeepFace
- NumPy

Install them with:

```bash
pip install opencv-python deepface numpy
