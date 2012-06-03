require "sinatra"
get ('/') { send_file "public/index.html" }