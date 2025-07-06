#!/bin/dash

for ass in .mygive/*; do
    echo "$ass"
    if [ -d "$ass" ];then
        ass_basename=$(basename "$ass")
        student_count=$(ls -1d "$ass"/* 2>/dev/null | wc -l)
        student_count=$((student_count))
        echo "assignment $ass_basename: submissions from $student_count students"
    fi
done