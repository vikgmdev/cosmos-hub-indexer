-- Create the 'blocks' table
CREATE TABLE IF NOT EXISTS blocks (
    height BIGINT NOT NULL UNIQUE,
    hash TEXT NOT NULL,
    indexed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_height ON blocks (height);

-- Create the 'transactions' table
CREATE TABLE IF NOT EXISTS transactions
(
    hash TEXT NOT NULL PRIMARY KEY,
    from_address VARCHAR(128) NOT NULL,
    to_address VARCHAR(128) NOT NULL,
    asset TEXT NOT NULL,
    amount BIGINT NOT NULL,
    memo TEXT,
    block_height BIGINT NOT NULL REFERENCES blocks (height) ON DELETE CASCADE,
    indexed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_from_address ON transactions (from_address);
CREATE INDEX idx_to_address ON transactions (to_address);
CREATE INDEX idx_asset ON transactions (asset);
