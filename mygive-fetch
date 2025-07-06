#!/bin/dash

ass=$1
zid=$2
num=$3

ass_dir=".mygive/$ass/$zid"

if [ $# -ne 2 ] && [ $# -ne 3 ];then
     echo "usage: take-fetch <assignment> <zid> [n]"  1>&2
    exit 1
fi

if ! echo "$zid" | grep -qE '^z[0-9]{7}$';then
    echo "mygive-fetch: invalid zid: $zid" 1>&2
    exit 1
fi

if [ ! -d "$ass_dir" ];then
    echo "no submission for $ass by $zid" 1>&2
    exit 1
fi

submission_total=$(ls -1d "$ass_dir"/* 2>/dev/null | wc -l | tr -d " ")

if [ -z "$num" ];then
    num=0
fi

if [ "$submission_total" -eq 0 ];then
    echo "mygive-fetch: no submissions found for $ass" 1>&2
    exit 1
elif [ "$num" -gt "$submission_total" ];then
    echo "mygive-fetch: submission $num not found for $ass" 1>&2
    exit 1
elif [ "$num" -gt 0 ];then
    actual_index=$num
elif [ "$num" -eq 0 ];then
    actual_index=$submission_total
else
    actual_index=$((submission_total + num))
    if [ "$actual_index" -le 0 ];then
        echo "mygive-fetch: submission $num not found for $ass" 1>&2
        exit 1
    fi
fi

sub_file=".mygive/$ass/$zid/$actual_index"

for file in "$sub_file"/*;do
    cat "$file"
done