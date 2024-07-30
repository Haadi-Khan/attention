import pandas as pd
import torch
from torchtext.data.utils import get_tokenizer
from torchtext.vocab import build_vocab_from_iterator
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split

# Load data
data = pd.read_csv('data/train.csv')

# Assume the CSV has 'text' and 'label' columns
texts = data['title_name'].values
labels = data['label'].values

# Tokenization
tokenizer = get_tokenizer('basic_english')

# Build vocabulary
def yield_tokens(data_iter):
    for text in data_iter:
        yield tokenizer(text)

vocab = build_vocab_from_iterator(yield_tokens(texts), specials=["<unk>"])
vocab.set_default_index(vocab["<unk>"])

# Numericalize tokens
def text_pipeline(x):
    return vocab(tokenizer(x))

# Dataset class
class TextDataset(Dataset):
    def __init__(self, texts, labels):
        self.texts = texts
        self.labels = labels

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        return torch.tensor(text_pipeline(self.texts[idx]), dtype=torch.long), torch.tensor(self.labels[idx], dtype=torch.float32)

# Split data into training and validation sets
train_texts, val_texts, train_labels, val_labels = train_test_split(texts, labels, test_size=0.2)

# Create Datasets and DataLoaders
train_dataset = TextDataset(train_texts, train_labels)
val_dataset = TextDataset(val_texts, val_labels)

train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)