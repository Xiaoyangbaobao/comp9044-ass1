#!/bin/dash

ass_name=$1
test_files=$2

ass_regex="^[a-z][a-zA-Z0-9]*$"
test_regex="^[a-zA-Z0-9._/\-]+$"

if ! echo "$ass_name" | grep -Eq "$ass_regex";then
    echo "ass name is invalid" 1>&2
    exit 1
fi

if ! echo "$test_files" | grep -Eq "$test_regex";then
    echo "test file is invalid" 1>&2
    exit 1
fi

if [ ! -d ".mygive" ];then
    mkdir .mygive
    echo "direcotry .mygive created"
fi

if [ ! -d ".mygive/$ass_name" ];then
    mkdir ".mygive/$ass_name"
    echo "assignment $ass_name created"
fi

if [ ! -d ".mygive/$ass_name/tests" ];then
    mkdir ".mygive/$ass_name/tests"
fi

cp "$test_files" ".mygive/$ass_name/tests"