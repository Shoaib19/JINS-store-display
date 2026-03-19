#! /bin/bash
# ----------------------------------------
#
# yamlから*Client.tsを作成する
#  (shは[project_root]/app/openapi/clientsに配置されること)。
#
# app/openapi/clients/[対象サービス名]/*.yaml (１ファイルのみ)
#  ↓
# /app/src/interfaces/clients/[対象サービス名]/[対象サービス名]Client.ts
# ----------------------------------------

echo "[ generate_related_clients.sh ]"
shdir=$(dirname $(realpath $0))
project_root=$(cd ${shdir}/../../.. ; pwd)

function generate() {
#       openapi/
#       └── clients/
#                ├generate_related_clients.sh
#                ├── carts/
#                │      ├── index.yaml
#                ├── checkers/
#                 │     └── index.yaml
#                  ....
#       ↓↓↓
#       interfaces/
#       └── clients/
#                ├── carts/
#                │      ├── cartsClient.ts
#                ├── checkers/
#                 │     └── checkersClient.ts
#                  ....
    # const
    spec_directory="app/openapi/clients"
    client_directory="app/src/interfaces/clients"

    # debug message
    echo ""
    echo "  SourceDir: ${spec_directory}"
    echo "  TargetDir: ${client_directory}"
    echo ""

    # 生成先をクリア
    rm -fr ${client_directory}/
    spec_files=$(find ${spec_directory} -mindepth 2 -maxdepth 2 -type f \( -name "*.yaml" -o -name "*.yml" \))

    # create clients recursively
    for spec_file in ${spec_files[@]}; do
        spec_dirpath=$(dirname ${spec_file})
        system_name=${spec_dirpath#${spec_directory}/}
        system_basename=$(basename ${system_name})
        client_name="${system_name}/${system_basename}Client.ts"
        client_path="${client_directory}/${client_name}"
        npx openapi-typescript ${spec_file} -o ${client_path}
    done
}

( cd ${project_root} && generate )
