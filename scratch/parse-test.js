const parse = require('pg-connection-string').parse;
const str = "postgres://postgres.eehktxhhpsdffpwlxghm:Rafimn21041999.@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres";
console.log(parse(str));
