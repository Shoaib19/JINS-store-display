#!/bin/bash
# 
if [ $# -ne 2 ]
then
	cat <<- _EOF_
	usage : $(basename $0) input  output
	    input : Import yaml file
	    output : Output file 
	_EOF_
	exit
fi

input=$1
output=$2

# @redocly/cli  のインストール
if ! type redocly &> /dev/null
then
	npm install @redocly/cli -g
fi

redocly bundle ${input} -o ${output} && sed -e 's#${api.version}/##g' -i ${output}

