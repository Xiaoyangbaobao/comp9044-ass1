#! /usr/bin/env dash

min_year=2019
max_year=2025
program_name="$0"

case $# in
  2)
    YEAR=$1
    CODE=$2
    ;;
  *)
    echo "Usage: ${program_name} <year> <course-prefix>" >& 2
    exit 1
esac

if [ "${YEAR}" -ge "${min_year}" ] 2> /dev/null && [ "${YEAR}" -le "${max_year}" ] 2> /dev/null; then
  :
else
  echo "${program_name}: argument 1 must be an integer between ${min_year} and ${max_year}" >& 2
  exit 1
fi

# `env printf` uses the binary `printf` not the shell builtin
# this is because different shells have different builtin `printf` commands
# dash `printf` doesn't support `\u`
SPACES=$(env printf "%b" "\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u2028\u2029\u202F\u205F\u3000")

curl -Ls "https://handbook-proxy.cse.unsw.edu.au/current/api/search-all?searchType=advanced&siteId=unsw-prod-pres&query=&siteYear=${YEAR}" |
# TODO: explain this jq command
# NOTE: gsub is here to remove non-breaking spaces, but autotest will do this for students so it is not necessary
jq -r '
  .data.results[] |
  select(
    .contentTypeLabel == "Course"
    and
    (
      .lines[1] == "Undergraduate"
      or
      .lines[1] == "Postgraduate"
    )
  ) |
  select(
    .code | test("^'"${CODE}"'")
  ) |
  (
    .code + " " + .title |
    gsub("[[:space:]'"${SPACES}"']"; " ")
  )
' |
tr -s ' ' | # squeeze whitespace (all whitespace will just be spaces after the previous command)
sed 's/ $//' | # remove trailing whitespace (there can only be one trailing space after the previous command)
# remove duplicate lines
sort | uniq
