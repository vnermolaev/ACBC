#!/usr/bin/env bash

image_name="acbc"
volume_name="ExonumConfVolume"
node_count=4
api_port=8200
neo4j_front_port=7470
bolt_port=7680
neo4j_password="neo4j"
frontend_port=3000
target="release"


# Starting nodes and neo4j
for i in $(seq 1 $((node_count)))
do
    # echo docker run -t -d -i --name node$i -p 820$i:8200 -p 747$i:7474 -p 768$i:7687 -p 300$i:3005 -v $volume_name:/shared-config $image_name
    docker run -t -d -i --name node$i -p 820$i:8200 -p 747$i:7474 -p 768$i:7687 -p 300$i:3005 -v $volume_name:/shared-config $image_name
    docker exec -w /ACBC/ node$i git pull
    docker exec node$i neo4j-admin set-initial-password $neo4j_password
    docker exec node$i neo4j start
done

#cleaning shared_config folder and making common conf
docker exec -w /ACBC/backend/ node1 ./configure/generate_common_config.sh $node_count $target

#Generating conf for each node
for i in $(seq 1 $((node_count)))
do
    docker exec -w /ACBC/backend/ node$i ./configure/configure_node.sh $i $target
done

#Finalizing conf for each node
for i in $(seq 1 $((node_count)))
do
    docker exec -w /ACBC/backend/ node$i ./configure/finalize_config.sh $i $node_count $target
done

#Run all the nodes
for i in $(seq 1 $((node_count)))
do
    docker exec -d -w /ACBC/backend/ node$i ./configure/run_node.sh $i $target
done

#Wait so that neo4j has properly started
sleep 5

#Setup frontend
for i in $(seq 1 $((node_count)))
do
    # Generate environment variables
    docker exec -w /ACBC/explorer/ node$i ./generate_environment.sh $i localhost
    # Build the front end
    docker exec -w /ACBC/explorer/ node$i npm run build
    # Serve
    docker exec -d -w /ACBC/explorer/ node$i npm run go
done