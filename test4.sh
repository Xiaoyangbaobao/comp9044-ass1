#! /usr/bin/env dash

#test mygive-fetch

# Create a temporary directory for the test and retrieve the provided test files
test_dir="$(mktemp -d)"
cd "$test_dir" || exit 1
2041 fetch mygive

# Create a temporary directory for the reference and retrieve the provided test files
ref_dir="$(mktemp -d)"
cd "$ref_dir" || exit 1
2041 fetch mygive

# Create some files to hold output.

expected_stdout="$(mktemp)"
expected_stderr="$(mktemp)"
actual_stdout="$(mktemp)"
actual_stderr="$(mktemp)"

# Remove the temporary directory when the test is done.

trap 'rm "$expected_stdout" "$expected_stderr" "$actual_stdout" "$actual_stderr" -r "$test_dir"' INT HUP QUIT TERM EXIT

# Create mygive assessment

cd "$ref_dir" || exit 1
2041 mygive-add  ass_test multiply.test > "$expected_stdout" 2> "$expected_stderr"
ref_exit_code=$?

cd "$test_dir" || exit 1
mygive-add  ass_test multiply.test > "$actual_stdout" 2> "$actual_stderr"
exit_code=$?

# make first submission
cd "$ref_dir" || exit 1
2041 mygive-submit ass_test z5123456 multiply.sh > "$expected_stdout" 2> "$expected_stderr"
ref_exit_code=$?

cd "$test_dir" || exit 1
./mygive-submit ass_test z5123456 multiply.sh  > "$actual_stdout" 2> "$actual_stderr"
exit_code=$?

#make second submission as first student
cd "$ref_dir" || exit 1
2041 mygive-submit ass_test z5123456 multiply_wrong.sh > "$expected_stdout" 2> "$expected_stderr"
ref_exit_code=$?

cd "$test_dir" || exit 1
./mygive-submit ass_test z5123456 multiply_wrong.sh  > "$actual_stdout" 2> "$actual_stderr"
exit_code=$?

#test mygive-fetch which should print the first student latest submission

cd "$ref_dir" || exit 1
2041 mygive-fetch ass_test z51234567 > "$expected_stdout" 2> "$expected_stderr"
ref_exit_code=$?

cd "$test_dir" || exit 1
./mygive-fetch z51234567 > "$actual_stdout" 2> "$actual_stderr"
exit_code=$?
if ! diff "$expected_stdout" "$actual_stdout" >/dev/null 2>&1; then
    echo "Failed test - stdout differs"
    diff "$expected_stdout" "$actual_stdout"
    exit 1
fi

if ! diff "$expected_stderr" "$actual_stderr" >/dev/null 2>&1; then
    echo "Failed test - stderr differs"
    diff "$expected_stderr" "$actual_stderr"
    exit 1
fi

if [ "$exit_code" -ne "$ref_exit_code" ]; then
    echo "Failed test - exit code differs"
    echo "Expected: $ref_exit_code"
    echo "Got: $exit_code"
    exit 1
fi

#test mygive-fetch search first student first submission

cd "$ref_dir" || exit 1
2041 mygive-fetch ass_test z51234567 1 > "$expected_stdout" 2> "$expected_stderr"
ref_exit_code=$?

cd "$test_dir" || exit 1
./mygive-fetch z51234567 1 > "$actual_stdout" 2> "$actual_stderr"
exit_code=$?
if ! diff "$expected_stdout" "$actual_stdout" >/dev/null 2>&1; then
    echo "Failed test - stdout differs"
    diff "$expected_stdout" "$actual_stdout"
    exit 1
fi

if ! diff "$expected_stderr" "$actual_stderr" >/dev/null 2>&1; then
    echo "Failed test - stderr differs"
    diff "$expected_stderr" "$actual_stderr"
    exit 1
fi

if [ "$exit_code" -ne "$ref_exit_code" ]; then
    echo "Failed test - exit code differs"
    echo "Expected: $ref_exit_code"
    echo "Got: $exit_code"
    exit 1
fi

# All tests passed.
echo "All tests passed."
