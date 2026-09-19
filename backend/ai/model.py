import torch.nn as nn


class ClimateLSTM(nn.Module):

    def __init__(
        self,
        input_size=7,
        hidden_size=64,
        num_layers=2,
        output_size=2
    ):
        super().__init__()

        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True
        )

        self.dropout = nn.Dropout(0.2)

        self.fc = nn.Linear(
            hidden_size,
            output_size
        )

    def forward(self, x):

        output, (hidden, cell) = self.lstm(x)

        hidden = self.dropout(hidden[-1])

        output = self.fc(hidden)

        return output