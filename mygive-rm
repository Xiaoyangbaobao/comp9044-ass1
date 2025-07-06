#!/bin/dash

ass=$1
ass_regex="^[a-z][a-zA-Z0-9]*$"

if ! echo "$ass_name" | grep -Eq "$ass_regex";then
    echo "mygive-rm: invalid assignment: $ass" 1>&2
    exit 1
fi

rm -rf "./mygive/$ass"
echo "assignment $ass removed"
