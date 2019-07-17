from debian

workdir /doc
copy . /doc

run apt-get update && apt-get install -y ruby ruby-dev make gcc g++
run gem install jekyll bundler minima && bundle install

cmd bundle exec jekyll serve -LR 4001