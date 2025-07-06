#!/bin/dash

if [ $# -ne 2 ]; then
    echo "usage: mygive-test <assignment> <filename>" 1>&2
    exit 1
fi  

ass_name="$1"
program_file="$2"

arguments_regex="^[a-zA-Z0-9._ \-]*$"

# check if assignment name is valid
if [ "$(echo "$ass_name" | grep -Ec '^[a-z][a-zA-Z0-9_]*$')" -ne 1 ]; then
    echo "mygive-test: invalid assignment: $ass_name" 1>&2
    exit 1
fi

if ! test -f "$program_file"; then
    echo "mygive-test: $program_file not found" 1>&2
    exit 1
fi

passed_tests=0
failed_tests=0

for test_file in .mygive/$ass_name/tests/*; do
   test_dir=$(basename $test_file | cut -d'.' -f1)
   mkdir -p "$test_dir"
   tar -xzf "$test_file" -C "$test_dir"

   tmp_list=$(mktemp)
   find "$test_dir" -mindepth 1 -type d ! -name "*marking*" > "$tmp_list"

   while read -r file_dir; do
        file_name=$(basename $file_dir)
        arguments=""
        stdin=""
        stdout=""
        options=""
        exit_status=0
        stderr=""

         if [ -f "./$file_dir/exit_status" ];then
            exit_status=$(cat "./$file_dir/exit_status")
        fi
        
        if [ -f "./$file_dir/arguments" ];then
            arguments=$(cat "./$file_dir/arguments")
            if ! echo "$arguments" | grep -Eq "$arguments_regex";then
                echo "mygive-test: invalid arguments: $arguments" 1>&2
                exit "$exit_status"
            fi
        fi

        if [ -f "./$file_dir/stdin" ];then
            stdin=$(cat "./$file_dir/stdin")
        fi
       
        if [ -f "./$file_dir/stdout" ];then
            stdout=$(cat "./$file_dir/stdout")
        fi

        if [ -f "./$file_dir/stderr" ];then
            stdout=$(cat "./$file_dir/stderr")
        fi

        if [ -f "./$file_dir/options" ];then
            stdout=$(cat "./$file_dir/options")
        fi

        echo "arguments: $arguments"
        echo "stdin: $stdin"
        echo "stdout: $stdout"

        result=$(echo "$stdin" | ./"$program_file" $arguments)
        echo "result: $result"

        if echo "$options" | grep -q "b"; then
            result=$(echo "$result" | sed "/^$/d")
        fi

        if echo "$options" | grep -q "c"; then
           result=$(echo "$result" | tr "[:upper:]" "[:lower:]")
        fi

        if echo "$options" | grep -q "w"; then
           result=$(echo "$result" | tr -d ' \t')
        fi

        if echo "$options" | grep -q "d"; then
            result=$(echo "$result" | sed 's/[^0-9\n]//g')
        fi

        if [ "$result" = "$stdout" ];then
            echo "* Test $file_name passed."
            passed_tests=$((passed_tests+1))
        else
            echo "* Test $file_name failed."
            failed_tests=$((failed_tests+1))
        fi
   done < "$tmp_list"
#    rm -rf "$test_dir"
done

echo "** $passed_tests tests passed, $failed_tests tests failed"

