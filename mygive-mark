#!/bin/dash

ass_name="$1"

# check if assignment name is valid
if [ "$(echo "$ass_name" | grep -Ec '^[a-z][a-zA-Z0-9_]*$')" -ne 1 ]; then
    echo "mygive-test: invalid assignment: $ass_name" 1>&2
    exit 1
fi

base_dir=".mygive/$ass_name"

tmp_l=$(mktemp)
find "$base_dir" -type d -maxdepth 1 | grep '/z[0-9]\{7\}$' > "$tmp_l"

while read -r zid; do

    passed_tests=0
    failed_tests=0
    total_marks=0
    curr_marks=0

    zid=$(basename $zid)
    zid_dir="$base_dir/$zid"

    submission=$( ls -1d "$zid_dir/"* 2>/dev/null | sed 's/.*\///' | sort | tail -n1)
    submission_time=$(cat "$zid_dir/$submission/.timestamp")
    file_name=$(find "$zid_dir/$submission" -maxdepth 1 -type f ! -name "*.timestamp" -print0 | xargs -0 -n1 basename)
    program_file="$zid_dir/$submission/$file_name"
    #file_size=$(stat -c%s "$file_name")
    file_size=$(stat -f"%z" "$zid_dir/$submission/$file_name")
    echo "Student $zid - submission $submission: $file_name $file_size bytes @ $submission_time"

    for test_file in $base_dir/tests/*; do
        test_dir=$(basename $test_file | cut -d'.' -f1)
        mkdir -p "$test_dir"
        tar -xzf "$test_file" -C "$test_dir"

        tmp_list=$(mktemp)
        find "$test_dir" -type d -name "*marking*" > "$tmp_list"
        while read -r file_dir; do
                file_name=$(basename $file_dir)
                arguments=$(cat "./$file_dir/arguments")
                marks=$(cat "./$file_dir/marks")
                stdin=$(cat "./$file_dir/stdin")
                stdout=$(cat "./$file_dir/stdout")

                result=$(echo "$stdin" | "$program_file" $arguments)
                total_marks=$((total_marks+marks))

                if [ "$result" = "$stdout" ];then
                    echo "* Test $file_name passed ($marks marks)."
                    passed_tests=$((passed_tests+1))
                    curr_marks=$((curr_marks+marks))
                else
                    echo "* Test $file_name failed."
                    failed_tests=$((failed_tests+1))
                fi
        done < "$tmp_list"
        #    rm -rf "$test_dir"
    done
    echo "** $passed_tests tests passed, $failed_tests tests failed - mark: $curr_marks/$total_marks"
done < "$tmp_l"



