import torch.optim as optim
from model import *

# Define loss and optimizer
criterion = nn.BCEWithLogitsLoss()
optimizer = optim.SGD(model.parameters(), lr=0.001)

# Training loop
def train_epoch(train_loader, model, criterion, optimizer):
    model.train()
    total_loss = 0
    for text, label in train_loader:
        optimizer.zero_grad()
        offsets = torch.tensor([0] + [len(text[i]) for i in range(len(text) - 1)]).cumsum(dim=0)
        output = model(text, offsets)
        loss = criterion(output.squeeze(), label)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
    return total_loss / len(train_loader)

# Validation loop
def evaluate(val_loader, model, criterion):
    model.eval()
    total_loss = 0
    with torch.no_grad():
        for text, label in val_loader:
            offsets = torch.tensor([0] + [len(text[i]) for i in range(len(text) - 1)]).cumsum(dim=0)
            output = model(text, offsets)
            loss = criterion(output.squeeze(), label)
            total_loss += loss.item()
    return total_loss / len(val_loader)

# Training and evaluation
num_epochs = 10
for epoch in range(num_epochs):
    train_loss = train_epoch(train_loader, model, criterion, optimizer)
    val_loss = evaluate(val_loader, model, criterion)
    print(f'Epoch: {epoch+1}, Train Loss: {train_loss:.4f}, Val Loss: {val_loss:.4f}')