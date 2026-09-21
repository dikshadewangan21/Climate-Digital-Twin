import torch
import torch.nn as nn

class ClimateLSTM(nn.Module):
    def __init__(self, input_size=10, hidden_size=96, num_layers=2, output_size=8):
        super().__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers=num_layers, batch_first=True, dropout=0.2)
        self.norm = nn.LayerNorm(hidden_size)
        self.dropout = nn.Dropout(0.2)
        self.fc = nn.Linear(hidden_size, output_size)
    def forward(self, x):
        out, _ = self.lstm(x)
        h = self.norm(out[:, -1, :])
        return self.fc(self.dropout(h))
