#!/bin/bash
# Path to this plugin
INPUT="../src/grpc"
OUTPUT="./protos"

mkdir -p $OUTPUT
for f in `ls $INPUT`; do
    python -m grpc_tools.protoc -I=${INPUT} --python_out=${OUTPUT} --grpc_python_out=${OUTPUT} ${INPUT}/${f}
done