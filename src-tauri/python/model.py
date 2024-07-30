import torch.nn as nn
import torch.nn.functional as F
from pre_process import *

class TextClassifier(nn.Module):
    def __init__(self, vocab_size, embed_dim, num_class):
        super(TextClassifier, self).__init__()
        self.embedding = nn.EmbeddingBag(vocab_size, embed_dim, sparse=True)
        self.fc = nn.Linear(embed_dim, num_class)

    def forward(self, text, offsets):
        embedded = self.embedding(text, offsets)
        return self.fc(embedded)

# Hyperparameters
vocab_size = len(vocab)
embed_dim = 64
num_class = 2

model = TextClassifier(vocab_size, embed_dim, num_class)