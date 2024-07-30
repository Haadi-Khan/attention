from sklearn.metrics import accuracy_score
from model import *

def predict(text):
    model.eval()
    with torch.no_grad():
        text = torch.tensor(text_pipeline(text), dtype=torch.long).unsqueeze(0)
        offsets = torch.tensor([0])
        output = model(text, offsets)
        return torch.sigmoid(output).item() >= 0.5

# Evaluation on validation set
val_predictions = [predict(text) for text in val_texts]
accuracy = accuracy_score(val_labels, val_predictions)
print(f'Validation Accuracy: {accuracy:.4f}')