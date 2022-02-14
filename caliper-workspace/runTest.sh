npx caliper launch manager \
    --caliper-workspace ./ \
    --caliper-networkconfig networks/network.yaml \
    --caliper-benchconfig benchmarks/registerSpot.yaml \
    --caliper-flow-only-test \
    --caliper-fabric-gateway-enabled
