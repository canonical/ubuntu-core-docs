(reference-assertions-store)=
# store

The store assertion defines the configuration needed to connect a device to a store.  The `friendly-stores` list enables the creation of trust relationships to other stores.

```yaml
type: store
authority-id:      <authority account id>
store:             <store name>
friendly-stores:   <list of trusted store names> # Their snaps will be made available to the store.
operator-id:       <account id>
url:               <optional api url>
location:          <optional location string>
timestamp:         <UTC datetime>
sign-key-sha3-384: <key id>                      # Encoded key id of signing key

<signature>                                      # Encoded signature
```

The following is a complete example store assertion:

```yaml
type: store
authority-id: canonical
store: UDifxuoKrcYe65492eDA
friendly-stores:
  - example-store
operator-id: canonical
timestamp: 2021-06-16T10:13:54.711843Z
sign-key-sha3-384: BWDEoaqyr25nF5SNCvEv2v7QnM9QsfCc0PBMYD_i2NGSQ32EF2d4D0hqUel3m8ul

AcLBUgQAAQoABgUCYMnO4gAAl54QAEEHC9DaViDa7a2jP/sTHy7GIieUSZ+He4zhVIJ40MTL4RFl
CXsicJnvBN8NkPj9Smfheab1k4/C5zHXWfQOtPcpNhnV8w8BULzygemYrLtRkuW2I8NU2uXziARU
VdqtzLP8xvb1c1QJ81dOWAuNLGoaD3GX3jV0e65oz8Fxas87YYyS537TKGHCjJ9t7SCpdLfGBRl4
hvnCAk2e5fYHXKK9BjZ1SgQ6y32OXWsxlH0lMiTAf9ILp74AP6KQctsn7W936xavJl+76IaTIWee
xx+I02LW9hUpr8wSVhk+Kjq7XgIQNMimVAIDsUBz/kYQ2xtUVtD2vmpvDceF3N32ZX9Lm16xBQTo
7ZOO8JBFdv7SY4qe2Xssqi387UrEuMzBF/sPtsHiT6ByOy6xGLNVib5pahb2/7k/Mg+sMuREY/n+
3rWsFLW1wh/3iDAXeQnt5crkXYsdsIjsxE8ULW/zt16CJFUfaqcRf7ta0LeIyhm5IYa5vtcC2wOy
nMGfZJ6Xgr/U4MYHysEifFttUisttvI87HKQEfJU96g0rHPFt/x+PU2tUYz0+2O7y/wjRGXemOaq
xpG0hzLc6zTR32rqx3fO3H+0031xVozUNJxvkk6sg2omCGY9yaTwyKn6QvXs0FI48JqEKr9cdV7v
rbT86NActIgyBDX8ofx/Vz3kvuDi
```
