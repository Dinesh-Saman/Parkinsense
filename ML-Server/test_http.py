import os
import requests

def test_api():
    url = "http://localhost:5005/predict_voice"
    healthy_dir = "voice/Voice_Dataset/HC_AH"
    
    hc_files = [f for f in os.listdir(healthy_dir) if f.endswith(".wav")]
    if hc_files:
        test_file = os.path.join(healthy_dir, hc_files[0])
        print(f"Testing URL {url} with file: {test_file}")
        
        with open(test_file, 'rb') as f:
            files = {'audio': (hc_files[0], f, 'audio/wav')}
            response = requests.post(url, files=files)
            
        print(f"Status Code: {response.status_code}")
        try:
            print(f"Response JSON: {response.json()}")
        except Exception as e:
            print(f"Failed to parse JSON: {response.text}")

if __name__ == "__main__":
    test_api()
